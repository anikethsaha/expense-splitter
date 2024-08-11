import { Expense, Status } from "src/models/Expense";
import { FrontendSplit, Split, SplitType } from "src/models/Split";
import { User } from "src/models/user";
import { FriendRepo } from "src/repos/FriendRepo";
import { UserRepo } from "src/repos/UserRepo";
import { SplitCreatorState } from "src/stores/SplitCreator.store";

const userRepo = new UserRepo();
const friendRepo = new FriendRepo();

export class SplitHelper {
  getInitialMemberAmount = (
    members: User[],
    splitType: SplitType,
    amount: number
  ) => {
    const splitInfo: Split["split_info"] = {
      [splitType]: {
        memberAmount: {},
      },
    };

    if (splitType === SplitType.EQUAL) {
      members.forEach((member) => {
        splitInfo[splitType]!.memberAmount[member.id] = {
          amount: Math.abs(amount / members.length),
        };
      });
    }

    if (splitType === SplitType.PERCENTAGE) {
      const totalMemberCount = members.length;
      const eachMemberPercentage = 100 / totalMemberCount;

      members.forEach((member) => {
        splitInfo[splitType]!.memberAmount[member.id] = {
          amount: Math.floor(eachMemberPercentage),
        };
      });
    }

    if (splitType === SplitType.ABSOLUTE) {
      members.forEach((member) => {
        splitInfo[splitType]!.memberAmount[member.id] = {
          amount: Math.abs(amount / members.length),
        };
      });
    }
    return splitInfo;
  };

  validateSplit = (split: SplitCreatorState) => {
    if (!split.users && !split.group) {
      return { msg: "Please select users or a group", step: 1 };
    }

    if (!split.splitAmount) {
      return { msg: "Amount is required", step: 2 };
    }
    if (!split.splitName) {
      return { msg: "Name is required", step: 2 };
    }
    if (!split.paidBy) {
      return { msg: "Paid by is required", step: 2 };
    }
    if (!split.splitType) {
      return { msg: "Split type is required", step: 3 };
    }
    if (!split.splitInfo) {
      return { msg: "Split info is required", step: 3 };
    }

    // verify split info
    if (
      split.splitType === SplitType.PERCENTAGE ||
      split.splitType === SplitType.EQUAL
    ) {
      const totalAmount = Object.values(
        split.splitInfo[split.splitType]!.memberAmount
      ).reduce((acc, val) => Number(acc) + Number(val.amount ?? 0), 0);
      if (Math.floor(totalAmount) !== Math.floor(split.splitAmount)) {
        return { msg: "Total amount should be equal to split amount", step: 3 };
      }
    }

    if (split.splitType === SplitType.PERCENTAGE) {
      const totalPercentage = Object.values(
        split.splitInfo[split.splitType]!.memberAmount
      ).reduce((acc, val) => Number(acc) + Number(val.percentage ?? 0), 0);
      if (totalPercentage !== 100) {
        return { msg: "Total percentage should be equal to 100", step: 3 };
      }
    }
  };

  preparePayload = async (
    currentUser: User,
    split: SplitCreatorState
  ): Promise<Omit<FrontendSplit, "id">> => {
    const splitInfo = split.splitInfo;
    const splitType = split.splitType;
    const splitAmount = split.splitAmount;
    const splitName = split.splitName;
    let paidBy = split.paidBy;
    // flat users
    let users: User[] = [];
    if (split.segmentType === "user") {
      users = [currentUser, ...split.users!];
    } else {
      const grpUserId = split.group?.user_ids ?? [];
      const grpUsers = await userRepo.getAllUsersByIds(grpUserId);
      const filtedGrpUsers = grpUsers.filter(
        (user) => user.id !== currentUser.id
      );
      users = [currentUser, ...filtedGrpUsers];
    }

    // if paidBy is new user, create user and friend
    if (!paidBy?.id) {
      const newPaidBy = await userRepo.createOrUpdateUser(
        paidBy!.phone_number!,
        paidBy!.name ?? ""
      );
      paidBy = { ...newPaidBy };
      await friendRepo.createFriend(
        currentUser.id,
        currentUser.name,
        newPaidBy.id,
        newPaidBy.name
      );

      // create friends with all users
      const friendPromises = users.map((user) =>
        friendRepo.createFriend(
          newPaidBy!.id,
          newPaidBy!.name ?? "",
          user.id,
          user.name
        )
      );
      const newFriendWithPaidBy = await Promise.all(friendPromises);
      console.log({ newFriendWithPaidBy });
    }

    // handle new users

    const newUsers = users.filter((user) => !user.id);
    console.log({ newUsers });
    if (newUsers.length > 0) {
      const promises = newUsers.map((user) =>
        userRepo.createOrUpdateUser(user.phone_number!, user.name)
      );

      const newCompleteUsers = await Promise.all(promises);
      console.log({ newCompleteUsers });

      // create friends with newUsers.id with paidBy.id

      const newFriendPromises = newCompleteUsers.map((user) =>
        friendRepo.createFriend(
          paidBy!.id,
          paidBy!.name ?? "",
          user.id,
          user.name
        )
      );
      console.log({ newFriendPromises });

      await Promise.all(newFriendPromises);

      users = users.map((user) => {
        if (!user.id) {
          const newUser = newCompleteUsers.find(
            (u) => u.phone_number === user.phone_number
          );
          if (newUser) {
            return newUser;
          }
        }
        return user;
      });
    }

    console.log({ users });

    const partialExpenses: Omit<FrontendSplit, "id">[] = users
      .map((user) => {
        if (paidBy!.phone_number === user.phone_number) return;
        return {
          amount: splitInfo[splitType!]?.memberAmount[user.id]?.amount ?? 0,
          borrower_id: user.id,
          lender_id: paidBy!.id,
          status: Status.OPEN,
          created_at: new Date(),
          updated_at: new Date(),
        };
      })
      .filter((expense) => expense !== undefined);

    return {
      amount: splitAmount!,
      desc: splitName!,
      group_id: split.group?.id,
      name: splitName!,
      paid_by: paidBy!.id,
      split_info: splitInfo!,
      split_type: splitType!,
      expenses: partialExpenses,
      created_at: new Date(),
      updated_at: new Date(),
    };
  };
}
