import Link from 'next/link';
import { notFound } from 'next/navigation';
import TopNav from '../../../components/TopNav';
import KnowledgeContent, { prepareBlocks } from '../../../components/KnowledgeContent';
import { knowledgePages, knowledgeMeta, getKnowledgePage, getKnowledgeNav } from '../../../data/knowledge';
import { systems } from '../../../data/systems';

export function generateStaticParams() {
  return knowledgePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getKnowledgePage(slug);
  if (!page) return {};
  return { title: `${page.shortTitle} | ${knowledgeMeta.title}`, description: page.blurb };
}

export default async function KnowledgePage({ params }) {
  const { slug } = await params;
  const page = getKnowledgePage(slug);
  if (!page) notFound();

  const { prev, next } = getKnowledgeNav(slug);
  const { prepared, toc, tableCount, figureCount } = prepareBlocks(page.blocks, page.prefix);
  const related = systems.filter((system) => page.appliesTo?.includes(system.slug));
  const tables = prepared.filter((block) => block.type === 'table');
  const figures = prepared.filter((block) => block.type === 'figure');

  return (
    <main>
      <TopNav showTabs={false} />

      <section className="hero paper-hero">
        <div className="hero-copy">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.navTitle}</h1>
          <p>{page.blurb}</p>
          {related.length > 0 && (
            <div className="kb-related">
              <span>Applies to</span>
              {related.map((system) => (
                <Link key={system.slug} href={`/systems/${system.slug}`}>{system.shortName}</Link>
              ))}
            </div>
          )}
        </div>
        <div className="hero-card">
          <span className="hero-metric">{tableCount}</span>
          <p>Numbered tables</p>
          <span className="hero-metric small">{figureCount} diagrams</span>
        </div>
      </section>

      <div className="paper-layout">
        <aside className="paper-toc" aria-label="Page contents">
          <h2>On this page</h2>
          <ul className="paper-toc-list">
            {toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.text}</a>
                {item.subs.length > 0 && (
                  <ul className="paper-toc-sub">
                    {item.subs.map((sub) => (
                      <li key={sub.id}><a href={`#${sub.id}`}>{sub.text}</a></li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <details className="kb-toc-list">
            <summary>List of tables ({tables.length})</summary>
            <ul className="paper-toc-sub">
              {tables.map((block) => (
                <li key={block.number}><a href={`#table-${block.number.toLowerCase()}`}>{block.number} {block.caption}</a></li>
              ))}
            </ul>
          </details>
          <details className="kb-toc-list">
            <summary>List of figures ({figures.length})</summary>
            <ul className="paper-toc-sub">
              {figures.map((block) => (
                <li key={block.number}><a href={`#figure-${block.number.toLowerCase()}`}>{block.number} {block.caption}</a></li>
              ))}
            </ul>
          </details>
          <div className="paper-toc-back">
            <Link href="/knowledge">&larr; Knowledge base</Link>
          </div>
        </aside>

        <div>
          <KnowledgeContent blocks={prepared} />

          {page.sources?.length > 0 && (
            <section className="kb-sources">
              <h2>Sources</h2>
              <ol>
                {page.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer">{source.name}</a>
                  </li>
                ))}
              </ol>
              <p>{knowledgeMeta.disclaimer}</p>
            </section>
          )}

          <div className="paper-nav-row">
            {prev ? (
              <Link className="paper-nav-card prev" href={`/knowledge/${prev.slug}`}>
                <span>&larr; Previous</span>
                <strong>{prev.shortTitle}</strong>
              </Link>
            ) : <span />}
            {next ? (
              <Link className="paper-nav-card next" href={`/knowledge/${next.slug}`}>
                <span>Next &rarr;</span>
                <strong>{next.shortTitle}</strong>
              </Link>
            ) : <span />}
          </div>
        </div>
      </div>
    </main>
  );
}
