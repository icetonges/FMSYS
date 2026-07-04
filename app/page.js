import Link from 'next/link';
import { systems } from '../data/systems';
import { paperSections, paperMeta } from '../data/paper';
import TopNav from '../components/TopNav';

export default function Page() {
  return (
    <main>
      <TopNav showTabs={false} />

      <section className="hero suite-hero">
        <div className="hero-copy">
          <p className="eyebrow">DoD FM system suite</p>
          <h1>Financial Management System Architecture Blueprints</h1>
          <p>
            Navigate between GFEBS, GCSS-Army, LMP, GCSS-MC, STARS, SABRS, FAMIS, DDRS, GTAS/CARS, ADS/DDS/DCAS, IPAC, MOCAS, PIEE, Navy ERP, DAI, DEAMS, GAFS, CEFMS, DLA EBS, ABSS, and future DoD financial management systems using a shared audit-readiness,
            UoT lineage, source-to-statement model.
          </p>
          <div className="hero-actions">
            <a href="#directory" className="primary-action">Browse all {systems.length} systems</a>
            <Link href="/appendix" className="secondary-action">Open research paper appendix</Link>
          </div>
        </div>
        <div className="hero-card">
          <span className="hero-metric">{systems.length}</span>
          <p>System blueprints online</p>
          <span className="hero-metric small">Source -&gt; Detail -&gt; GL -&gt; Statement</span>
        </div>
      </section>

      <section className="system-directory" id="directory">
        <div className="section-heading">
          <div>
            <p className="eyebrow">System navigation</p>
            <h2>Select a DoD FM system</h2>
            <p>Each page keeps the same controls, lineage explorer, audit lens, and static reference toggle so systems can be compared consistently.</p>
          </div>
        </div>
        <div className="directory-grid">
          {systems.map((system) => (
            <Link className="directory-card" href={`/systems/${system.slug}`} key={system.slug}>
              <span>{system.agency}</span>
              <h3>{system.name}</h3>
              <p>{system.description}</p>
              <strong>Open blueprint</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="system-directory" id="research-paper">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Research paper appendix</p>
            <h2>{paperMeta.title}</h2>
            <p>{paperMeta.subtitle}</p>
          </div>
        </div>
        <div className="hero-actions" style={{ marginBottom: 16 }}>
          <Link href="/appendix" className="primary-action">Open the full appendix</Link>
        </div>
        <div className="directory-grid">
          {paperSections.map((section) => (
            <Link className="directory-card" href={`/appendix/${section.slug}`} key={section.slug}>
              <span>{section.eyebrow}</span>
              <h3>{section.navTitle}</h3>
              <p>{section.blurb}</p>
              <strong>Read section</strong>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
