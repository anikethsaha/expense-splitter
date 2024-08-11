import React, { useCallback, useEffect, useMemo } from "react";
import { FaEquals } from "react-icons/fa6";
import { AiOutlinePercentage } from "react-icons/ai";
import { GoNumber } from "react-icons/go";
import { FaPercentage } from "react-icons/fa";

import { Input } from "src/components/atoms/Input";
import {
  TextSmall,
  TitleSmall,
} from "src/components/atoms/Typography/Typography";
import { TAB, Tabs } from "src/components/molecules/Tab";
import { SplitType } from "src/models/Split";
import { styled } from "styled-components";
import { UserRadioList } from "../../../../molecules/Lists/UserRadioList";
import { useSplitCreatorHelper } from "../../hooks/useSplitCreatorHelper";
import toast, { Toaster } from "react-hot-toast";
import { User } from "src/models/user";
import { BaseScreenPadding } from "src/components/atoms/Common/Padding";
import { useDispatch } from "react-redux";
import { splitCreatorSlice } from "src/stores/SplitCreator.store";
import { UserListItem } from "src/components/atoms/ListItems/UserListItem";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  box-sizing: border-box;
  height: 100%;
  width: 100%;
  justify-content: start;
  align-items: start;
  width: 100%;
  box-sizing: border-box;
`;

const AmountSplitWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 6px;
`;

const TotalPercentageDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: flex-end;
  align-items: flex-end;
`;

const SecondaryFooter = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
  justify-content: flex-end;
  align-items: center;
`;

const SplitTypeTabOptions: TAB[] = [
  {
    title: "Equal",
    id: SplitType.EQUAL,
    icon: FaEquals,
  },
  {
    title: "Percentage",
    id: SplitType.PERCENTAGE,
    icon: AiOutlinePercentage,
  },
  {
    title: "Exact",
    id: SplitType.ABSOLUTE,
    icon: GoNumber,
  },
];

export const ThirdStepSplitCreator = () => {
  const errorCb = useCallback((err: string) => {
    toast.error(err);
  }, []);
  const dispatcher = useDispatch();
  const { getMemberList, selectSplitType, splitType, splitInfo, amount } =
    useSplitCreatorHelper(errorCb);

  const [members, setMembers] = React.useState<User[]>([]);

  const totalPercentageBeingUsed = useMemo(
    () =>
      Object.values(splitInfo[splitType!]?.memberAmount! ?? {}).reduce(
        (acc, curr) => {
          return parseInt(Number(acc) + Number(curr.percentage || 0));
        },
        0
      ),
    [splitInfo, splitType]
  );

  const totalAmountBeingUsed = useMemo(
    () =>
      Object.values(splitInfo[splitType!]?.memberAmount! ?? {}).reduce(
        (acc, curr) => {
          return parseInt(Number(acc) + Number(curr.amount || 0));
        },
        0
      ),
    [splitInfo, splitType]
  );

  useEffect(() => {
    getMemberList().then((members) => {
      setMembers([...members]);

      selectSplitType(splitType ?? SplitType.EQUAL, members);
    });
  }, []);

  const handlePercentageChange = (userId: string, value: number) => {
    dispatcher(
      splitCreatorSlice.actions.updateMemberPercentage({
        userId,
        percentage: value,
      })
    );
  };

  const handleAbsoluteChange = (userId: string, value: number) => {
    dispatcher(
      splitCreatorSlice.actions.updateMemberAbsolute({
        userId,
        amount: value,
      })
    );
  };

  return (
    <Container>
      <BaseScreenPadding
        style={{
          width: "100%",
          height: "100%",
          gap: 16,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TitleSmall
          style={{
            marginTop: 24,
          }}
        >
          How to Split ?
        </TitleSmall>

        <AmountSplitWrapper>
          <Tabs
            list={SplitTypeTabOptions}
            onTabChange={(tabId) => {
              console.log({ tabId });
              selectSplitType(tabId as SplitType, members);
            }}
          />

          {splitType === SplitType.EQUAL && (
            <>
              {members.map((member) => (
                <UserListItem
                  user={member}
                  key={member.id ?? member.phone_number}
                  isLast
                  rightInputProps={{
                    disabled: true,
                    onChange: (e) => {},

                    defaultValue:
                      splitInfo[splitType]?.memberAmount[member.id]?.amount ??
                      0,
                  }}
                />
              ))}
            </>
          )}
          {splitType === SplitType.PERCENTAGE && (
            <>
              {members.map((member) => (
                <UserListItem
                  user={member}
                  key={member.id ?? member.phone_number}
                  isLast
                  rightInputProps={{
                    onChange: (val) => {
                      handlePercentageChange(member.id, val);
                    },
                    rightElement: <FaPercentage size={10} />,
                    defaultValue:
                      splitInfo[splitType]?.memberAmount[member.id]
                        ?.percentage ?? 0,
                  }}
                />
              ))}
            </>
          )}
          {splitType === SplitType.ABSOLUTE && (
            <>
              {members.map((member) => (
                <UserListItem
                  user={member}
                  key={member.id ?? member.phone_number}
                  isLast
                  rightInputProps={{
                    onChange: (val) => {
                      handleAbsoluteChange(member.id, val);
                    },

                    defaultValue:
                      splitInfo[splitType]?.memberAmount[member.id]?.amount ??
                      0,
                  }}
                />
              ))}
            </>
          )}
        </AmountSplitWrapper>
        <SecondaryFooter>
          {splitType === SplitType.PERCENTAGE && (
            <TotalPercentageDetail>
              <TextSmall>
                Total percentage being used: {totalPercentageBeingUsed || 0}%{" "}
              </TextSmall>
              <TextSmall>Out of 100%</TextSmall>
            </TotalPercentageDetail>
          )}
          {splitType === SplitType.ABSOLUTE && (
            <TotalPercentageDetail>
              <TextSmall>
                Total amount being used: {totalAmountBeingUsed || 0}
              </TextSmall>
              <TextSmall>Out of {amount}</TextSmall>
            </TotalPercentageDetail>
          )}
        </SecondaryFooter>
      </BaseScreenPadding>
      <Toaster />
    </Container>
  );
};
