"use client";
import React, { createContext, useState } from "react";

export const MyContext = createContext<{
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}>({
  text: "",
  setText: () => {},
});

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [text, setText] = useState<string>("");

  return (
    <MyContext.Provider value={{ text, setText }}>
      {children}
    </MyContext.Provider>
  );
};
