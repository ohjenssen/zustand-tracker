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

export const metadata = {
  title: 'ScanMaster',
  manifest: '/manifest.json',
  description: 'An app for tracking your meals and calories by adding real food products from stores.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MinApp',
  },
}

export const viewport= {
  themeColor: '#000000',
}

export default async function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

