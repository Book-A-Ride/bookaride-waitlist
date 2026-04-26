import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: "Book A Ride | BOUESTI's Trusted Ride Waitlist",
  description: "Move around BOUESTI faster, safer, and cheaper. Join the waitlist for the first student-focused ride-sharing system in Ikere-Ekiti.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: 'light' }}>
      <body
        className={`${outfit.variable} font-sans antialiased bg-white text-slate-900`}
        suppressHydrationWarning
      >
        <Header />
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#0F172A',
              color: '#F8FAFC',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#22C55E', secondary: '#FFFFFF' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' },
            },
          }}
        />
      </body>
    </html>
  );
}
