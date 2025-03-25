import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IEEE RITB Admin Portal",
  description: "Admin portal for IEEE RITB",
};

export default function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
    >
      <body
        className={`${montserrat.className}`}
      >
        <SessionProvider>
          <Provider>
            {children}
            <Toaster />
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
