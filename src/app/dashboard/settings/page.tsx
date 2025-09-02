"use client";
import { SettingsContent } from "./components/settings-content";
import { useFont } from "@/contexts/font-context";

export default function SettingsPage() {
  const { currentFont, fontSize, setCurrentFont, setFontSize } = useFont();

  return (
    <div className="w-full">
      <SettingsContent
        currentFont={currentFont}
        onFontChange={setCurrentFont}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />
    </div>
  );
}
