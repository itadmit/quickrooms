import type { Metadata } from "next";
import { Noto_Sans_Hebrew, Pacifico } from "next/font/google";
import "./globals.css";

const notoSansHebrew = Noto_Sans_Hebrew({
  subsets: ["hebrew"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-sans-hebrew",
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
});

export const metadata: Metadata = {
  title: "Quick Rooms - ניהול חדרי ישיבות",
  description: "פלטפורמת ניהול והזמנת חדרי ישיבות למתחמי עבודה",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${notoSansHebrew.variable} ${pacifico.variable} ${notoSansHebrew.className} antialiased`}>{children}</body>
    </html>
  );
}
