import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  width: 100%;
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  justify-content: flex-end;
  padding: 12px;
  box-sizing: border-box;
`;

export const RightElement = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: end;
  justify-content: center;
  width: 100%;
  position: relative;
  flex: 1;
`;
