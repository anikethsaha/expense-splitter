import { FrontendExpense } from "src/models/Expense";
import { FrontendSplit, Split, splitDbInstance } from "src/models/Split";
import { ExpenseRepo } from "src/repos/ExpenseRepo";
import { v4 as uuidv4 } from "uuid";

export class SplitRepo {
  private db: PouchDB.Database<Split>;
  private expenseRepo: ExpenseRepo;

  constructor() {
    this.db = splitDbInstance;
    this.expenseRepo = new ExpenseRepo();
  }

  async getSplitById(splitId: string): Promise<Split | null> {
    try {
      return this.db.get(splitId);
    } catch (error) {
      throw new Error("Failed to get split by ID: " + error.message);
    }
  }

  getAllSplitsByGroupId(groupId: string): Promise<Split[]> {
    return this.db
      .find({
        selector: { group_id: groupId },
      })
      .then((result) => result.docs);
  }

  async createOrUpdateSplit(split: FrontendSplit) {
    try {
      if (split.id) {
        const existingSplit = await this.db.get(split.id);
        if (existingSplit) {
          const expenseIds: string[] = [];
          for (const expense of split.expenses) {
            const docId = await this.expenseRepo.createOrUpdateExpense(expense);
            expenseIds.push(docId);
          }

          const expensesIdsToDelete = existingSplit.expenses.filter(
            (id) => !expenseIds.includes(id)
          );

          const newSplit: Split = {
            ...split,
            expenses: expenseIds,
          };

          const response = await this.db.upsert(split.id, (doc) => {
            doc = { ...doc, ...newSplit, updated_at: new Date().toISOString() };
            return doc;
            // _id: split.id,
            // _rev: existingSplit._rev,
          });

          for (const id of expensesIdsToDelete) {
            await this.expenseRepo.addDeleteStatusExpense(id);
          }
          return split.id;
        }
      }

      // Create expenses first
      const expenseIds: string[] = [];
      for (const expense of split.expenses) {
        const docId = await this.expenseRepo.createOrUpdateExpense(expense);
        expenseIds.push(docId);
      }

      // Attach created expense IDs to the split
      const id = uuidv4();
      const newSplit: Split = {
        ...split,
        id,

        expenses: expenseIds,
      };

      // Save split to the database
      const response = await this.db.put({ ...newSplit, _id: id });

      return id;
    } catch (error) {
      throw new Error("Failed to create or update the split: " + error.message);
    }
  }

  async createOrUpdateSplitRaw(split: Split) {
    try {
      if (split.id) {
        const existingSplit = await this.db.get(split.id);
        if (existingSplit) {
          const response = await this.db.upsert(split.id, (doc) => {
            doc = {
              ...doc,
              ...split,
              _id: existingSplit.id,
              _rev: existingSplit._rev,
              updated_at: new Date().toISOString(),
            };
            return doc;
          });

          if (!response.updated) {
            throw new Error("Failed to update the split");
          }

          return split.id;
        }
      }

      const id = uuidv4();
      const response = await this.db.put({
        ...split,
        id,
        _id: id,
      });

      return id;
    } catch (error) {
      throw new Error("Failed to create or update the split: " + error.message);
    }
  }

  async getSplitByExpenseId(expenseId: string): Promise<Split | null> {
    try {
      const result = await this.db.find({
        selector: {
          expenses: { $in: [expenseId] },
        },
      });

      if (result.docs.length > 0) {
        return result.docs[0];
      }
      return null;
    } catch (error) {
      throw new Error("Failed to get split by expense ID: " + error.message);
    }
  }
}
