import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Momentia — Experiencias digitales que se sienten",
  description:
    "Crea regalos personalizados para cumpleaños, aniversarios, Día de la Madre, Navidad y cualquier ocasión especial.",
};

// No agregues nada de "icons" aquí: al tener app/icon.png y
// app/apple-icon.png en la carpeta app/, Next.js los detecta
// automáticamente por convención y genera los <link rel="icon"> solo.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}