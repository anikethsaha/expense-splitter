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
            const docId = await this.expenseRepo.createExpense(expense);
            expenseIds.push(docId);
          }

          const expensesIdsToDelete = existingSplit.expenses.filter(
            (id) => !expenseIds.includes(id)
          );

          const newSplit: Split = {
            ...split,
            expenses: expenseIds,
          };
          const response = await this.db.put({
            ...newSplit,
            _id: split.id,
            _rev: existingSplit._rev,
          });
          console.log("Split updated :", response);
          for (const id of expensesIdsToDelete) {
            await this.expenseRepo.addDeleteStatusExpense(id);
          }
          return split.id;
        }
      }
      // check if already exists

      // Create expenses first
      const expenseIds: string[] = [];
      for (const expense of split.expenses) {
        const docId = await this.expenseRepo.createExpense(expense);
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
      console.log("Split created :", response);
      return id;
    } catch (error) {
      throw new Error("Failed to create or update the split: " + error.message);
    }
  }
}
