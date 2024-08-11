import { Expense, Status } from "src/models/Expense";
import { User } from "src/models/user";

export class ExpenseHelper {
  static calculateMyStatus(currentUser: User, expenses: Expense[]) {
    let totalLent = 0;
    let totalOwed = 0;
    const openExpenses = expenses.filter(
      (expense) => expense.status === Status.OPEN
    );
    openExpenses.forEach((expense) => {
      if (expense.status === Status.OPEN) {
        if (expense.lender_id === currentUser.id) {
          totalLent += expense.amount;
        } else if (expense.borrower_id === currentUser.id) {
          totalOwed += expense.amount;
        }
      }
    });

    const balance = totalLent - totalOwed;

    const isLending = balance > 0;
    const amount = Math.abs(balance);

    const textSummary = expenses?.length
      ? expenses.every((expense) => expense.status === Status.PAID)
        ? "All settled"
        : isLending
        ? `You are lending ${amount}`
        : `You owe ${amount}`
      : "No expenses";

    return {
      isLending,
      amount,
      textSummary,
    };
  }
}
