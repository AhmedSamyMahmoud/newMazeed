import "styled-components";

export type Colors = {
  [key: string]: string;
};

export type FontSizes = {
  [key: string]: string;
};

export type LineHeights = {
  [key: string]: string;
};

export type FontWeights = {
  [key: string]: string;
};

export type Shadows = {
  [key: string]: string;
};

export type Breakpoints = {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
};

export type InputStyles = {
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
};

export type Theme = {
  colors: Colors;
  fontSizes: FontSizes;
  lineHeights: LineHeights;
  fontWeights: FontWeights;
  spacing: {
    [key: string]: string;
  };
  borderRadius: {
    [key: string]: string;
  };
  shadows: Shadows;
  breakpoints: Breakpoints;
  inputs: InputStyles;
};

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
