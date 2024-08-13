import { styled } from "styled-components";

export const Container = styled.div`
  position: relative;
  width: 100%;
`;

export const OptionDropdownContainer = styled.div`
  position: absolute;
  width: 100%;
  z-index: 1;
  background-color: ${(props) => props.theme.brand.brandOpposite};

  border-radius: 8px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  box-shadow: -1px 4px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e0e0;
  border-top: 0;
  box-sizing: border-box;
`;
