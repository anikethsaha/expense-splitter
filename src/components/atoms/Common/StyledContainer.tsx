import { styled } from "styled-components";

export const BaseContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  background-color: ${(props) => props.theme.brand.background};
`;

export const StyledContainer = styled(BaseContainer)`
  padding: 12px 16px;
`;
