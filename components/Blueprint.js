'use client';

import { useMemo, useState } from 'react';
import { layers, layerOrder, lineageScenarios, nodes, supportServices } from '../data/architecture';

const initialNode = 'dts';

function classNames(...items) {
  return items.filter(Boolean).join(' ');
}

function uniqueTags(items) {
  const tags = new Set();
  items.forEach((item) => item.tags?.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort((a, b) => a.localeCompare(b));
}

function BlueprintCard({ node, active, selected, dimmed, onSelect }) {
  return (
    <button
      className={classNames('node-card', `layer-${node.layer}`, active && 'active-path', selected && 'selected', dimmed && 'dimmed')}
      onClick={() => onSelect(node.id)}
      aria-pressed={selected}
    >
      <span className="node-icon" aria-hidden="true">{node.icon}</span>
      <span className="node-content">
        <span className="node-title">{node.title}</span>
        <span className="node-subtitle">{node.subtitle}</span>
        <span className="node-summary">{node.summary}</span>
      </span>
    </button>
  );
}

function DetailPanel({ node, relatedScenario, onSelectScenario }) {
  if (!node) return null;

  return (
    <aside className="detail-panel" aria-label="Selected architecture item details">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Selected layer</p>
          <h2>{node.icon} {node.title}</h2>
          <p>{node.subtitle}</p>
        </div>
      </div>

      <section>
        <h3>What it does</h3>
        <p>{node.summary}</p>
      </section>

      <section>
        <h3>Example transactions / objects</h3>
        <ul className="compact-list">
          {node.examples?.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section>
        <h3>Key fields for UoT traceability</h3>
        <div className="pill-row">
          {node.keyFields?.map((item) => <span className="pill" key={item}>{item}</span>)}
        </div>
      </section>

      {(node.tcodes || node.sapTables) && (
        <section className="two-col-mini">
          {node.tcodes && (
            <div>
              <h3>T-code examples</h3>
              <div className="pill-row">
                {node.tcodes.map((item) => <span className="pill code-pill" key={item}>{item}</span>)}
              </div>
            </div>
          )}
          {node.sapTables && (
            <div>
              <h3>Representative SAP tables</h3>
              <div className="pill-row">
                {node.sapTables.map((item) => <span className="pill table-pill" key={item}>{item}</span>)}
              </div>
            </div>
          )}
        </section>
      )}

      <section>
        <h3>Audit questions</h3>
        <ul className="check-list">
          {node.auditQuestions?.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section>
        <h3>Common risk signals</h3>
        <ul className="risk-list">
          {node.risks?.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      {relatedScenario && (
        <section className="related-scenario">
          <h3>Related lineage</h3>
          <button onClick={() => onSelectScenario(relatedScenario.id)}>
            Open {relatedScenario.short} path →
          </button>
        </section>
      )}
    </aside>
  );
}

function ScenarioPanel({ scenario, nodeLookup, onNodeSelect }) {
  return (
    <section className="scenario-panel">
      <div className="section-heading scenario-heading">
        <div>
          <p className="eyebrow">Scenario lineage explorer</p>
          <h2>{scenario.title}</h2>
          <p>{scenario.description}</p>
        </div>
      </div>

      <div className="lineage-flow" aria-label={`${scenario.title} lineage path`}>
        {scenario.path.map((nodeId, index) => {
          const node = nodeLookup.get(nodeId);
          return (
            <div className="lineage-step" key={nodeId}>
              <button onClick={() => onNodeSelect(nodeId)}>
                <span>{node?.icon}</span>
                <strong>{node?.title}</strong>
                <small>{node?.subtitle}</small>
              </button>
              {index < scenario.path.length - 1 && <span className="flow-arrow">→</span>}
            </div>
          );
        })}
      </div>

      <div className="scenario-grid">
        <div className="scenario-card">
          <h3>Business flow</h3>
          <ol>
            {scenario.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </div>
        <div className="scenario-card">
          <h3>AI / audit exception tests</h3>
          <ul className="risk-list">
            {scenario.exceptionTests.map((test) => <li key={test}>{test}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function Blueprint() {
  const [selectedNodeId, setSelectedNodeId] = useState(initialNode);
  const [selectedScenarioId, setSelectedScenarioId] = useState('dts-travel');
  const [activeLayer, setActiveLayer] = useState('all');
  const [query, setQuery] = useState('');
  const [showRisks, setShowRisks] = useState(true);
  const [showReference, setShowReference] = useState(false);

  const nodeLookup = useMemo(() => new Map(nodes.map((node) => [node.id, node])), []);
  const selectedNode = nodeLookup.get(selectedNodeId) || nodeLookup.get(initialNode);
  const selectedScenario = lineageScenarios.find((scenario) => scenario.id === selectedScenarioId) || lineageScenarios[0];
  const activePath = new Set(selectedScenario.path);
  const tags = useMemo(() => uniqueTags(nodes), []);

  const filteredNodes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return nodes.filter((node) => {
      const layerMatch = activeLayer === 'all' || node.layer === activeLayer;
      if (!layerMatch) return false;
      if (!q) return true;
      const haystack = [node.title, node.subtitle, node.summary, ...(node.tags || []), ...(node.examples || []), ...(node.keyFields || []), ...(node.tcodes || []), ...(node.sapTables || [])]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [activeLayer, query]);

  const nodesByLayer = useMemo(() => {
    const map = new Map(layerOrder.map((layer) => [layer, []]));
    filteredNodes.forEach((node) => map.get(node.layer)?.push(node));
    return map;
  }, [filteredNodes]);

  const relatedScenario = lineageScenarios.find((scenario) => scenario.path.includes(selectedNodeId));

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Interactive DoD FM architecture</p>
          <h1>GFEBS / SAP-Based Financial Management Architecture Blueprint</h1>
          <p>
            Explore how feeder systems, GFEBS business process areas, detailed transaction objects, USSGL accounting, reporting layers, and DoD financial statements connect for audit readiness and Universe of Transactions traceability.
          </p>
          <div className="hero-actions">
            <a href="#blueprint" className="primary-action">Explore blueprint</a>
            <a href="#lineage" className="secondary-action">Open lineage explorer</a>
          </div>
        </div>
        <div className="hero-card">
          <span className="hero-metric">6</span>
          <p>Core GFEBS business process areas</p>
          <span className="hero-metric small">Feeder → Detail → GL → Statement</span>
        </div>
      </section>

      <section className="controls" aria-label="Blueprint controls">
        <div className="control-block search-block">
          <label htmlFor="search">Search architecture</label>
          <input
            id="search"
            type="search"
            placeholder="Try DTS, FMZ, SBR, WAWF, AP, asset, GTAS..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="control-block scenario-select">
          <label htmlFor="scenario">Lineage scenario</label>
          <select id="scenario" value={selectedScenarioId} onChange={(event) => setSelectedScenarioId(event.target.value)}>
            {lineageScenarios.map((scenario) => (
              <option value={scenario.id} key={scenario.id}>{scenario.short}</option>
            ))}
          </select>
        </div>
        <div className="control-toggles">
          <button className={classNames(showRisks && 'pressed')} onClick={() => setShowRisks((value) => !value)}>
            {showRisks ? 'Hide audit lens' : 'Show audit lens'}
          </button>
          <button className={classNames(showReference && 'pressed')} onClick={() => setShowReference((value) => !value)}>
            {showReference ? 'Hide static reference' : 'Show static reference'}
          </button>
        </div>
      </section>

      <section className="filter-strip" aria-label="Layer filters">
        <button className={classNames(activeLayer === 'all' && 'active')} onClick={() => setActiveLayer('all')}>All layers</button>
        {layers.map((layer) => (
          <button key={layer.id} className={classNames(activeLayer === layer.id && 'active')} onClick={() => setActiveLayer(layer.id)}>
            {layer.short}
          </button>
        ))}
      </section>

      <section className="tag-strip" aria-label="Common search terms">
        {tags.slice(0, 18).map((tag) => (
          <button key={tag} onClick={() => setQuery(tag)}>{tag}</button>
        ))}
      </section>

      {showReference && (
        <section className="reference-image" aria-label="Static blueprint reference image">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Static reference</p>
              <h2>Original corrected blueprint image</h2>
              <p>Use this as a visual comparison while exploring the interactive version below.</p>
            </div>
          </div>
          <img src="/gfebs-blueprint-reference.png" alt="Static GFEBS architecture blueprint reference" />
        </section>
      )}

      <section id="blueprint" className="layout-grid">
        <div className="blueprint-canvas">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Clickable architecture map</p>
              <h2>End-to-end flow: business event to financial statement</h2>
              <p>Cards in the selected scenario path are highlighted. Click any card to inspect fields, T-codes, audit questions, and risks.</p>
            </div>
          </div>

          <div className="layers-grid">
            {layers.map((layer) => {
              const layerNodes = nodesByLayer.get(layer.id) || [];
              if (activeLayer !== 'all' && activeLayer !== layer.id && layerNodes.length === 0) return null;
              return (
                <section className="layer-column" key={layer.id}>
                  <div className="layer-heading">
                    <span>{layer.short}</span>
                    <h3>{layer.label}</h3>
                    <p>{layer.description}</p>
                  </div>
                  <div className="node-list">
                    {layerNodes.map((node) => (
                      <BlueprintCard
                        key={node.id}
                        node={node}
                        active={activePath.has(node.id)}
                        selected={selectedNodeId === node.id}
                        dimmed={query && !activePath.has(node.id)}
                        onSelect={setSelectedNodeId}
                      />
                    ))}
                    {layerNodes.length === 0 && <p className="empty-layer">No matching items.</p>}
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        <DetailPanel node={selectedNode} relatedScenario={relatedScenario} onSelectScenario={setSelectedScenarioId} />
      </section>

      <section id="lineage">
        <ScenarioPanel scenario={selectedScenario} nodeLookup={nodeLookup} onNodeSelect={setSelectedNodeId} />
      </section>

      {showRisks && (
        <section className="audit-lens">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Audit lens</p>
              <h2>Where the AI UoT analyzer should watch</h2>
              <p>These are the places where completeness, accuracy, timeliness, and traceability commonly break.</p>
            </div>
          </div>
          <div className="audit-grid">
            <article>
              <h3>Completeness</h3>
              <p>Source events missing from GFEBS, subledger items not posted to GL, or financial statement balances without supporting populations.</p>
            </article>
            <article>
              <h3>Traceability</h3>
              <p>Broken reference keys across feeder, IDoc/GEX, subledger object, GL document, trial balance, and statement line item.</p>
            </article>
            <article>
              <h3>Timing</h3>
              <p>Authorization, receipt, invoice, voucher, payment, and GL posting dates crossing accounting periods without appropriate accrual or adjustment.</p>
            </article>
            <article>
              <h3>Supportability</h3>
              <p>Transactions posted to GL without valid approval, contract, receipt, invoice, voucher, asset record, or other audit evidence.</p>
            </article>
          </div>
        </section>
      )}

      <section className="support-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Enterprise infrastructure</p>
            <h2>Support services that make the blueprint work</h2>
          </div>
        </div>
        <div className="support-grid">
          {supportServices.map((service) => (
            <article key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <p>
          Design note: this is an educational architecture model. Exact GFEBS tables, T-codes, custom reports, interface names, and release-specific functionality vary by Army configuration, role, and modernization state.
        </p>
      </footer>
    </main>
  );
}
