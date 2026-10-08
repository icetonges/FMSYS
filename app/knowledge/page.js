import Link from 'next/link';
import TopNav from '../../components/TopNav';
import { knowledgePages, knowledgeMeta, countBlocks } from '../../data/knowledge';
import { systems } from '../../data/systems';
import { getDataModel } from '../../data/dataModels';

export const metadata = {
  title: knowledgeMeta.title,
  description: knowledgeMeta.subtitle
};

const platformNames = {
  sap: 'SAP ERP',
  'oracle-ebs': 'Oracle E-Business Suite',
  ddrs: 'DDRS and Treasury reporting',
  integration: 'Cross-system',
  'other-platforms': 'Legacy, custom, DFAS, Treasury'
};

export default function KnowledgeIndexPage() {
  const totals = knowledgePages.reduce(
    (sum, page) => ({ tables: sum.tables + countBlocks(page, 'table'), figures: sum.figures + countBlocks(page, 'figure') }),
    { tables: 0, figures: 0 }
  );

  return (
    <main>
      <TopNav showTabs={false} />

      <section className="hero paper-hero">
        <div className="hero-copy">
          <p className="eyebrow">Platform knowledge base</p>
          <h1>{knowledgeMeta.title}</h1>
          <p>{knowledgeMeta.subtitle}</p>
          <div className="hero-actions">
            <Link href={`/knowledge/${knowledgePages[0].slug}`} className="primary-action">Start with how it all fits together</Link>
            <a href="#system-map" className="secondary-action">Find a system&apos;s platform</a>
          </div>
        </div>
        <div className="hero-card">
          <span className="hero-metric">{totals.tables}</span>
          <p>Numbered reference tables</p>
          <span className="hero-metric small">{totals.figures} architecture and data model diagrams</span>
        </div>
      </section>

      <section className="system-directory" id="references">
        <div className="section-heading">
          <div>
            <p className="eyebrow">References</p>
            <h2>Browse the knowledge base</h2>
            <p>{knowledgeMeta.compiled}. {knowledgeMeta.disclaimer}</p>
          </div>
        </div>
        <div className="directory-grid">
          {knowledgePages.map((page) => (
            <Link className="directory-card" href={`/knowledge/${page.slug}`} key={page.slug}>
              <span>{page.eyebrow}</span>
              <h3>{page.shortTitle}</h3>
              <p>{page.blurb}</p>
              <strong>
                {countBlocks(page, 'table')} tables, {countBlocks(page, 'figure')} {countBlocks(page, 'figure') === 1 ? 'diagram' : 'diagrams'}
              </strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="system-directory" id="system-map">
        <div className="section-heading">
          <div>
            <p className="eyebrow">System to platform map</p>
            <h2>Which reference applies to which system</h2>
            <p>Each system blueprint page also carries its own numbered table of data objects and join paths.</p>
          </div>
        </div>
        <div className="paper-table-wrap">
          <table className="paper-table">
            <thead>
              <tr>
                <th>System</th>
                <th>Owner</th>
                <th>Platform reference</th>
                <th>Data objects listed</th>
              </tr>
            </thead>
            <tbody>
              {systems.map((system) => {
                const model = getDataModel(system.slug);
                return (
                  <tr key={system.slug}>
                    <td><Link href={`/systems/${system.slug}#data-model`}>{system.name}</Link></td>
                    <td>{system.agency}</td>
                    <td>{model ? <Link href={`/knowledge/${model.platform}`}>{platformNames[model.platform]}</Link> : 'Not yet mapped'}</td>
                    <td>{model ? model.tables.length : 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
