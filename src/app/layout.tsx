import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChatBot Demo",
  description: "ChatBot using Llama & Groq API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
