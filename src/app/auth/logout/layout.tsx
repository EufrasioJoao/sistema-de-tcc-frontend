import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terminar sessão",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
