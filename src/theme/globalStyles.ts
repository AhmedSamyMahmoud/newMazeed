import { createGlobalStyle } from "styled-components";
import { Theme } from "./theme.types";
import { generateCSSVariables } from "./cssVariables";

export const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  ${({ theme }) => generateCSSVariables(theme)}
  
  :root {
    --bg-primary: ${({ theme }) => theme.colors["bg-primary-light"]};
    color: ${({ theme }) => theme.colors["text-primary-light"]};
    --border-color: ${({ theme }) => theme.colors["border-primary-light"]};
  }

  [data-theme="dark"] {
    --bg-primary: ${({ theme }) => theme.colors["bg-primary-dark"]};
    color: ${({ theme }) => theme.colors["text-primary-dark"]};
    --border-color: ${({ theme }) => theme.colors["border-primary-dark"]};
  }

  body {
    margin: 0;
    padding: 0;
  }

  * {
    border-color: var(--border-color);
  }

  input, select, textarea, button {
    border: 1px solid ${({ theme }) => theme.colors["border-primary-light"]};
    border-radius: ${({ theme }) => theme.borderRadius["radius-md"]};
    font-size: ${({ theme }) => theme.fontSizes["text-sm"]};
    line-height: ${({ theme }) => theme.lineHeights["text-sm"]};
    font-weight: ${({ theme }) => theme.fontWeights["semibold"]};
  }

  [data-theme="dark"] input,
  [data-theme="dark"] select,
  [data-theme="dark"] textarea,
  [data-theme="dark"] button {
    border: 2px solid ${({ theme }) => theme.colors["border-primary-dark"]};
    border-radius: ${({ theme }) => theme.borderRadius["radius-md"]};
    font-size: ${({ theme }) => theme.fontSizes["text-sm"]};
    line-height: ${({ theme }) => theme.lineHeights["text-sm"]};
    font-weight: ${({ theme }) => theme.fontWeights["semibold"]};
  }

  .container {
    display: flex;
    width: 100%;
    height: 100vh;
    padding: 8px;
  }
  .page-content {
    padding: 0 20px 20px 20px;
    width: 100%;
    overflow: auto;
  }
  .tags-container {
     display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
`;
