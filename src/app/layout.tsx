import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vantage College — Find the right college with real data",
  description:
    "Search, compare and shortlist colleges by fees, placements and ratings — built on structured data, not marketing copy.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <NavBar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line py-8 text-center text-sm text-slate">
          Built as a College Discovery Platform demo — data is illustrative, not live admissions data.
        </footer>
      </body>
    </html>
  );
}
