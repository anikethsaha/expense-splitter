import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  background-color: ${(props) => props.theme.gray.medium};
  border-radius: 12px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
`;

export const Tab = styled.div<{ active?: boolean }>`
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
