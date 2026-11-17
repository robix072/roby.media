import type { ReactNode } from "react";
import "./globals.css";

// Layout-ul cu <html> este în app/[locale]/layout.tsx (limba paginii vine din URL).
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
