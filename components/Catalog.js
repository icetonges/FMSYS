'use client';

import { useMemo, useState } from 'react';

// Searchable, filterable reference table used for the large SAP catalogs.
export default function Catalog({ number, caption, columns, rows, facetIndex = 1, facetLabel = 'Area', note, id }) {
  const [query, setQuery] = useState('');
  const [facet, setFacet] = useState('all');

  const facets = useMemo(() => {
    const counts = new Map();
    rows.forEach((row) => counts.set(row[facetIndex], (counts.get(row[facetIndex]) || 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [rows, facetIndex]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (facet !== 'all' && row[facetIndex] !== facet) return false;
      if (!q) return true;
      return row.some((cell) => String(cell).toLowerCase().includes(q));
    });
  }, [rows, query, facet, facetIndex]);

  return (
    <figure className="kb-table kb-catalog" id={id}>
      <figcaption>
        <span className="kb-number">Table {number}</span>
        {caption}
      </figcaption>
      <div className="kb-catalog-controls">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Search ${rows.length} entries`}
          aria-label={`Search ${caption}`}
        />
        <select value={facet} onChange={(event) => setFacet(event.target.value)} aria-label={`Filter by ${facetLabel}`}>
          <option value="all">All {facetLabel.toLowerCase()}s ({rows.length})</option>
          {facets.map(([name, count]) => (
            <option key={name} value={name}>{name} ({count})</option>
          ))}
        </select>
        <span className="kb-catalog-count">{visible.length} shown</span>
      </div>
      <div className="paper-table-wrap kb-catalog-wrap">
        <table className="paper-table">
          <thead>
            <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, index) => (
                  <td key={index}>{index === 0 ? <code>{cell}</code> : cell}</td>
                ))}
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={columns.length}>No entries match.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {note && <p className="kb-note">{note}</p>}
    </figure>
  );
}
