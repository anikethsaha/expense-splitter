import "styled-components";
import styled from "styled-components";

export const LIGHT_THEME = {
  theme: "light",
  brand: {
    primary: "#000000",
    secondary: "#F9EFE5",
    alternative: "#FFFFFF",
    background: "white",
    brandOpposite: "#FFFFFF",
  },
  state: {
    error: "#FF0000",
    success: "#00FF00",
  },
  gray: {
    medium: "#e4e4e4",
    light: "#EFF1F5",
  },
  base: {
    base1: "#7F8790",
    base2: "#8F92A1",
    base3: `#F8F8F8`,
    baseDarker1: "#575757",
    baseLighter1: "#c7c7c7",
  },
  stroke: {
    light: "#e1e0e0",
  },
};

export const DARK_THEME = {
  theme: "dark",
  brand: {
    primary: "#FFFFFF", // White or off-white for text
    secondary: "#2C2C2C", // Dark gray for backgrounds
    alternative: "#1A1A1A", // Even darker for alternative elements
    background: "black",
    brandOpposite: "#000000",
  },
  state: {
    error: "#FF6B6B", // Slightly softer red for error states
    success: "#4CAF50", // Bright green for success states
  },
  gray: {
    medium: "#908e8e", // Medium gray for elements
    light: "#383838", // Light gray, but still dark enough for a dark theme
  },
  base: {
    base1: "#b1b1b1", // Light gray for text or icons
    base2: "#B0B3C1", // Slightly darker for contrast
    base3: "#2A2A2A", // Dark background for the main area
    baseDarker1: "#a1a1a1", // Very dark, almost black
    baseLighter1: "#5A5A5A", // Slightly lighter for borders or highlights
  },
  stroke: {
    light: "#3A3A3A", // Light but still in the dark spectrum
  },
};

export const DEFAULT_THEME = LIGHT_THEME;

export const typographyStyles = {
  titleLarge: {
    fontSize: "32px",
    fontWeight: 600,
    fontStyle: "normal",
    lineHeight: "40px",
    textDecoration: "none",
    textTransform: "none",
  },
  titleMedium: {
    fontSize: "20px",

    fontWeight: 600,
    fontStyle: "normal",
    lineHeight: "32px",
    textDecoration: "none",
    textTransform: "none",
  },
  titleSmall: {
    fontSize: "16px",

    fontWeight: 400,
    fontStyle: "normal",
    lineHeight: "20px",
    textDecoration: "none",
    textTransform: "none",
  },
  textRegular: {
    fontSize: "16px",

    fontWeight: 400,
    fontStyle: "normal",
    lineHeight: "24px",
    textDecoration: "none",
    textTransform: "none",
  },
  textSmall: {
    fontSize: "14px",

    fontWeight: 400,
    fontStyle: "normal",
    lineHeight: "20px",
    textDecoration: "none",
    textTransform: "none",
  },
  textCaption: {
    fontSize: "10px",

    fontWeight: 400,
    fontStyle: "normal",
    lineHeight: "14px",
    textDecoration: "none",
    textTransform: "none",
  },
};

export const TitleLarge = styled.div<{ color?: string }>`
  font-size: ${typographyStyles.titleLarge.fontSize};
  font-weight: ${typographyStyles.titleLarge.fontWeight};
  font-style: ${typographyStyles.titleLarge.fontStyle};
  line-height: ${typographyStyles.titleLarge.lineHeight};
  text-decoration: ${typographyStyles.titleLarge.textDecoration};
  text-transform: ${typographyStyles.titleLarge.textTransform};
  color: ${(props) =>
    props.color ?? props.theme.base?.base1 ?? LIGHT_THEME.base.base1};
`;

export const TitleMedium = styled.div<{ color?: string }>`
  font-size: ${typographyStyles.titleMedium.fontSize};
  font-weight: ${typographyStyles.titleMedium.fontWeight};
  font-style: ${typographyStyles.titleMedium.fontStyle};
  line-height: ${typographyStyles.titleMedium.lineHeight};
  text-decoration: ${typographyStyles.titleMedium.textDecoration};
  text-transform: ${typographyStyles.titleMedium.textTransform};
  color: ${(props) =>
    props.color ?? props.theme.base?.base1 ?? LIGHT_THEME.base.base1};
`;

export const TitleSmall = styled.div<{ color?: string }>`
  font-size: ${typographyStyles.titleSmall.fontSize};
  font-weight: ${typographyStyles.titleSmall.fontWeight};
  font-style: ${typographyStyles.titleSmall.fontStyle};
  line-height: ${typographyStyles.titleSmall.lineHeight};
  text-decoration: ${typographyStyles.titleSmall.textDecoration};
  text-transform: ${typographyStyles.titleSmall.textTransform};
  color: ${(props) =>
    props.color ?? props.theme.base?.base1 ?? LIGHT_THEME.base.base1};
`;

export const TextRegular = styled.div<{ color?: string }>`
  font-size: ${typographyStyles.textRegular.fontSize};
  font-weight: ${typographyStyles.textRegular.fontWeight};
  font-style: ${typographyStyles.textRegular.fontStyle};
  line-height: ${typographyStyles.textRegular.lineHeight};
  text-decoration: ${typographyStyles.textRegular.textDecoration};
  text-transform: ${typographyStyles.textRegular.textTransform};
  color: ${(props) =>
    props.color ?? props.theme.base?.base1 ?? LIGHT_THEME.base.base1};
`;

export const TextSmall = styled.div<{ color?: string }>`
  font-size: ${typographyStyles.textSmall.fontSize};
  font-weight: ${typographyStyles.textSmall.fontWeight};
  font-style: ${typographyStyles.textSmall.fontStyle};
  line-height: ${typographyStyles.textSmall.lineHeight};
  text-decoration: ${typographyStyles.textSmall.textDecoration};
  text-transform: ${typographyStyles.textSmall.textTransform};
  color: ${(props) =>
    props.color ?? props.theme.base?.base1 ?? LIGHT_THEME.base.base1};
`;

export const TextCaption = styled.div<{ color?: string }>`
  font-size: ${typographyStyles.textCaption.fontSize};
  font-weight: ${typographyStyles.textCaption.fontWeight};
  font-style: ${typographyStyles.textCaption.fontStyle};
  line-height: ${typographyStyles.textCaption.lineHeight};
  text-decoration: ${typographyStyles.textCaption.textDecoration};
  text-transform: ${typographyStyles.textCaption.textTransform};
  color: ${(props) =>
    props.color ?? props.theme.base?.base2 ?? LIGHT_THEME.base.base2};
`;

type MyThemeType = typeof DEFAULT_THEME;

declare module "styled-components" {
  export interface DefaultTheme extends MyThemeType {}
}
