// Data-driven SVG diagram renderer used by the knowledge base.
// Nodes sit on a column/row grid; text wraps by estimated character width.

const FONT = { title: 12.5, line: 11, mono: 10.6 };

function wrap(text, maxChars) {
  const words = String(text).split(' ');
  const lines = [];
  let current = '';
  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });
  if (current) lines.push(current);
  return lines;
}

function layout(spec) {
  const colWidth = spec.colWidth || 210;
  // Widen the column gap when a same-row edge label would not fit between two boxes.
  const rowOf = new Map(spec.nodes.map((node) => [node.id, node.row]));
  const widestLabel = Math.max(0, ...(spec.edges || [])
    .filter((edge) => edge.label && rowOf.get(edge.from) === rowOf.get(edge.to))
    .map((edge) => edge.label.length * 5.9 + 10));
  const colGap = Math.max(spec.colGap ?? 56, widestLabel ? widestLabel + 26 : 0);
  const rowGap = spec.rowGap ?? 52;
  const pad = 18;
  const bandHead = spec.rowLabels ? 22 : 0;
  const colHead = spec.colLabels ? 26 : 0;
  const cols = spec.cols;

  const nodes = spec.nodes.map((node) => {
    const span = node.span || 1;
    const w = span * colWidth + (span - 1) * colGap;
    const entity = node.kind === 'entity';
    const titleLines = wrap(node.title, Math.floor((w - 20) / (entity ? 6.9 : 7.1)));
    const perLine = Math.floor((w - 20) / (entity ? 6.5 : 5.9));
    const body = [];
    (node.lines || []).forEach((line) => {
      if (entity) {
        body.push({ text: line.replace(/^\*/, ''), key: line.startsWith('*') });
      } else {
        wrap(line, perLine).forEach((text) => body.push({ text }));
      }
    });
    const headH = 12 + titleLines.length * 16;
    const h = headH + (body.length ? 6 + body.length * 15 : 0) + 10;
    return { ...node, span, w, h, headH, titleLines, body, entity };
  });

  const rowCount = Math.max(...nodes.map((n) => n.row)) + 1;
  const rowHeights = Array.from({ length: rowCount }, (_, r) => Math.max(0, ...nodes.filter((n) => n.row === r).map((n) => n.h)));
  const rowTops = [];
  let y = pad + colHead;
  rowHeights.forEach((height, r) => {
    rowTops[r] = y + bandHead;
    y += bandHead + height + rowGap;
  });
  const height = y - rowGap + pad;
  const width = pad * 2 + cols * colWidth + (cols - 1) * colGap;

  nodes.forEach((node) => {
    node.x = pad + node.col * (colWidth + colGap);
    node.y = rowTops[node.row] + (node.valign === 'middle' ? (rowHeights[node.row] - node.h) / 2 : 0);
  });

  return { nodes, width, height, rowTops, rowHeights, pad, bandHead, colHead, colWidth, colGap, rowGap };
}

function edgePath(edge, a, b, rowGap) {
  const sx = edge.sx || 0;
  const tx = edge.tx || 0;
  if (a.row === b.row) {
    const leftToRight = a.x < b.x;
    const y1 = a.y + Math.min(a.h, b.h) / 2 + (edge.sy || 0);
    const x1 = leftToRight ? a.x + a.w : a.x;
    const x2 = leftToRight ? b.x : b.x + b.w;
    return { points: [[x1, y1], [x2, y1]], label: [(x1 + x2) / 2, y1] };
  }
  const down = b.row > a.row;
  const x1 = a.x + a.w / 2 + sx;
  const x2 = b.x + b.w / 2 + tx;
  const y1 = down ? a.y + a.h : a.y;
  const y2 = down ? b.y : b.y + b.h;
  if (Math.abs(x1 - x2) < 2) {
    return { points: [[x1, y1], [x2, y2]], label: [x1, (y1 + y2) / 2 + (edge.ly || 0)] };
  }
  const midY = down ? y2 - rowGap / 2 + (edge.my || 0) : y2 + rowGap / 2 + (edge.my || 0);
  return { points: [[x1, y1], [x1, midY], [x2, midY], [x2, y2]], label: [(x1 + x2) / 2, midY] };
}

