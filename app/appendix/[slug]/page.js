import Link from 'next/link';
import { notFound } from 'next/navigation';
import TopNav from '../../../components/TopNav';
import PaperContent, { buildHeadingIndex } from '../../../components/PaperContent';
import { paperSections, getPaperSection, getPaperNav, paperMeta } from '../../../data/paper';

export function generateStaticParams() {
  return paperSections.map((section) => ({ slug: section.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const section = getPaperSection(slug);
  if (!section) return {};
  return {
    title: `${section.navTitle} — ${paperMeta.title}`,
    description: section.blurb
  };
}

export default async function AppendixSectionPage({ params }) {
  const { slug } = await params;
  const section = getPaperSection(slug);

  if (!section) {
    notFound();
  }

  const { prev, next } = getPaperNav(slug);
  const toc = buildHeadingIndex(section.blocks);

  return (
    <main>
      <TopNav />

      <section className="hero paper-hero">
        <div className="hero-copy">
          <p className="eyebrow">{section.eyebrow}</p>
          <h1>{section.navTitle}</h1>
          <p>{section.blurb}</p>
          <div className="paper-meta-row">
            <span>{paperMeta.prepared}</span>
            <span>{paperMeta.compiled}</span>
          </div>
        </div>
        <div className="hero-card">
          <span className="hero-metric small">{paperMeta.disclaimer}</span>
        </div>
      </section>

      <div className="paper-layout">
        <aside className="paper-toc" aria-label="Section contents">
          <h2>In this section</h2>
          <ul className="paper-toc-list">
            {toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.text}</a>
                {item.subs.length > 0 && (
                  <ul className="paper-toc-sub">
                    {item.subs.map((sub) => (
                      <li key={sub.id}>
                        <a href={`#${sub.id}`}>{sub.text}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="paper-toc-back">
            <Link href="/appendix">&larr; All sections</Link>
          </div>
        </aside>

        <div>
          <PaperContent blocks={section.blocks} />

          <div className="paper-nav-row">
            {prev ? (
              <Link className="paper-nav-card prev" href={`/appendix/${prev.slug}`}>
                <span>&larr; Previous</span>
                <strong>{prev.navTitle}</strong>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link className="paper-nav-card next" href={`/appendix/${next.slug}`}>
                <span>Next &rarr;</span>
                <strong>{next.navTitle}</strong>
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
