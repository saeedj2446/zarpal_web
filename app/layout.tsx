import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AppProviders } from "../components/providers/app-providers";
import AuthGuard from "@/app/public/AuthGuard";

export const metadata: Metadata = {
    title: "زرپال",
    description: "پلتفرم پرداخت با تسویه طلا",
    generator: "Next.js",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="fa"
            dir="rtl"
            suppressHydrationWarning
            className={`${GeistSans.variable} ${GeistMono.variable}`}
        >
        <body className={GeistSans.className}>
        <AppProviders>
            <AuthGuard>{children}</AuthGuard>
        </AppProviders>
        </body>
        </html>
    );
}
