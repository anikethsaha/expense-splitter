import React, { useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import Button from "src/components/atoms/Buttons";
import { StyledContainer } from "src/components/atoms/Common/StyledContainer";
import {
  TitleLarge,
  TitleMedium,
  TitleSmall,
} from "src/components/atoms/Typography/Typography";
import { ExpenseHelper } from "src/helpers/ExpenseHelper";
import { useExpense } from "src/hooks/useExpense";
import { Expense, Status } from "src/models/Expense";
import { useLoggedInUser } from "src/stores/User.store";
import { useTheme } from "styled-components";

export const SettleExpense: React.FC<{
  expenses: Expense[];
  onCancel?: () => void;
}> = ({ expenses, onCancel }) => {
  const currentUser = useLoggedInUser();
  const { brand } = useTheme();

  const { loading, settleExpenses } = useExpense(false, (err) => {
    toast.error(err);
  });

  const myStatus = useMemo(
    () => ExpenseHelper.calculateMyStatus(currentUser, expenses),
    [expenses, currentUser]
  );

  const allSettled = expenses.every((e) => e.status === Status.PAID);

  const recordSettlement = () => {
    settleExpenses(expenses).then(() => {
      toast.success("Settled successfully");
      onCancel?.();
    });
  };
  const prefix = myStatus.isLending ? "+" : "-";

  const whichExpense =
    expenses.length === 1 ? "this expense" : "all these expense";

  const text = allSettled
    ? `${whichExpense} already settled`
    : `Record a transaction mark ${whichExpense} settled ?`;

  if (!currentUser) return null;

  return (
    <StyledContainer
      style={{
        justifyContent: "space-between  ",
        gap: 18,
        alignItems: "start",
        position: "relative",
      }}
    >
      <TitleSmall>{text}</TitleSmall>
      <TitleLarge
        color={
          allSettled ? brand.primary : myStatus.isLending ? "green" : "red"
        }
      >
        {prefix} ₹{parseInt(myStatus.amount ?? 0)}
      </TitleLarge>
      <div
        style={{
          width: "100%",

          boxSizing: "border-box",
          display: "flex",
          flexDirection: "row",
          gap: 12,
        }}
      >
        {onCancel && (
          <Button
            type={"secondary"}
            style={{ width: "30%" }}
            onClick={onCancel}
            text={"Cancel"}
          />
        )}
        {!allSettled && (
          <Button
            onClick={recordSettlement}
            text={loading ? "In progress ..." : "Settle"}
          />
        )}
      </div>
      <Toaster />
    </StyledContainer>
  );
};
