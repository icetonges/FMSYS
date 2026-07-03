import Link from 'next/link';
import { systems } from '../data/systems';

export default function Page() {
  return (
    <main>
      <nav className="system-tabs" aria-label="DoD financial management systems">
        <Link href="/" className="suite-link">DoD FM Systems</Link>
        <div className="system-tab-list">
          {systems.map((system) => (
            <Link key={system.slug} className="system-tab" href={`/systems/${system.slug}`}>
              <span>{system.shortName}</span>
              <small>{system.agency}</small>
            </Link>
          ))}
        </div>
      </nav>

      <section className="hero suite-hero">
        <div className="hero-copy">
          <p className="eyebrow">DoD FM system suite</p>
          <h1>Financial Management System Architecture Blueprints</h1>
          <p>
            Navigate between GFEBS, GCSS-Army, LMP, GCSS-MC, STARS, Navy ERP, DAI, DEAMS, GAFS, CEFMS, DLA EBS, ABSS, and future DoD financial management systems using a shared audit-readiness,
            UoT lineage, source-to-statement model.
          </p>
          <div className="hero-actions">
            <Link href="/systems/gfebs" className="primary-action">Open GFEBS</Link>
            <Link href="/systems/gcss-army" className="secondary-action">Open GCSS-Army</Link>
            <Link href="/systems/lmp" className="secondary-action">Open LMP</Link>
            <Link href="/systems/gcss-mc" className="secondary-action">Open GCSS-MC</Link>
            <Link href="/systems/stars" className="secondary-action">Open STARS</Link>
            <Link href="/systems/navy-erp" className="secondary-action">Open Navy ERP</Link>
            <Link href="/systems/dai" className="secondary-action">Open DAI</Link>
            <Link href="/systems/deams" className="secondary-action">Open DEAMS</Link>
            <Link href="/systems/gafs" className="secondary-action">Open GAFS</Link>
            <Link href="/systems/gafs-jv" className="secondary-action">Open GAFS JV</Link>
            <Link href="/systems/cefms" className="secondary-action">Open CEFMS</Link>
            <Link href="/systems/dla-ebs" className="secondary-action">Open DLA EBS</Link>
            <Link href="/systems/abss" className="secondary-action">Open ABSS</Link>
          </div>
        </div>
        <div className="hero-card">
          <span className="hero-metric">{systems.length}</span>
          <p>System blueprints online</p>
          <span className="hero-metric small">Source -&gt; Detail -&gt; GL -&gt; Statement</span>
        </div>
      </section>

      <section className="system-directory">
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
    </main>
  );
}
