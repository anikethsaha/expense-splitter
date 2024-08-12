import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  BaseContainer,
  StyledContainer,
} from "src/components/atoms/Common/StyledContainer";
import { FullSectionShimmer } from "src/components/atoms/Shimmer/FullScreen";
import { ExpenseListItem } from "src/components/organisms/Expense/ExpenseListItem";
import { CustomLayout } from "src/components/organisms/Layout";
import { useExpense } from "src/hooks/useExpense";
import { Expense } from "src/models/Expense";
import { Split } from "src/models/Split";
import { useLoggedInUser } from "src/stores/User.store";
import { styled } from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 16px;
`;

export const Activities = () => {
  const currentUser = useLoggedInUser();
  const { getAllMyExpenses, getSplitsForExpenses } = useExpense(
    false,
    (err) => {
      toast.error(err);
    }
  );

  const [splits, setSplits] = React.useState<Split[]>([]);
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    getAllMyExpenses()
      .then((data) => {
        if (data) {
          setExpenses([...data]);
          return getSplitsForExpenses(data).then((splitsResponse) => {
            if (splits) setSplits([...splitsResponse]);
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <StyledContainer>
      {loading ? (
        <FullSectionShimmer />
      ) : (
        <Container>
          {splits.map((split, i) =>
            expenses[i] ? (
              <ExpenseListItem
                key={split.id}
                expense={expenses[i]}
                loggedInUserId={currentUser?.id!}
                split={split}
                noEdit
              />
            ) : null
          )}
        </Container>
      )}
      <Toaster />
    </StyledContainer>
  );
};

export default Activities;
