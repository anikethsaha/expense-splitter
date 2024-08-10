import { styled } from "styled-components";

export const OptionItem = styled.div<{ last?: boolean }>`
    padding: 12px;
    border-bottom: ${(props) => (props.last ? 0 : 1)}px solid #e5e5e5;
    cursor: pointer;
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: row;
    gap: 12px;

    .item {
        display: flex;
        flex-direction: row;
        gap: 2px;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        flex: 1;
    }

    .right {
        display: flex;
        flex-direction: row;
        gap: 8px;
        justify-content: space-between;
        align-items: center;
    }

    &:hover {
        background-color: #f9f9f9;
    }
};
`;

export const UserAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;

  background-color: ${(props) => props.theme.gray.medium};
  justify-content: center;
  align-items: center;
  display: flex;
  color: ${(props) => props.theme.brand.alternative};
  font-weight: 500;
  letter-spacing: 0.5px;
  font-size: 12px;
`;
