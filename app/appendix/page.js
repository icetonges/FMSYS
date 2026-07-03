import Link from 'next/link';
import TopNav from '../../components/TopNav';
import { paperSections, paperMeta } from '../../data/paper';

export const metadata = {
  title: paperMeta.title,
  description: paperMeta.subtitle
};

export default function AppendixIndexPage() {
  return (
    <main>
      <TopNav />

      <section className="hero paper-hero">
        <div className="hero-copy">
          <p className="eyebrow">Research paper appendix</p>
          <h1>{paperMeta.title}</h1>
          <p>{paperMeta.subtitle}</p>
          <div className="hero-actions">
            <Link href={`/appendix/${paperSections[0].slug}`} className="primary-action">
              Start at Executive Summary
            </Link>
            <a href="#sections" className="secondary-action">Jump to all sections</a>
          </div>
        </div>
        <div className="hero-card">
          <span className="hero-metric">{paperSections.length}</span>
          <p>Reference sections</p>
          <span className="hero-metric small">{paperMeta.prepared}</span>
        </div>
      </section>

      <section className="system-directory" id="sections">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Contents</p>
            <h2>Browse every section</h2>
            <p>{paperMeta.compiled} — {paperMeta.disclaimer}</p>
          </div>
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
