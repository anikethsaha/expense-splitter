import { BaseScreenPadding } from "src/components/atoms/Common/Padding";
import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 4px;
`;

export const Header = styled(BaseScreenPadding)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  .left {
    display: flex;
    flex-direction: column;

    gap: 4px;
  }

  .right {
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: ${(props) => props.theme.gray.light};
    justify-content: center;
    align-items: center;

    padding: 4px 6px;
    border-radius: 4px;
  }
`;
