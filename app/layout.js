import './globals.css';

export const metadata = {
  title: 'GFEBS Architecture Blueprint',
  description: 'Interactive GFEBS / SAP-based financial management architecture blueprint for DoD audit readiness and UoT traceability.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
