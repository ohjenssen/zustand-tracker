import ProtectedRoute from "./components/ProtectedRoute";
import "./globals.css";

export const metadata = {
  title: 'ScanMaster',
  manifest: '/manifest.json',
  description: 'An app for tracking your meals and calories by adding real food products from stores.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ScanMaster',
  },
}

export const viewport= {
  themeColor: '#000000',
}

export default async function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className="min-h-full flex flex-col">
            {children}
            </body>
        </html>
    );
}

