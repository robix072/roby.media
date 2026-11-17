import { Anton, Manrope } from "next/font/google";

// Ambele fonturi au diacriticele românești (ă â î ș ț). `latin-ext` conține ș/ț/ă.
export const anton = Anton({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-anton",
  display: "swap",
});

export const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});
