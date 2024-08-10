import { useCallback, useState } from "react";
import { useLoggedInUser } from "src/stores/User.store";
import { ExpenseRepo } from "src/repos/ExpenseRepo";
import { useRouter } from "next/navigation";
import { Expense, Status } from "src/models/Expense";

const expenseRepo = new ExpenseRepo();

export const useExpense = (
  defaultLoadingState = false,
  onError?: (error: string) => void
) => {
  const router = useRouter();
  const currentUser = useLoggedInUser();
  const [loading, setLoading] = useState(defaultLoadingState);

  // Get all expenses between the current user and another user
  const getExpenseWithFriend = useCallback(
    async (userId: string) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setLoading(true);

      try {
        const expenses = await expenseRepo.findExpensesBetweenUsers(
          currentUser.id,
          userId
        );
        setLoading(false);
        return expenses;
      } catch (error) {
        setLoading(false);
        onError?.("Error retrieving expenses: " + error.message);
      }
    },
    [currentUser, router]
  );

  const calculateOwingOrLending = useCallback(
    (expenses: Expense[]) => {
      if (!currentUser) return { isLending: false, amount: 0 };

      let totalLent = 0;
      let totalOwed = 0;
      const openExpenses = expenses.filter(
        (expense) => expense.status === Status.OPEN
      );
      openExpenses.forEach((expense) => {
        if (expense.status === "OPEN") {
          if (expense.lender_id === currentUser.id) {
            totalLent += expense.amount;
          } else if (expense.borrower_id === currentUser.id) {
            totalOwed += expense.amount;
          }
        }
      });

      const balance = totalLent - totalOwed;
      const result = {
        isLending: balance > 0,
        amount: Math.abs(balance),
      };

      return result;
    },
    [currentUser]
  );

  return {
    getExpenseWithFriend,
    calculateOwingOrLending,
    loading,
  };
};
