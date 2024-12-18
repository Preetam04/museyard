"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ContextProvider } from "@/lib/context";
import React from "react";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ContextProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </ContextProvider>
  );
}
