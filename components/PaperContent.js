function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 70);
}

export function buildHeadingIndex(blocks) {
  const majors = [];
  let current = null;
  const seen = new Map();

  function uniqueId(text) {
    const base = slugify(text) || 'section';
    const count = seen.get(base) || 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  }

  blocks.forEach((block) => {
    if (block.type === 'h1sub' || block.type === 'h2') {
      const id = uniqueId(block.text);
      current = { id, text: block.text, subs: [] };
      majors.push(current);
    } else if (block.type === 'h3') {
      const id = uniqueId(block.text);
      if (current) {
        current.subs.push({ id, text: block.text });
      } else {
        current = { id, text: block.text, subs: [] };
        majors.push(current);
      }
    }
  });

  return majors;
}

function Runs({ runs }) {
  return runs.map((run, index) => {
    if (run.b) return <strong key={index}>{run.t}</strong>;
    if (run.i) return <em key={index}>{run.t}</em>;
    return <span key={index}>{run.t}</span>;
  });
}

export default function PaperContent({ blocks }) {
  const headingIndex = buildHeadingIndex(blocks);
  const idQueue = [];
  headingIndex.forEach((major) => {
    idQueue.push(major.id);
    major.subs.forEach((sub) => idQueue.push(sub.id));
  });
  let cursor = 0;
  const nextId = () => idQueue[cursor++];

  return (
    <div className="paper-content">
      {blocks.map((block, index) => {
        if (block.type === 'h1sub' || block.type === 'h2') {
          return <h2 id={nextId()} key={index}>{block.text}</h2>;
        }
        if (block.type === 'h3') {
          return <h3 id={nextId()} key={index}>{block.text}</h3>;
        }
        if (block.type === 'h4') {
          return <h4 key={index}>{block.text}</h4>;
        }
        if (block.type === 'p') {
          return (
            <p key={index}>
              <Runs runs={block.runs} />
            </p>
          );
        }
        if (block.type === 'list') {
          return (
            <ul key={index}>
              {block.items.map((runs, itemIndex) => (
                <li key={itemIndex}>
                  <Runs runs={runs} />
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === 'table') {
          const [head, ...rest] = block.rows;
          return (
            <div className="paper-table-wrap" key={index}>
              <table className="paper-table">
                {head && (
                  <thead>
                    <tr>
                      {head.map((cell, cellIndex) => (
                        <th key={cellIndex}>{cell}</th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {rest.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
