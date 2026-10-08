import { sapPage } from './sap';
import { oraclePage } from './oracle';
import { ddrsPage } from './ddrs';
import { integrationPage } from './integration';
import { otherPage } from './other';
import { sapArchitecturePage } from './sapx/architecture';
import { sapModulesPage } from './sapx/modules';
import { sapFederalPage } from './sapx/federal';
import { sapTablesPage, sapTcodesPage, sapFieldsPage } from './sapx/catalogs';
import { sapInterfacesPage } from './sapx/interfaces';
import { sapDodSystemsPage } from './sapx/dodSystems';

export const sapSeries = [
  sapArchitecturePage,
  sapModulesPage,
  sapFederalPage,
  sapTablesPage,
  sapTcodesPage,
  sapFieldsPage,
  sapInterfacesPage,
  sapDodSystemsPage
];

export const corePages = [integrationPage, sapPage, oraclePage, ddrsPage, otherPage];

export const knowledgePages = [integrationPage, sapPage, ...sapSeries, oraclePage, ddrsPage, otherPage];

export const knowledgeMeta = {
  title: 'Platform Knowledge Base',
  subtitle: 'Architecture, data models, and table-level reference for the SAP, Oracle, DDRS, legacy, and Treasury platforms behind the DoD financial management systems in this suite.',
  compiled: 'Compiled October 2026 from public vendor, DoD, DoD IG, GAO, DOT&E, and Treasury sources',
  disclaimer: 'Educational reference. Standard product tables and public sources only. Not an official DoD, DFAS, SAP, or Oracle publication.'
};

export function getKnowledgePage(slug) {
  return knowledgePages.find((page) => page.slug === slug) || null;
}

export function getKnowledgeNav(slug) {
  const index = knowledgePages.findIndex((page) => page.slug === slug);
  return {
    prev: index > 0 ? knowledgePages[index - 1] : null,
    next: index >= 0 && index < knowledgePages.length - 1 ? knowledgePages[index + 1] : null
  };
}

export function countBlocks(page, type) {
  return page.blocks.filter((block) => block.type === type || (type === 'table' && block.type === 'catalog')).length;
}
