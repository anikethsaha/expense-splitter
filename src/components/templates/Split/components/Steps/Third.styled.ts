import { styled } from "styled-components";

export const Container = styled.div`
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

export const AmountSplitWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 6px;
`;

export const TotalPercentageDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: flex-end;
  align-items: flex-end;
`;

export const SecondaryFooter = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
  justify-content: flex-end;
  align-items: center;
`;
