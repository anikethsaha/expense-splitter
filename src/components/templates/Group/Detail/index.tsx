import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { BaseScreenPadding } from "src/components/atoms/Common/Padding";
import { FullSectionShimmer } from "src/components/atoms/Shimmer/FullScreen";
import {
  TextCaption,
  TextSmall,
  TitleLarge,
  TitleMedium,
  TitleSmall,
} from "src/components/atoms/Typography/Typography";
import { ExpenseListItem } from "src/components/organisms/Expense/ExpenseListItem";
import { CustomLayout } from "src/components/organisms/Layout";
import { Navbar } from "src/components/organisms/Navbar";
import { ExpenseHelper } from "src/helpers/ExpenseHelper";
import { useGroup } from "src/hooks/useGroup";
import { Expense } from "src/models/Expense";
import { Group } from "src/models/Group";
import { Split } from "src/models/Split";
import { useLoggedInUser } from "src/stores/User.store";
import styled, { useTheme } from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 4px;
`;

const Header = styled(BaseScreenPadding)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  .left {
    display: flex;
    flex-direction: column;

    gap: 4px;
  }

  .right {
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: ${(props) => props.theme.gray.light};
    justify-content: center;
    align-items: center;

    padding: 4px 6px;
    border-radius: 4px;
  }
`;

type GroupDetailScreenProps = { id: string };

const GroupDetailScreenComponent: React.FC<GroupDetailScreenProps> = ({
  id,
}) => {
  const router = useRouter();
  const { brand, base } = useTheme();
  const errorCb = useCallback((err?: string) => {
    toast.error(err);
  }, []);
  const [fetchingSplits, setFetchingSplits] = React.useState(false);
  const [groupInfo, setGroupInfo] = React.useState<Group | null>(null);
  const {
    loading: rootLoading,
    getGroupInfo,
    getAllSplitsByGroupId,
    getAllExpenseByGroupId,
    getGroupMemberInfo,
  } = useGroup(true, errorCb);
  const [splits, setSplits] = React.useState<Split[]>([]);
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const currentUser = useLoggedInUser();
  const [groupMemberInfo, setGroupMemberInfo] = React.useState<any[]>([]);

  useEffect(() => {
    const groupId = id;

    if (groupId) {
      getGroupInfo(groupId).then((response) => {
        if (response) {
          setGroupInfo(response);
        }
      });
    }
  }, [id]);

  useEffect(() => {
    if (groupInfo?.id) {
      setFetchingSplits(true);
      getAllSplitsByGroupId(groupInfo.id).then((response) => {
        setFetchingSplits(false);
        if (response) {
          setSplits(response);
        }
      });
      getAllExpenseByGroupId(groupInfo.id).then((response) => {
        if (response) {
          setExpenses([...response]);
        }
      });
      getGroupMemberInfo(groupInfo.user_ids).then((response) => {
        if (response) {
          setGroupMemberInfo([...response]);
        }
      });
    }
  }, [JSON.stringify(groupInfo)]);

  const myStatus = useMemo(
    () => ExpenseHelper.calculateMyStatus(currentUser, expenses),
    [expenses, currentUser]
  );

  return (
    <Container>
      <Navbar onBack={() => router.replace("/")} />
      <Header>
        {rootLoading ? (
          <FullSectionShimmer />
        ) : (
          <>
            <div className="left">
              <TextSmall color={brand.primary}>{groupInfo?.name}</TextSmall>
              <TitleSmall color={base.base2}>{myStatus.textSummary}</TitleSmall>
            </div>
            <div className="right">
              <TitleMedium color={brand.primary}>
                {groupInfo?.user_ids?.length}
              </TitleMedium>
              <TextCaption color={brand.primary}>Members</TextCaption>
            </div>
          </>
        )}
      </Header>
      {fetchingSplits ? (
        <FullSectionShimmer />
      ) : (
        <BaseScreenPadding>
          <TitleSmall>{splits.length === 0 ? "no expenses" : ""}</TitleSmall>
          {!!splits.length &&
            splits.map((split, i) => {
              const expenseToUse = expenses.find(
                (e) =>
                  e.borrower_id === currentUser?.id ||
                  e.lender_id === currentUser?.id
              )!;

              if (!expenseToUse) return null;

              const otherUserId =
                expenseToUse.borrower_id === currentUser?.id
                  ? expenseToUse.lender_id
                  : expenseToUse.borrower_id;
              const otherUserInfo = groupMemberInfo.find(
                (u) => u.id === otherUserId
              );

              return (
                <ExpenseListItem
                  key={split.id}
                  expense={expenseToUse}
                  loggedInUserId={currentUser?.id!}
                  friendName={otherUserInfo.name}
                  split={split}
                  group
                />
              );
            })}
        </BaseScreenPadding>
      )}
    </Container>
  );
};

export const GroupDetailScreen: React.FC<GroupDetailScreenProps> = (props) => {
  return (
    <CustomLayout>
      <GroupDetailScreenComponent {...props} />
    </CustomLayout>
  );
};

export default GroupDetailScreen;
