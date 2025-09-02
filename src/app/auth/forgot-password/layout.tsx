import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aquivar - Esqueci a senha",
  other: {
    google: "notranslate",
    translate: "no",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
