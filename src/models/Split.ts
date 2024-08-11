import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";
import { Expense, FrontendExpense } from "./Expense";
import { User } from "./user";

PouchDB.plugin(PouchDBFind);

export enum SplitType {
  EQUAL = "EQUAL",
  PERCENTAGE = "PERCENTAGE",
  ABSOLUTE = "ABSOLUTE",
}

export enum FrontendSplitType {
  LEND = "LEND",
  BORROW = "BORROW",
}

export type SplitInfoType = {
  [key in SplitType]?: {
    memberAmount: { [key: string]: { amount?: number; percentage?: number } };
  };
};

export interface Split {
  id: string;
  amount: number;
  name: string;
  desc: string;
  paid_by: string;
  split_type: SplitType;
  split_info: SplitInfoType;
  expenses: string[];
  group_id?: string;
  created_at: Date;
  updated_at: Date;
}

// these props should be fill by frontend hooks
export interface FrontendSplit extends Omit<Split, "expenses"> {
  expenses: FrontendExpense[];
}

export const SPLIT_DB_NAME = "split";

export const splitDbInstance = new PouchDB<Split>(SPLIT_DB_NAME);
splitDbInstance.createIndex(
  {
    index: { fields: ["paid_by"] },
  },
  (err) => {
    if (err) {
      console.error(SPLIT_DB_NAME + "  Error creating index:", err);
    }
  }
);
