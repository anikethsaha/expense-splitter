import React, { useCallback, useEffect } from "react";
import { FaEquals } from "react-icons/fa6";
import { AiOutlinePercentage } from "react-icons/ai";
import { GoNumber } from "react-icons/go";

import { Input } from "src/components/atoms/Input";
import { TitleSmall } from "src/components/atoms/Typography/Typography";
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
  margin-top: 24px;
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

export const SecondStepSplitCreator = () => {
  const errorCb = useCallback((err: string) => {
    toast.error(err);
  }, []);
  const dispatcher = useDispatch();
  const { getMemberList } = useSplitCreatorHelper(errorCb);
  const [splitType, setSplitType] = React.useState(SplitType.EQUAL);
  const [members, setMembers] = React.useState<User[]>([]);

  useEffect(() => {
    getMemberList().then((members) => {
      setMembers([...members]);
    });
  }, []);

  const handlePaidBySelection = (user: User): void => {
    dispatcher(splitCreatorSlice.actions.updatePaidBy({ ...user }));
  };

  return (
    <Container>
      <BaseScreenPadding
        style={{
          width: "100%",
          gap: 16,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TitleSmall
          style={{
            marginBottom: 24,
          }}
        >
          Expense Info
        </TitleSmall>
        <Input
          size={"small"}
          onChange={(val) =>
            dispatcher(splitCreatorSlice.actions.updateSplitName(val))
          }
          label="Expense Name"
          type={"text"}
        />
        <Input
          size={"small"}
          onChange={(val) =>
            dispatcher(splitCreatorSlice.actions.updateSplitAmount(val))
          }
          label="Amount"
          type={"number"}
        />

        <TitleSmall
          style={{
            marginTop: 24,
          }}
        >
          Paid by
        </TitleSmall>
      </BaseScreenPadding>

      <UserRadioList users={members} onChange={handlePaidBySelection} />

      {/* <AmountSplitWrapper>
        <Tabs
          list={SplitTypeTabOptions}
          onTabChange={(tabId) => setSplitType(tabId as SplitType)}
        />

        {splitType === SplitType.EQUAL && <></>}
      </AmountSplitWrapper> */}
      <Toaster />
    </Container>
  );
};
