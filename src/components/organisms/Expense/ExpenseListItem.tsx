import { useRouter } from "next/navigation";
import React from "react";
import { FiEdit2 } from "react-icons/fi";

import {
  TextCaption,
  TitleMedium,
  TitleSmall,
} from "src/components/atoms/Typography/Typography";
import { Expense } from "src/models/Expense";
import { Split } from "src/models/Split";
import styled, { useTheme } from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  gap: 12px;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;

  background: ${(props) => props.theme.gray.light};
  justify-content: center;
  align-items: center;

  padding: 4px 6px;
  border-radius: 4px;
`;
const Right = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
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

export const ExpenseListItem: React.FC<{
  expense: Expense;
  loggedInUserId: string;
  friendName?: string;
  split: Split;
  group?: boolean;
  noEdit?: boolean;
}> = ({
  expense,
  friendName,
  noEdit,
  loggedInUserId,
  group = false,
  split,
}) => {
  const router = useRouter();
  const { brand } = useTheme();
  const borrower =
    expense.borrower_id === loggedInUserId ? (group ? "" : "You") : friendName;
  const lender =
    expense.lender_id === loggedInUserId ? (group ? "" : "You") : friendName;
  const splitCreatedOn = new Date(expense.created_at);

  const text =
    friendName || group
      ? ` {lender} lend {borrower} ₹{split.amount}`
      : expense.borrower_id === loggedInUserId
      ? `You borrowed ₹{split.amount}`
      : `You lent ₹{split.amount}`;

  const edit = () => {
    router.push(`/edit/split/${split.id}`);
  };

  return (
    <Container>
      <Left>
        <TitleMedium color={brand.primary}>
          {splitCreatedOn.getDate()}
        </TitleMedium>
        <TextCaption color={brand.primary}>
          {MONTH_MAP[splitCreatedOn.getMonth()]} {splitCreatedOn.getFullYear()}
        </TextCaption>
      </Left>
      <Right>
        <TitleSmall>{split.name}</TitleSmall>
        <TextCaption>{text}</TextCaption>
      </Right>
      {!noEdit && (
        <div>
          <FiEdit2
            style={{ cursor: "pointer" }}
            size={20}
            color={brand.primary}
            onClick={edit}
          />
        </div>
      )}
    </Container>
  );
};
