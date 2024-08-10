import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";
import { User } from "./user";

PouchDB.plugin(PouchDBFind);

export enum Status {
  OPEN = "OPEN",
  PAID = "PAID",
  DELETE = "DELETE",
}

export interface Expense {
  id: string;
  borrower_id: string;
  lender_id: string;
  amount: number;
  status: Status;
  created_at: Date;
  updated_at: Date;
}

export interface FrontendExpense extends Expense {
  borrower_user: User;
  lender_user: User;
}

export const EXPENSE_DB_NAME = "expense";

export const expenseDbInstance = new PouchDB<Expense>(EXPENSE_DB_NAME);
expenseDbInstance.createIndex(
  {
    index: { fields: ["borrower_id"] },
  },
  (err) => {
    if (err) {
      console.error(EXPENSE_DB_NAME + " Error creating index:", err);
    }
  }
);
