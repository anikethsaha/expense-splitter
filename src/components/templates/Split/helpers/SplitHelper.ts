import { Expense, FrontendExpense, Status } from "src/models/Expense";
import { FrontendSplit, Split, SplitType } from "src/models/Split";
import { User } from "src/models/user";
import { ExpenseRepo } from "src/repos/ExpenseRepo";
import { FriendRepo } from "src/repos/FriendRepo";
import { GroupRepo } from "src/repos/GroupRepo";
import { SplitRepo } from "src/repos/SplitRepo";
import { UserRepo } from "src/repos/UserRepo";
import { SplitCreatorState } from "src/stores/SplitCreator.store";

const userRepo = new UserRepo();
const friendRepo = new FriendRepo();
const expenseRepo = new ExpenseRepo();
const groupRepo = new GroupRepo();
const splitRepo = new SplitRepo();

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
        splitInfo[splitType]!.memberAmount[member.phone_number!] = {
          amount: Math.abs(amount / members.length),
        };
      });
    }

    if (splitType === SplitType.PERCENTAGE) {
      const totalMemberCount = members.length;
      const eachMemberPercentage = 100 / totalMemberCount;

      members.forEach((member) => {
        splitInfo[splitType]!.memberAmount[member.phone_number!] = {
          amount: Math.floor(eachMemberPercentage),
        };
      });
    }

    if (splitType === SplitType.ABSOLUTE) {
      members.forEach((member) => {
        splitInfo[splitType]!.memberAmount[member.phone_number!] = {
          amount: Math.abs(amount / members.length),
        };
      });
    }
    console.log({ splitInfo });
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

  runSplitEditor = async (currentUser: User, newSplit: SplitCreatorState) => {
    // get the current Split from db
    // store the create_at date
    // get the current expenses from db
    // two cases, if paid by is changed or not
    // if paid by is changed (1st)
    //  -> delete all expenses
    //  -> create new ones
    //  -> add them to the split
    // if paid by is not changed (2nd)
    // -> calculate the new expenses from current fe expenses and paid by
    // -> iterate through the old expense now
    //    -> if this expense present in new (how to know ? same borrow and lender)
    //    -> update the expense (what update ? amount and updated_at)
    //    -> if not present, then this has been deleted, so delete the expense.
    //    -> while iterating, have a array that will store the store the new expense which has been updated (deleted will never happen)
    // -> iterate through the new expenses
    //    -> if this expense is not present in the array, then this is a new expense, so create it.

    const dbSplit = await splitRepo.getSplitById(split.id!);
    if (!dbSplit) {
      throw new Error("Split not found");
    }

    const dateThisSplitCreated = dbSplit.created_at;
    const oldExpenses = await expenseRepo.getAllExpensesByIds(dbSplit.expenses);

    if (newSplit.paidBy?.id !== dbSplit.paid_by) {
      // 1st
      // delete all expenses
      const deletePromises = oldExpenses.map((expense) =>
        expenseRepo.addDeleteStatusExpense(expense.id)
      );
      await Promise.all(deletePromises);

      const updatedSplit = await this.preparePayload(currentUser, newSplit);
      const payload = {
        ...dbSplit,
        ...updatedSplit,
        created_at: dateThisSplitCreated,
      };
      // this method will itself create the new expenses and new split
      await splitRepo.createOrUpdateSplit(payload);
      return payload.id;
    }

    // 2nd
    const newExpenses = this.getNewExpenses(
      newSplit.users!,
      newSplit.paidBy,
      newSplit.splitInfo,
      newSplit.splitType!
    );

    const updatedExpenses: Expense[] = [];
    const newExpensesIds: string[] = [];

    // iterate through the old expenses
    for (const oldExpense of oldExpenses) {
      const newExpense = newExpenses.find(
        (expense) =>
          expense.borrower_id === oldExpense.borrower_id &&
          expense.lender_id === oldExpense.lender_id
      );

      if (newExpense) {
        // update the expense
        const updatedExpense: Expense = {
          ...oldExpense,
          amount: newExpense.amount,
          updated_at: new Date(),
        };
        await expenseRepo.createOrUpdateExpense(updatedExpense);
        updatedExpenses.push(updatedExpense);
      } else {
        // delete the expense
        await expenseRepo.addDeleteStatusExpense(oldExpense.id);
      }
    }

    // iterate through the new expenses
    for (const newExpense of newExpenses) {
      const oldExpense = oldExpenses.find(
        (expense) =>
          expense.borrower_id === newExpense.borrower_id &&
          expense.lender_id === newExpense.lender_id
      );

      if (!oldExpense) {
        // create the expense
        const newExpenseId = await expenseRepo.createOrUpdateExpense(
          newExpense
        );
        newExpensesIds.push(newExpenseId);
      }
    }

    const payload: Split = {
      ...dbSplit,
      name: newSplit.splitName!,
      amount: newSplit.splitAmount!,
      split_info: newSplit.splitInfo!,
      split_type: newSplit.splitType!,
      expenses: [...newExpensesIds, ...updatedExpenses.map((e) => e.id)],
      updated_at: new Date(),
    };

    const responseId = await splitRepo.createOrUpdateSplitRaw(payload);
    return responseId;
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

    const partialExpenses: Omit<FrontendSplit, "id">[] = this.getNewExpenses(
      users,
      paidBy,
      splitInfo,
      splitType!
    );

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

  getNewExpenses = (
    users: User[],
    paidBy: User,
    splitInfo: Split["split_info"],
    splitType: SplitType
  ) => {
    const partialExpenses: Omit<FrontendExpense, "id">[] = users
      .map((user) => {
        if (paidBy!.phone_number === user.phone_number) return;
        return {
          amount:
            splitInfo[splitType!]?.memberAmount[user.phone_number!]?.amount ??
            0,
          borrower_id: user.id,
          lender_id: paidBy!.id,
          status: Status.OPEN,
          created_at: new Date(),
          updated_at: new Date(),
        };
      })
      .filter((expense) => expense !== undefined);

    return partialExpenses;
  };

  // preUpdatePayload = async(

  getStateFromSplit = async (split: Split): Promise<SplitCreatorState> => {
    try {
      const splitType = split.split_type;
      const splitInfo = split.split_info;
      const splitAmount = split.amount;
      const splitName = split.name;

      const expenseIds = split.expenses;

      const expensePromises = expenseIds.map((expense) =>
        expenseRepo.getExpenseById(expense)
      );
      const expenses = (await Promise.all(expensePromises)) as Expense[];

      const userIdsInvoled = expenses.map((expense) => {
        return [expense.borrower_id, expense.lender_id];
      });

      const userIds = userIdsInvoled.flat();
      const users = await userRepo.getAllUsersByIds(userIds);

      const paidBy = (await userRepo.getAllUsersByIds([split.paid_by]))[0];
      let group = undefined;
      if (split.group_id) {
        group = await groupRepo.getGroupById(split.group_id);
      }

      return {
        splitType,
        splitInfo,
        splitAmount,
        splitName,
        paidBy,
        group,
        users,
        segmentType: group ? "group" : "user",
        id: split.id,
      };
    } catch (error) {
      return {};
    }
  };
}
