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
            Navigate between GFEBS, Navy ERP, DAI, DEAMS, and future DoD financial management systems using a shared audit-readiness,
            UoT lineage, source-to-statement model.
          </p>
          <div className="hero-actions">
            <Link href="/systems/gfebs" className="primary-action">Open GFEBS</Link>
            <Link href="/systems/navy-erp" className="secondary-action">Open Navy ERP</Link>
            <Link href="/systems/dai" className="secondary-action">Open DAI</Link>
            <Link href="/systems/deams" className="secondary-action">Open DEAMS</Link>
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
