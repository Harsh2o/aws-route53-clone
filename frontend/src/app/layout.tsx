import '@cloudscape-design/global-styles/index.css';
import './globals.css';
import { Providers } from '@/components/providers';

export const metadata = {
  title: 'Route 53 Clone',
  description: 'AWS Route 53 clone frontend',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="awsui-dark-mode">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
