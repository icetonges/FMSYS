import './globals.css';

export const metadata = {
  title: 'DoD FM System Architecture Blueprints',
  description: 'Interactive DoD financial management architecture blueprints for GFEBS, GCSS-Army, LMP, GCSS-MC, STARS, SABRS, FAMIS, DDRS, GTAS/CARS, ADS/DDS/DCAS, IPAC, MOCAS, Navy ERP, DAI, DEAMS, GAFS, CEFMS, DLA EBS, ABSS, audit readiness, and UoT traceability, plus a full research-paper appendix on the DoD financial systems landscape.'
};

const themeInitScript = `(function(){try{var t=window.localStorage.getItem('fmsys-theme');document.documentElement.setAttribute('data-theme', t==='light' ? 'light' : 'dark');}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
