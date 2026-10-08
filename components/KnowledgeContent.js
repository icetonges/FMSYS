import Link from 'next/link';
import Diagram from './Diagram';
import Catalog from './Catalog';

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 70);
}

// Inline markup: `code` and **bold**.
export function Rich({ text }) {
  if (typeof text !== 'string') return text ?? null;
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) return <Link key={index} href={link[2]}>{link[1]}</Link>;
    if (part.startsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    return <span key={index}>{part}</span>;
  });
}

// Assigns heading ids plus table and figure numbers in reading order.
export function prepareBlocks(blocks, prefix) {
  const seen = new Map();
  let tableCount = 0;
  let figureCount = 0;
  const toc = [];
  let current = null;

  const prepared = blocks.map((block) => {
    if (block.type === 'h2' || block.type === 'h3') {
      const base = slugify(block.text) || 'section';
      const count = seen.get(base) || 0;
      seen.set(base, count + 1);
      const id = count === 0 ? base : `${base}-${count}`;
      if (block.type === 'h2') {
        current = { id, text: block.text, subs: [] };
        toc.push(current);
      } else if (current) {
        current.subs.push({ id, text: block.text });
      }
      return { ...block, id };
    }
    if (block.type === 'table' || block.type === 'catalog') {
      tableCount += 1;
      return { ...block, number: `${prefix}-${tableCount}` };
    }
    if (block.type === 'figure') {
      figureCount += 1;
      return { ...block, number: `${prefix}-${figureCount}` };
    }
    return block;
  });

  return { prepared, toc, tableCount, figureCount };
}

export function NumberedTable({ number, caption, head, rows, note, id }) {
  return (
    <figure className="kb-table" id={id}>
      <figcaption>
        <span className="kb-number">Table {number}</span>
        <Rich text={caption} />
      </figcaption>
      <div className="paper-table-wrap">
        <table className="paper-table">
          <thead>
            <tr>{head.map((cell, index) => <th key={index}>{cell}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => <td key={cellIndex}><Rich text={cell} /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className="kb-note"><Rich text={note} /></p>}
    </figure>
  );
}

export default function KnowledgeContent({ blocks }) {
  return (
    <div className="paper-content kb-content">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'h2':
            return <h2 id={block.id} key={index}>{block.text}</h2>;
          case 'h3':
            return <h3 id={block.id} key={index}>{block.text}</h3>;
          case 'p':
            return <p key={index}><Rich text={block.text} /></p>;
          case 'list':
            return <ul key={index}>{block.items.map((item, i) => <li key={i}><Rich text={item} /></li>)}</ul>;
          case 'steps':
            return <ol className="kb-steps" key={index}>{block.items.map((item, i) => <li key={i}><Rich text={item} /></li>)}</ol>;
          case 'callout':
            return (
              <aside className={`kb-callout ${block.tone || ''}`} key={index}>
                <strong>{block.title}</strong>
                <p><Rich text={block.text} /></p>
              </aside>
            );
          case 'table':
            return <NumberedTable key={index} {...block} id={`table-${block.number.toLowerCase()}`} />;
          case 'catalog':
            return <Catalog key={index} {...block} id={`table-${block.number.toLowerCase()}`} />;
          case 'figure':
            return (
              <figure className="kb-figure" key={index} id={`figure-${block.number.toLowerCase()}`}>
                <figcaption>
                  <span className="kb-number">Figure {block.number}</span>
                  <Rich text={block.caption} />
                </figcaption>
                <Diagram spec={block.spec} label={block.caption} />
                {block.note && <p className="kb-note"><Rich text={block.note} /></p>}
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
