import Link from 'next/link';
import {
  PRODUCTION_ORIGIN,
  buildBreadcrumbJsonLd,
  serializeJsonLd,
} from '@colonyhub/content';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: readonly BreadcrumbItem[];
  dark?: boolean;
};

export function Breadcrumbs({ items, dark }: BreadcrumbsProps) {
  const jsonLd = serializeJsonLd(
    buildBreadcrumbJsonLd(
      items.map((item) => ({
        name: item.label,
        ...(item.href
          ? {
              url:
                item.href === '/'
                  ? PRODUCTION_ORIGIN
                  : `${PRODUCTION_ORIGIN}${item.href}`,
            }
          : {}),
      })),
    ),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <nav
        className={dark ? 'breadcrumbs breadcrumbs--dark' : 'breadcrumbs'}
        aria-label="Breadcrumb"
      >
        <ol>
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={`${idx}-${item.label}`}>
                {isLast || !item.href ? (
                  <span aria-current="page">{item.label}</span>
                ) : (
                  <Link href={item.href}>{item.label}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
