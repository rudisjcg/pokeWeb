import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import { strings } from "@/lib/strings";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: strings.meta.title, template: `%s | ${strings.meta.title}` },
  description: strings.meta.description,
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={poppins.variable}>
      <body>
        <div className="bg-primary h-full">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
