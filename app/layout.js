import './globals.css';

export const metadata = {
  title: 'DoD FM System Architecture Blueprints',
  description: 'Interactive DoD financial management architecture blueprints for GFEBS, GCSS-Army, LMP, GCSS-MC, STARS, Navy ERP, DAI, DEAMS, GAFS, CEFMS, DLA EBS, ABSS, audit readiness, and UoT traceability.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
