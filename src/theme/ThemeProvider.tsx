import React, { ReactNode, useEffect, useState } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { Theme } from "./theme.types";
import { defaultTheme } from "./defaultTheme";
import { GlobalStyle } from "./globalStyles";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: React.Dispatch<React.SetStateAction<ThemeMode>>;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = React.createContext<ThemeContextType>({
  themeMode: "light",
  setThemeMode: () => null,
  theme: defaultTheme,
  setTheme: () => null,
});

interface IThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: IThemeProviderProps) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeMode);
  }, [themeMode]);

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode,
        theme,
        setTheme,
      }}
    >
      <StyledThemeProvider theme={theme}>
        <GlobalStyle theme={theme} />
        <div className={`theme--${themeMode}`}>{children}</div>
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
