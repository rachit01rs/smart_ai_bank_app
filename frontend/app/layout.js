import './globals.css';

export const metadata = {
  title: 'Smart AI Bank',
  description: 'Smart AI Bank — OpenShift training demo application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
