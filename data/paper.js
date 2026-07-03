import raw from './paper.json';

export const paperSections = raw;

export function getPaperSection(slug) {
  return paperSections.find((s) => s.slug === slug) || null;
}

export function getPaperNav(slug) {
  const idx = paperSections.findIndex((s) => s.slug === slug);
  if (idx === -1) return { prev: null, next: null, index: -1 };
  return {
    prev: idx > 0 ? paperSections[idx - 1] : null,
    next: idx < paperSections.length - 1 ? paperSections[idx + 1] : null,
    index: idx,
  };
}

export const paperMeta = {
  title: 'DoD Financial Accounting & ERP Systems Reference',
  subtitle:
    'A comprehensive technical and organizational reference covering GFEBS, Navy ERP, DEAMS, DAI, STARS-FL/HCM, DLA EBS, GCSS-Army, GCSS-MC, LMP, SABRS, SOMARDS, and STANFIN.',
  prepared: 'Prepared for: Peter Shang, GS-15 Portfolio Manager',
  compiled: 'Research compiled July 2026 — unclassified, open-source sources only',
  disclaimer: 'FOR OFFICIAL REFERENCE USE — NOT AN OFFICIAL DoD/DFAS PUBLICATION',
};
