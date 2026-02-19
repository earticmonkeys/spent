import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { Toaster } from "react-hot-toast";
import { Menu } from "@/component/Menu";
import { Providers } from "./provider";
import theme from "@/theme/theme";

export const metadata: Metadata = {
  title: "Expense Tracker",
  manifest: "/manifest.json",
  description: "Expense Tracker ",
};

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Toaster position="top-center" />
            <Providers>{children}</Providers>
            <Menu />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
