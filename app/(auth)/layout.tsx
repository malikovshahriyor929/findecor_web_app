import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import QueryProvider from "@/provider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  icons: "../logo.svg",
  title: "Findecor",
  description: "Findecor: an AI assistant that helps you find, style and furnish your home.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script async src="https://telegram.org/js/telegram-web-app.js?59"></script>
      </head>
      <body className={`${inter.className}  antialiased`}>
        <QueryProvider>{children}</QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
