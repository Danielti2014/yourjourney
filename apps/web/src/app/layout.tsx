import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Your Journey',
  description: 'Plano de estudos adaptativo a partir do seu proprio material',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
