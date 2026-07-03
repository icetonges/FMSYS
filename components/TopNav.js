'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { systems } from '../data/systems';
import ThemeToggle from './ThemeToggle';

function classNames(...items) {
  return items.filter(Boolean).join(' ');
}

export default function TopNav({ activeSlug, showTabs = true }) {
  // header: brand + toggle stacked, paper link standalone, tabs optional
  const pathname = usePathname();
  const isAppendix = pathname ? pathname.startsWith('/appendix') : false;

  return (
    <nav className="system-tabs" aria-label="DoD financial management systems">
      <div className="top-header">
        <div className="brand-block">
          <Link href="/" className="suite-link">DoD FM Systems</Link>
          <ThemeToggle />
        </div>
        <Link
          className={classNames('paper-link', isAppendix && 'active')}
          href="/appendix"
          aria-current={isAppendix ? 'page' : undefined}
        >
          <span aria-hidden="true">📄</span>
          Research Paper Appendix
        </Link>
      </div>

      {showTabs && (
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
        </div>
      )}
    </nav>
  );
}
