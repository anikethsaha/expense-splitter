import { Expense, expenseDbInstance } from "src/models/Expense";

export class ExpenseRepo {
  private db: PouchDB.Database<Expense>;

  constructor() {
    this.db = expenseDbInstance;
  }

  // Find all expenses between two user IDs
  async findExpensesBetweenUsers(
    userId1: string,
    userId2: string
  ): Promise<Expense[]> {
    try {
      const result = await this.db.find({
        selector: {
          $or: [
            { borrower_id: userId1, lender_id: userId2 },
            { borrower_id: userId2, lender_id: userId1 },
          ],
        },
      });

      return result.docs as Expense[];
    } catch (error) {
      throw new Error(
        "Failed to find expenses between users: " + error.message
      );
    }
  }
}
