import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";
import { Expense, FrontendExpense } from "./Expense";
import { User } from "./user";

PouchDB.plugin(PouchDBFind);

export enum SplitType {
  EQUAL = "EQUAL",
  CUSTOM = "CUSTOM",
}

export enum CustomSplitType {
  PERCENTAGE = "PERCENTAGE",
  ABSOLUTE = "ABSOLUTE",
}

export enum FrontendSplitType {
  LEND = "LEND",
  BORROW = "BORROW",
}

export type CustomSplitInfo = {
  type: CustomSplitType;
};

export interface Split {
  id: string;
  amount: number;
  name: string;
  desc: string;
  paid_by: string;
  split_type: SplitType;
  custom_split_info?: CustomSplitInfo;
  expenses: Expense[];
  group_id?: string;
  created_at: Date;
  updated_at: Date;
}

// these props should be fill by frontend hooks
export interface FrontendSplit extends Split {
  paid_by_user: User;
  expenses: FrontendExpense[];
  type: FrontendSplitType;
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
