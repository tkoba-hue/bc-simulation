import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BC商談シミュレーション',
  description: '仕事と介護の両立支援 - 初回商談シミュレーション',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
