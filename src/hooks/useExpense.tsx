import { use, useCallback, useState } from "react";
import { useLoggedInUser } from "src/stores/User.store";
import { ExpenseRepo } from "src/repos/ExpenseRepo";
import { useRouter } from "next/navigation";
import { Expense, Status } from "src/models/Expense";
import { ExpenseHelper } from "src/helpers/ExpenseHelper";
import { SplitRepo } from "src/repos/SplitRepo";

const expenseRepo = new ExpenseRepo();
const splitRepo = new SplitRepo();

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
        console.log({ currentUser });
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
      const result = ExpenseHelper.calculateMyStatus(currentUser, expenses);
      return result;
    },
    [currentUser]
  );

  const getAllMyExpenses = useCallback(async () => {
    if (!currentUser?.id) return;
    const expenses = await expenseRepo.findExpensesByUserId(currentUser?.id);
    return expenses;
  }, [currentUser]);

  const getSplitsForExpenses = useCallback(async (expenses: Expense[]) => {
    const promises = expenses.map((expense) =>
      splitRepo.getSplitByExpenseId(expense.id)
    );
    const splits = await Promise.all(promises);
    return splits;
  }, []);

  return {
    getExpenseWithFriend,
    calculateOwingOrLending,
    getSplitsForExpenses,
    loading,
    getAllMyExpenses,
  };
};
