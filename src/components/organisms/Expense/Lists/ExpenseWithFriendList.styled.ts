import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  padding: 12px 16px;
  box-sizing: border-box;
  gap: 8px;
  width: 100%;

  .list-body {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 24px;
    width: 100%;
  }

  .list-item {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    width: 100%;
    gap: 12px;

    .left {
      display: flex;
      flex-direction: column;

      background: ${(props) => props.theme.gray.light};
      justify-content: center;
      align-items: center;

      padding: 4px 6px;
      border-radius: 4px;
    }

    .right {
      height: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 6px;
    }
  }
`;
