import './globals.css';
import { AuthProvider } from './providers';

export const metadata = {
  title: 'Dumka Sports Academy Desk',
  description: 'Digital Practice & Trial Readiness System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}