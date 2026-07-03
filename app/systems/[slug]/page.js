import { notFound } from 'next/navigation';
import Blueprint from '../../../components/Blueprint';
import { getSystem, getSystemSlugs } from '../../../data/systems';

export function generateStaticParams() {
  return getSystemSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const system = getSystem(slug);

  if (system.slug !== slug) {
    return {};
  }

  return {
    title: system.longName,
    description: system.description
  };
}

export default async function SystemPage({ params }) {
  const { slug } = await params;
  const system = getSystem(slug);

  if (system.slug !== slug) {
    notFound();
  }

  return <Blueprint system={system} />;
}
