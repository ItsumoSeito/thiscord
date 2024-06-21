import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import { Toaster } from '@/components/ui/toaster';
import MainSidebar from '@/components/layout/MainSidebar';
import Authentication from '@/components/pages/Authentication.page';
import { isAuthenticated } from '@/lib/utils/awsServer/user';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Thiscord',
  description: 'A Discord clone built with Next.js and Amplify',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isLoggedIn = await isAuthenticated();
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers isLoggedIn={isLoggedIn}>
          {isLoggedIn ? (
            <>
              <MainSidebar />
              {children}
            </>
          ) : (
            <Authentication />
          )}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
