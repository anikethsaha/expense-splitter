import { Expense, Status, expenseDbInstance } from "src/models/Expense";
import { v4 as uuidv4 } from "uuid";
export class ExpenseRepo {
  private db: PouchDB.Database<Expense>;

  constructor() {
    this.db = expenseDbInstance;
  }

  // Create a new expense
  async createExpense(expense: Expense) {
    try {
      const id = uuidv4();

      //

      const response = await this.db.put({
        ...expense,
        id,
        _id: id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      return id;
    } catch (error) {
      throw new Error("Failed to create the expense: " + error.message);
    }
  }

  async addDeleteStatusExpense(expenseId: string) {
    try {
      const response = await this.db.putIfNotExists(expenseId, {
        status: Status.DELETE,
      });

      return response;
    } catch (error) {
      throw new Error(
        "Failed to add delete status  the expense: " + error.message
      );
    }
  }

  // Find all expenses between two user IDs
  async findExpensesBetweenUsers(
    userId1: string,
    userId2: string
  ): Promise<Expense[]> {
    console.log({ userId1, userId2 });
    try {
      const result = await expenseDbInstance.find({
        selector: {
          $or: [
            { borrower_id: userId1, lender_id: userId2 },
            { borrower_id: userId2, lender_id: userId1 },
          ],
        },
      });

      console.log({ result });
      return result.docs as Expense[];
    } catch (error) {
      throw new Error(
        "Failed to find expenses between users: " + error.message
      );
    }
  }
}
