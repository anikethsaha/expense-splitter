import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { useSelector } from "react-redux";
import { Group } from "src/models/Group";
import { User } from "src/models/user";
import { RootState } from "./redux.store";
import { Split, SplitType } from "src/models/Split";
// Define a type for the slice state
export interface SplitCreatorState {
  users?: User[];
  group?: Group;
  segmentType?: "group" | "user";
  paidBy?: User;
  splitAmount?: number;
  splitType?: SplitType;
  splitName?: string;
  splitInfo: Split["split_info"];
  id?: string;
}

// Define the initial state using that type
const initialState: SplitCreatorState = {
  splitInfo: {},
  splitType: SplitType.EQUAL,
  splitName: "",
  paidBy: undefined,
  group: undefined,
  users: undefined,
  segmentType: "user",
  splitAmount: undefined,
};

export const splitCreatorSlice = createSlice({
  name: "splitCreator",
  initialState,
  reducers: {
    fill(state, action: PayloadAction<SplitCreatorState>) {
      state = { ...action.payload };
      return state;
    },
    // this is grouped as this is either or ops mostly
    feedStepOneData: (
      state,
      action: PayloadAction<{
        users?: User[];
        group?: Group | null;
        segmentType: "group" | "user";
      }>
    ) => {
      state.users = action.payload.users;
      state.group = action.payload.group;
      state.segmentType = action.payload.segmentType;
    },
    updateSplitAmount: (state, action: PayloadAction<number>) => {
      state.splitAmount = action.payload;
    },
    updateSplitType: (
      state,
      action: PayloadAction<{
        type: SplitType;
        memberAmount: {
          [key: string]: {
            amount?: number;
            percentage?: number | undefined;
          };
        };
      }>
    ) => {
      console.log({ "action.payload": action.payload });
      state.splitType = action.payload.type;

      state.splitInfo = {
        [action.payload.type]: {
          memberAmount: action.payload.memberAmount,
        },
      };
    },

    updateMemberPercentage: (
      state,
      action: PayloadAction<{ phone_number: string; percentage: number }>
    ) => {
      state.splitInfo[state.splitType].memberAmount[
        action.payload.phone_number
      ].percentage = action.payload.percentage;
    },
    updateMemberAbsolute: (
      state,
      action: PayloadAction<{ phone_number: string; amount: number }>
    ) => {
      state.splitInfo[state.splitType].memberAmount[
        action.payload.phone_number
      ].amount = action.payload.amount;
    },

    updateSplitName: (state, action: PayloadAction<string>) => {
      state.splitName = action.payload;
    },
    updatePaidBy: (state, action: PayloadAction<User>) => {
      state.paidBy = action.payload;
    },
  },
});

export const useSplitCreatorStore = () =>
  useSelector<RootState, SplitCreatorState>((state) => state.splitCreator);
