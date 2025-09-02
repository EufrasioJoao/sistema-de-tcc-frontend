"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { storage } from "@/lib/storage";

interface FontContextType {
  currentFont: string;
  fontSize: number;
  setCurrentFont: (font: string) => void;
  setFontSize: (size: number) => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [currentFont, setCurrentFont] = useState(() =>
    storage.get("userFont", "font-geist")
  );

  const [fontSize, setFontSize] = useState(() =>
    storage.get("userFontSize", 14)
  );

  useEffect(() => {
    const body = document.querySelector("body");
    if (body) {
      body.style.fontSize = `${fontSize}px`;
      body.classList.remove(
        "font-geist",
        "font-roboto-condensed",
        "font-poppins",
        "font-space"
      );
      body.classList.add(currentFont);
    }
    storage.set("userFont", currentFont);
    storage.set("userFontSize", fontSize);
  }, [fontSize, currentFont]);

  return (
    <FontContext.Provider
      value={{
        currentFont,
        fontSize,
        setCurrentFont,
        setFontSize,
      }}
    >
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error("useFont must be used within a FontProvider.");
  }
  return context;
}
