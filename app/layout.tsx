import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

// Sans-serif font for body text (clean, readable)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Serif font for headings (mid-century, freight-inspired)
const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "America the Quizzy - US Citizenship Test Practice",
  description: "Practice for the US citizenship test with an engaging, Americana-themed quiz application. Study with official USCIS questions and get instant feedback.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${merriweather.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
