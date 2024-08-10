import React from "react";
import { IconType } from "react-icons";
import { TitleSmall } from "src/components/atoms/Typography/Typography";
import styled, { useTheme } from "styled-components";

export type TAB = {
  title: string;
  id: string;
  icon?: IconType;
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  background-color: ${(props) => props.theme.gray.medium};
  border-radius: 12px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
`;

const Tab = styled.div<{ active?: boolean }>`
  padding: 8px 16px;
  border-radius: 12px;
  background-color: ${(props) =>
    props.active ? props.theme.brand.primary : props.theme.gray.medium};
  cursor: pointer;
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  &:focus,
  &:hover {
    outline: none;
    background-color: ${(props) =>
      props.active ? props.theme.brand.primary : props.theme.gray.medium};
  }
`;

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
