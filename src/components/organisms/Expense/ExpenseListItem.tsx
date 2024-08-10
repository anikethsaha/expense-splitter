import React from "react";
import { TitleMedium } from "src/components/atoms/Typography/Typography";
import { Expense } from "src/models/Expense";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  padding: 12px 16px;
  box-sizing: border-box;
  border-bottom: 1px solid #e0e0e0;
  justify-content: space-between;
  align-items: center;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ExpenseListItem: React.FC<{
  expense: Expense;
  expenseType: "owe" | "lend";
}> = ({ expense }) => {
  return (
    <Container>
      <LeftContainer>
        <TitleMedium></TitleMedium>
      </LeftContainer>
    </Container>
  );
};
