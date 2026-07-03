import './globals.css';

export const metadata = {
  title: 'DoD FM System Architecture Blueprints',
  description: 'Interactive DoD financial management architecture blueprints for GFEBS, Navy ERP, DAI, DEAMS, GAFS, CEFMS, DLA EBS, audit readiness, and UoT traceability.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
