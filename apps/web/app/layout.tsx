import type { Metadata } from "next";
import { Chakra_Petch, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import AuthProvider from "@/components/auth/AuthProvider";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { strings } from "@/lib/strings";
import "./globals.css";

const display = Chakra_Petch({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: strings.meta.title, template: `%s | ${strings.meta.title}` },
  description: strings.meta.description,
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`} data-scroll-behavior="smooth">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="pt-[var(--nav-height)]">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
