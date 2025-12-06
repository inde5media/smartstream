import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'StreamSmart - Stop Scrolling. Start Watching.',
  description:
    'AI voice assistant finds your perfect show in 60 seconds - across ALL your streaming platforms.',
  keywords: [
    'streaming',
    'TV',
    'movies',
    'recommendations',
    'AI',
    'voice assistant',
    'Netflix',
    'TV5Monde',
  ],
  authors: [{ name: 'StreamSmart' }],
  openGraph: {
    title: 'StreamSmart - Stop Scrolling. Start Watching.',
    description:
      'AI voice assistant finds your perfect show in 60 seconds - across ALL your streaming platforms.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background font-sans">
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
