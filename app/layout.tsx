import type { Metadata } from "next";
import { Victor_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const victorMono = Victor_Mono({
  weight: ["400","500","600"],
  variable:"--font-victor-mono",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "The Vault",
  description: "Personal image archive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${victorMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
