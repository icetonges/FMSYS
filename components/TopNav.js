'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { systems } from '../data/systems';
import ThemeToggle from './ThemeToggle';

function classNames(...items) {
  return items.filter(Boolean).join(' ');
}

export default function TopNav({ activeSlug }) {
  const pathname = usePathname();
  const isAppendix = pathname ? pathname.startsWith('/appendix') : false;

  return (
    <nav className="system-tabs" aria-label="DoD financial management systems">
      <Link href="/" className="suite-link">DoD FM Systems</Link>
      <div className="system-tab-list">
        {systems.map((item) => (
          <Link
            key={item.slug}
            className={classNames('system-tab', item.slug === activeSlug && 'active')}
            href={`/systems/${item.slug}`}
            aria-current={item.slug === activeSlug ? 'page' : undefined}
          >
            <span>{item.shortName}</span>
            <small>{item.agency}</small>
          </Link>
        ))}
        <Link
          className={classNames('system-tab', 'appendix-tab', isAppendix && 'active')}
          href="/appendix"
          aria-current={isAppendix ? 'page' : undefined}
        >
          <span>Research Paper</span>
          <small>Appendix</small>
        </Link>
      </div>
      <ThemeToggle />
    </nav>
  );
}
