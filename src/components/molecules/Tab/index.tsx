import React from "react";
import { IconType } from "react-icons";
import { TitleSmall } from "src/components/atoms/Typography/Typography";
import styled, { useTheme } from "styled-components";
import { Container, Tab } from "./Tab.style";

export type TAB = {
  title: string;
  id: string;
  icon?: IconType;
};

export const Tabs: React.FC<{
  list: TAB[];
  onTabChange?: (tab: string) => void;
}> = ({ list, onTabChange }) => {
  const { brand } = useTheme();
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleTabChange = (index: number) => {
    const tab = list[index];
    if (tab) {
      setActiveIndex(index);
      if (onTabChange) {
        onTabChange(tab.id);
      }
    }
  };

  return (
    <Container>
      {list.map((tab, index) => (
        <Tab
          active={activeIndex === index}
          key={tab.id}
          onClick={() => handleTabChange(index)}
        >
          {tab.icon ? (
            <tab.icon
              size={20}
              color={activeIndex === index ? brand.alternative : brand.primary}
            />
          ) : null}
          <TitleSmall
            color={activeIndex === index ? brand.alternative : brand.primary}
          >
            {tab.title}
          </TitleSmall>
        </Tab>
      ))}
    </Container>
  );
};
