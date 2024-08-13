import { styled } from "styled-components";

export const Container = styled.div<{ isProgress?: boolean }>`
  display: flex;
  flex-direction: row;
  height: 48px;
  width: 100%;
  border-top: ${(props) => (props.isProgress ? 0 : 3)}px solid
    ${(props) => props.theme.brand.primary};
  padding: 16px 16px 12px;

  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
`;

export const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
  align-items: center;
`;

export const ProgressBar = styled.div<{ progress: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 3px;
  width: ${(props) => props.progress}%;
  background-color: ${(props) => props.theme.brand.primary};
  transition: width 0.5s;
`;
