"use client";

import { ThemeProvider } from "next-themes";

const NextThemeProvider = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

export default NextThemeProvider;