export default function Diagram({ spec, label }) {
  const L = layout(spec);
  const lookup = new Map(L.nodes.map((node) => [node.id, node]));
  const markerId = `arrow-${spec.id}`;

  return (
    <div className="dg-wrap">
      <svg
        className="dg"
        viewBox={`0 0 ${L.width} ${L.height}`}
        style={{ minWidth: Math.min(L.width, 760) }}
        role="img"
        aria-label={label}
      >
        <defs>
          <marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="dg-arrowhead" />
          </marker>
        </defs>

        {spec.rowLabels?.map((text, r) => (
          text ? (
            <g key={`band-${r}`}>
              <rect
                className="dg-band"
                x={4}
                y={L.rowTops[r] - L.bandHead - 4}
                width={L.width - 8}
                height={L.rowHeights[r] + L.bandHead + 14}
                rx={12}
              />
            </g>
          ) : null
        ))}

        {spec.colLabels?.map((text, c) => (
          <text key={`col-${c}`} className="dg-col-label" x={L.pad + c * (L.colWidth + L.colGap) + L.colWidth / 2} y={L.pad + 12} textAnchor="middle">{text}</text>
        ))}

        {spec.edges?.map((edge, index) => {
          const a = lookup.get(edge.from);
          const b = lookup.get(edge.to);
          if (!a || !b) return null;
          const { points, label: at } = edgePath(edge, a, b, L.rowGap);
          const d = points.map((point, i) => `${i === 0 ? 'M' : 'L'}${point[0]} ${point[1]}`).join(' ');
          const textWidth = edge.label ? edge.label.length * 5.9 + 10 : 0;
          return (
            <g key={`edge-${index}`}>
              <path
                d={d}
                className={`dg-edge${edge.dashed ? ' dashed' : ''}`}
                markerEnd={`url(#${markerId})`}
                markerStart={edge.both ? `url(#${markerId})` : undefined}
              />
              {edge.label && (
                <g>
                  <rect className="dg-edge-label-bg" x={at[0] - textWidth / 2} y={at[1] - 9} width={textWidth} height={17} rx={5} />
                  <text className="dg-edge-label" x={at[0]} y={at[1] + 3.5} textAnchor="middle">{edge.label}</text>
                </g>
              )}
            </g>
          );
        })}

        {spec.rowLabels?.map((text, r) => (
          text ? (
            <g key={`band-label-${r}`}>
              <rect className="dg-band-label-bg" x={10} y={L.rowTops[r] - 21} width={text.length * 7.4 + 14} height={17} rx={5} />
              <text className="dg-band-label" x={16} y={L.rowTops[r] - 9}>{text}</text>
            </g>
          ) : null
        ))}

        {L.nodes.map((node) => (
          <g key={node.id} className={`dg-node tone-${node.tone || 'process'}${node.entity ? ' entity' : ''}`}>
            <rect className="dg-box" x={node.x} y={node.y} width={node.w} height={node.h} rx={node.entity ? 6 : 10} />
            {node.entity && <rect className="dg-entity-head" x={node.x} y={node.y} width={node.w} height={node.headH} rx={6} />}
            {node.titleLines.map((text, i) => (
              <text key={i} className="dg-title" x={node.entity ? node.x + 10 : node.x + node.w / 2} y={node.y + 20 + i * 16} textAnchor={node.entity ? 'start' : 'middle'} fontSize={node.entity ? 11.5 : FONT.title}>{text}</text>
            ))}
            {node.body.map((line, i) => (
              <text
                key={i}
                className={`dg-line${line.key ? ' key' : ''}${node.entity ? ' mono' : ''}`}
                x={node.entity ? node.x + 10 : node.x + node.w / 2}
                y={node.y + node.headH + 17 + i * 15}
                textAnchor={node.entity ? 'start' : 'middle'}
                fontSize={node.entity ? FONT.mono : FONT.line}
              >
                {line.text}
              </text>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
