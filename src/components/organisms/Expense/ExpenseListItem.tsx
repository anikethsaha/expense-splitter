import { useRouter } from "next/navigation";
import React from "react";
import { FiEdit2 } from "react-icons/fi";

import {
  TextCaption,
  TextSmall,
  TitleMedium,
  TitleSmall,
} from "src/components/atoms/Typography/Typography";
import { BottomSheet } from "src/components/molecules/BottomSheet";
import { Expense, Status } from "src/models/Expense";
import { Split } from "src/models/Split";
import styled, { useTheme } from "styled-components";
import { SettleExpense } from "../Settle/SettleExpense";
import {
  Container,
  Left,
  Right,
  FullScreenBackDrop,
} from "./ExpenseListItem.styled";

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
  allowSettle?: boolean;
}> = ({
  expense,
  friendName,
  noEdit,
  loggedInUserId,
  group = false,
  allowSettle,
  split,
}) => {
  const router = useRouter();
  const { brand, base } = useTheme();
  const borrower =
    expense.borrower_id === loggedInUserId ? (group ? "" : "You") : friendName;
  const lender =
    expense.lender_id === loggedInUserId ? (group ? "" : "You") : friendName;
  const splitCreatedOn = new Date(expense.created_at);
  const [showSettle, setShowSettle] = React.useState(false);

  const text =
    friendName || group
      ? ` ${lender} lend ${borrower} ₹${split.amount}`
      : expense.borrower_id === loggedInUserId
      ? `You borrowed ₹${split.amount}`
      : `You lent ₹${split.amount}`;

  const edit = () => {
    router.push(`/edit/split/${split.id}`);
  };

  return (
    <>
      <Container
        allowSettle={allowSettle}
        onClick={() => (allowSettle ? setShowSettle(true) : {})}
      >
        <Left>
          <TitleMedium color={brand.primary}>
            {splitCreatedOn.getDate()}
          </TitleMedium>
          <TextCaption color={brand.primary}>
            {MONTH_MAP[splitCreatedOn.getMonth()]}{" "}
            {splitCreatedOn.getFullYear()}
          </TextCaption>
        </Left>
        <Right>
          <TitleSmall>{split.name}</TitleSmall>
          <TextCaption>{text}</TextCaption>
        </Right>
        {expense.status === Status.PAID && (
          <TextSmall
            style={{
              padding: "2px 6px",
              background: base.base1,
              color: brand.alternative,
              borderRadius: 4,
            }}
          >
            Settled
          </TextSmall>
        )}
        {!noEdit && expense.status === Status.OPEN && (
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
      {showSettle && <FullScreenBackDrop />}
      <BottomSheet
        snapPoints={[250]}
        isOpen={showSettle}
        onClose={() => {
          console.log("onClose");
          setShowSettle(false);
        }}
      >
        <SettleExpense
          onCancel={() => setShowSettle(false)}
          expenses={[expense]}
        />
      </BottomSheet>
    </>
  );
};
