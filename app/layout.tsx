import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getCurrentUser } from "@/lib/session";
import { toPublicUser } from "@/lib/types";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartLib — Search. Learn. Discover.",
  description: "A smart electronic library for students, researchers, and administrators.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar user={user ? toPublicUser(user) : null} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
