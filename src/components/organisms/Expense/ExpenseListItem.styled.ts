import { styled } from "styled-components";

export const Container = styled.div<{ allowSettle?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  gap: 12px;
  cursor: ${(props) => (props.allowSettle ? "pointer" : "default")};
`;

export const Left = styled.div`
  display: flex;
  flex-direction: column;

  background: ${(props) => props.theme.gray.light};
  justify-content: center;
  align-items: center;

  padding: 4px 6px;
  border-radius: 4px;
`;
export const Right = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
`;

export const FullScreenBackDrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
`;
