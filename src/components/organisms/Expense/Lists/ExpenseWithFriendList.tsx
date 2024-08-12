import React, { useEffect, useMemo } from "react";
import {
  TextCaption,
  TextSmall,
  TitleMedium,
  TitleSmall,
} from "src/components/atoms/Typography/Typography";
import { useExpense } from "src/hooks/useExpense";
import { Expense } from "src/models/Expense";
import { Friend } from "src/models/Friend";
import { Split } from "src/models/Split";
import { useLoggedInUser } from "src/stores/User.store";
import styled, { useTheme } from "styled-components";
import { ExpenseListItem } from "../ExpenseListItem";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  padding: 12px 16px;
  box-sizing: border-box;
  gap: 8px;
  width: 100%;

  .list-body {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 24px;
    width: 100%;
  }

  .list-item {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    width: 100%;
    gap: 12px;

    .left {
      display: flex;
      flex-direction: column;

      background: ${(props) => props.theme.gray.light};
      justify-content: center;
      align-items: center;

      padding: 4px 6px;
      border-radius: 4px;
    }

    .right {
      height: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 6px;
    }
  }
`;

const MONTH_MAP = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec",
};

export const ExpenseWithFriendList: React.FC<{
  expenses: Expense[];
  friend: Friend;
  text?: string;
}> = ({ expenses, friend, text }) => {
  const { brand } = useTheme();
  const { getSplitsForExpenses } = useExpense();
  const loggedInUser = useLoggedInUser();
  const [allSplits, setSplits] = React.useState<Split[]>([]);

  const friendName = useMemo(
    () =>
      friend.user_1 === loggedInUser?.id
        ? friend.user_2_name
        : friend.user_1_name,
    [friend]
  );

  useEffect(() => {
    if (!loggedInUser) return;
    getSplitsForExpenses(expenses).then((splits) => {
      if (splits) setSplits([...splits]);
    });
  }, [JSON.stringify(expenses)]);

  return (
    <Container>
      <TitleSmall color={brand.primary}>With {friendName}</TitleSmall>
      <TextSmall>{text}</TextSmall>
      <div className="list-body">
        {allSplits.map((split, i) => (
          <ExpenseListItem
            key={split.id}
            expense={expenses[i]}
            loggedInUserId={loggedInUser?.id!}
            friendName={friendName!}
            split={split}
          />
        ))}
      </div>
    </Container>
  );
};
