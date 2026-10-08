// Small authoring helpers so the knowledge pages read as content, not markup.
export const h2 = (text) => ({ type: 'h2', text });
export const h3 = (text) => ({ type: 'h3', text });
export const p = (text) => ({ type: 'p', text });
export const list = (...items) => ({ type: 'list', items });
export const steps = (...items) => ({ type: 'steps', items });
export const callout = (title, text, tone) => ({ type: 'callout', title, text, tone });
export const table = (caption, head, rows, note) => ({ type: 'table', caption, head, rows, note });
export const figure = (caption, spec, note) => ({ type: 'figure', caption, spec, note });
export const catalog = (caption, columns, rows, note, facetLabel = 'Area') => ({ type: 'catalog', caption, columns, rows, note, facetLabel });
