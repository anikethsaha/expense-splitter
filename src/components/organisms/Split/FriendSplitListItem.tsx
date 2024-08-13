import React, { useEffect, useMemo, useRef } from "react";
import {
  TextCaption,
  TitleSmall,
} from "src/components/atoms/Typography/Typography";
import { Sheet } from "react-modal-sheet";
import { useExpense } from "src/hooks/useExpense";
import { Expense, Status } from "src/models/Expense";
import { Friend } from "src/models/Friend";
import { Split } from "src/models/Split";
import { useLoggedInUser } from "src/stores/User.store";
import { styled, useTheme } from "styled-components";
import { ExpenseWithFriendList } from "../Expense/Lists/ExpenseWithFriendList";
import { BottomSheet } from "src/components/molecules/BottomSheet";
import { SettleExpense } from "../Settle/SettleExpense";
import { Container, TextWrapper } from "./FriendSplitListItem.styled";

export const FriendSplitListItem: React.FC<{
  friend: Friend;
}> = ({ friend }) => {
  const [showList, setShowList] = React.useState(false);
  const loggedInUser = useLoggedInUser();
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const { base, brand } = useTheme();

  const { loading, getExpenseWithFriend, calculateOwingOrLending } = useExpense(
    true,
    (err) => {
      console.error(err);
    }
  );

  useEffect(() => {
    if (!loggedInUser) return;
    const friendId =
      loggedInUser.id === friend.user_1 ? friend.user_2 : friend.user_1;
    getExpenseWithFriend(friendId).then((expenses) => {
      if (expenses) setExpenses([...expenses]);
    });
  }, [loggedInUser]);

  const { isLending, amount } = useMemo(
    () => calculateOwingOrLending(expenses),
    [expenses]
  );

  const secondaryText = useMemo(
    () =>
      expenses?.length
        ? expenses.every((expense) => expense.status === Status.PAID)
          ? "All settled"
          : isLending
          ? `You are lending ${parseInt(amount)}`
          : `You owe ${parseInt(amount)}`
        : "No expenses",
    [expenses, isLending, amount]
  );

  return (
    <>
      <Container onClick={() => setShowList((prev) => !prev)}>
        <TextWrapper>
          <TitleSmall color={base.baseDarker1}>{friend.user_2_name}</TitleSmall>
          <TextCaption>{secondaryText}</TextCaption>
        </TextWrapper>
      </Container>
      <BottomSheet
        snapPoints={[800]}
        isOpen={showList}
        onClose={() => setShowList(false)}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <ExpenseWithFriendList
            text={secondaryText}
            expenses={expenses}
            friend={friend}
          />

          <div>
            <SettleExpense
              onCancel={() => setShowList(false)}
              expenses={expenses}
            />
          </div>
        </div>
      </BottomSheet>
    </>
  );
};
