import { notFound } from 'next/navigation';
import Blueprint from '../../../components/Blueprint';
import { getSystem, getSystemSlugs } from '../../../data/systems';

export function generateStaticParams() {
  return getSystemSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const system = getSystem(params.slug);

  if (system.slug !== params.slug) {
    return {};
  }

  return {
    title: system.longName,
    description: system.description
  };
}

export default function SystemPage({ params }) {
  const system = getSystem(params.slug);

  if (system.slug !== params.slug) {
    notFound();
  }

  return <Blueprint system={system} />;
}
