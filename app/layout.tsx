import '../styles/globals.css';
import { ChatProvider } from '../context/ChatContext';
import { Montserrat } from 'next/font/google';
import { Metadata } from 'next';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'AI Chat Assistant Hub',
  description: 'A modern hub for various AI assistants',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head />
      <body className="h-full">
        <ChatProvider>{children}</ChatProvider>
      </body>
    </html>
  );
}