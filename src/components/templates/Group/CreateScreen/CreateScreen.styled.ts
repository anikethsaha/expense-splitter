import { BaseScreenPadding } from "src/components/atoms/Common/Padding";
import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
  height: 100%;
  position: relative;
  width: 100%;
`;

export const Wrapper = styled(BaseScreenPadding)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  justify-content: flex-end;
  padding: 12px;
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  width: 100%;
`;
