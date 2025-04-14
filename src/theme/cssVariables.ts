import { Theme } from "./theme.types";
import { css } from "styled-components";

type ThemeSection = keyof Theme;

const createCSSVariables = (
  section: ThemeSection,
  values: Record<string, string>,
  prefix = ""
): string => {
  return Object.entries(values)
    .map(([key, value]) => {
      const varName = prefix ? `--${prefix}-${key}` : `--${key}`;
      return `${varName}: ${value};`;
    })
    .join("\n");
};

export const generateCSSVariables = (theme: Theme) => css`
  :root {
    /* Colors */
    ${createCSSVariables("colors", theme.colors)}

    /* Font Sizes */
    ${createCSSVariables("fontSizes", theme.fontSizes, "font-size")}

    /* Line Heights */
    ${createCSSVariables("lineHeights", theme.lineHeights, "line-height")}

    /* Font Weights */
    ${createCSSVariables("fontWeights", theme.fontWeights, "font-weight")}

    /* Spacing */
    ${createCSSVariables("spacing", theme.spacing, "spacing")}

    /* Border Radius */
    ${createCSSVariables("borderRadius", theme.borderRadius, "radius")}
  }
`;
