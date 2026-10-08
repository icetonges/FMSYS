import Link from 'next/link';
import { getDataModel } from '../data/dataModels';

// Numbered data-object table and join paths shown on each system blueprint page.
export default function DataModelSection({ system, tableNumber }) {
  const model = getDataModel(system.slug);
  if (!model) return null;
  const physical = model.platform === 'sap' || model.platform === 'oracle-ebs';

  return (
    <section className="data-model" id="data-model">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Data model and tables</p>
          <h2>Where {system.shortName} data lives and how the pieces join</h2>
          <p>{model.basis}</p>
        </div>
        <Link className="kb-link" href={`/knowledge/${model.platform}`}>
          Open {model.platformLabel} reference
        </Link>
      </div>

      <figure className="kb-table">
        <figcaption>
          <span className="kb-number">Table {tableNumber}</span>
          {system.shortName} data objects by area
        </figcaption>
        <div className="paper-table-wrap">
          <table className="paper-table">
            <thead>
              <tr>
                <th>Table or record</th>
                <th>Area</th>
                <th>Holds</th>
                <th>Key fields</th>
                <th>Links to</th>
              </tr>
            </thead>
            <tbody>
              {model.tables.map((row) => (
                <tr key={`${row[0]}-${row[1]}`}>
                  <td>{physical ? <code>{row[0]}</code> : row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td>{row[3]}</td>
                  <td>{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <div className="scenario-card">
        <h3>Join paths for tracing a balance to its source</h3>
        <ol>
          {model.joins.map((join) => <li key={join}>{join}</li>)}
        </ol>
      </div>
    </section>
  );
}
