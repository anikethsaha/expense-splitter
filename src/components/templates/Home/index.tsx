import React, { useCallback } from "react";
import { FaRegSquarePlus } from "react-icons/fa6";

import { BaseScreenPadding } from "src/components/atoms/Common/Padding";
import { TitleSmall } from "src/components/atoms/Typography/Typography";
import { Tabs } from "src/components/molecules/Tab";
import { LiaUser } from "react-icons/lia";
import { MdGroups } from "react-icons/md";
import { TbHistoryToggle } from "react-icons/tb";

import { Navbar } from "src/components/organisms/Navbar";

import styled from "styled-components";
import { FriendSplitList } from "src/components/organisms/Friends/FriendSplitList";
import { useRouter, useSearchParams } from "next/navigation";
import { FloatingButton } from "src/components/molecules/FloatingButton";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 4px;
`;

const TAB_DATA = [
  { title: "Friends", id: "friends", icon: LiaUser },
  { title: "Groups", id: "groups", icon: MdGroups },
  { title: "Activities", id: "activities", icon: TbHistoryToggle },
];

export const HomeScreen = () => {
  const router = useRouter();
  const [currTabId, setCurrTabId] = React.useState(TAB_DATA[0].id);

  const onAddClick = useCallback(() => {
    if (currTabId === "friends") {
      router.replace("/add/friend");
    } else if (currTabId === "groups") {
      router.replace("/groups");
    }
  }, [currTabId]);

  const onTabChange = (tabId: string) => {
    setCurrTabId(tabId);
  };

  const onAddExpenseClick = () => {
    router.replace("/add/expense");
  };

  return (
    <Container>
      <Navbar onAddClick={onAddClick} />
      <BaseScreenPadding>
        <TitleSmall>Overall, you owe INR 20000</TitleSmall>
      </BaseScreenPadding>
      <BaseScreenPadding>
        <Tabs onTabChange={onTabChange} list={TAB_DATA} />
      </BaseScreenPadding>

      <FriendSplitList />
      <FloatingButton
        trailingIcon={(props) => <FaRegSquarePlus {...props} />}
        text={"Add expense"}
        onClick={onAddExpenseClick}
      />
    </Container>
  );
};
