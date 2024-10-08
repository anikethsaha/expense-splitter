import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Group } from "src/models/Group";
import { FrontendSplit, Split, SplitType } from "src/models/Split";
import { User } from "src/models/user";
import { UserRepo } from "src/repos/UserRepo";
import {
  splitCreatorSlice,
  useSplitCreatorStore,
} from "src/stores/SplitCreator.store";
import { useLoggedInUser } from "src/stores/User.store";
import { SplitHelper } from "../helpers/SplitHelper";
import { SplitRepo } from "src/repos/SplitRepo";
import { FrontendExpense } from "src/models/Expense";

const userRepo = new UserRepo();
const splitHelper = new SplitHelper();
const splitRepo = new SplitRepo();

export const useSplitCreatorHelper = (onError?: (err: string) => void) => {
  const [unFinishedStep, setUnFinishedStep] = useState(1);
  const dispatcher = useDispatch();
  const splitCreatorState = useSplitCreatorStore();
  const currentUser = useLoggedInUser();

  useEffect(() => {
    if (!splitCreatorState?.users && !splitCreatorState?.group) {
      setUnFinishedStep(1);
    }
  }, [splitCreatorState]);

  const setUsers = (users: User[]) => {
    dispatcher(
      splitCreatorSlice.actions.feedStepOneData({
        users,
        group: undefined,
        segmentType: "user",
      })
    );
  };

  const getMemberList = useCallback(async () => {
    if (splitCreatorState?.segmentType === "group") {
      const group = splitCreatorState?.group;
      if (group) {
        let groupMembers = await userRepo.getAllUsersByIds(group.user_ids);
        groupMembers = groupMembers.filter(
          (member) => member.id !== currentUser?.id
        );

        return [{ ...currentUser, name: "You" }, ...groupMembers];
      }
    }

    return [
      { ...currentUser, name: "You" },
      ...(splitCreatorState?.users?.filter(
        (user) => user.id !== currentUser?.id
      ) ?? []),
    ];
  }, [JSON.stringify(splitCreatorState), currentUser?.id]);

  const setGroup = (group: Group | null) => {
    dispatcher(
      splitCreatorSlice.actions.feedStepOneData({
        users: undefined,
        group,
        segmentType: "group",
      })
    );
  };

  const goNext = (currentStepNumber: number) => {
    if (currentStepNumber >= 1) {
      const hasData =
        splitCreatorState?.users?.length > 0 || splitCreatorState?.group;
      if (!hasData) {
        onError?.("Please select a group or users");
        return;
      }

      if (currentStepNumber === 1) {
        setUnFinishedStep(2);
        return;
      }
    }

    if (currentStepNumber >= 2) {
      if (!splitCreatorState?.splitName) {
        onError?.("Please enter a split name");
        return;
      }
      if (!splitCreatorState?.splitAmount) {
        onError?.("Please enter a split amount");
        return;
      }

      if (!splitCreatorState?.paidBy) {
        onError?.("Please select a paid by user");
        return;
      }
      if (currentStepNumber === 2) {
        setUnFinishedStep(3);
        return;
      }
    }
  };

  const selectSplitType = (type: SplitType, allMemebers: User[]) => {
    const initialSplitInfo = splitHelper.getInitialMemberAmount(
      allMemebers,
      type,
      splitCreatorState?.splitAmount ?? 0
    );

    dispatcher(
      splitCreatorSlice.actions.updateSplitType({
        type,
        memberAmount: initialSplitInfo[type]?.memberAmount,
      })
    );
  };

  /**
   * this validates
   * and creates a split or updates an existing split
   * @returns
   */
  const validateAndCreateSplit = async () => {
    const error = splitHelper.validateSplit({ ...splitCreatorState });
    if (error) {
      onError?.(error.msg);
      setUnFinishedStep(error.step);
      return;
    }

    try {
      if (splitCreatorState.id) {
        // update split
        const id = await splitHelper.runSplitEditor(
          { ...currentUser! },
          { ...splitCreatorState }
        );

        return id;
      }

      const payload = await splitHelper.preparePayload(
        { ...currentUser! },
        { ...splitCreatorState }
      );

      const split = await splitRepo.createOrUpdateSplit(
        payload as unknown as FrontendSplit
      );

      return split;
    } catch (error) {
      console.error("Error creating split:", error);
      onError?.("Error creating split");
      return;
    }
  };

  const fillStoreForEditSplit = async (id: string) => {
    const split = await splitRepo.getSplitById(id);

    if (split) {
      try {
        const splitCreatorState = await splitHelper.getStateFromSplit(split);

        dispatcher(splitCreatorSlice.actions.fill(splitCreatorState));
        setUnFinishedStep(1);
      } catch (error) {
        console.log(error);
        onError?.("Error getting split data");
      }
    } else {
      onError?.("Split not found");
    }
  };

  return {
    unFinishedStep,
    totalMembers:
      splitCreatorState?.segmentType === "group"
        ? splitCreatorState?.group?.user_ids?.length
        : splitCreatorState?.users?.length ?? 0,
    setUsers,
    setGroup,
    users: splitCreatorState?.users,
    group: splitCreatorState?.group,
    goNext,
    getMemberList,
    paidBy: splitCreatorState?.paidBy,
    amount: splitCreatorState?.splitAmount,
    selectSplitType,
    splitType: splitCreatorState?.splitType,
    splitInfo: splitCreatorState?.splitInfo,
    validateAndCreateSplit,
    fillStoreForEditSplit,
    splitName: splitCreatorState?.splitName,
    id: splitCreatorState?.id,
  };
};
