import { ChevronLeftIcon, ChevronRightIcon } from './Icons.jsx';

function getPageItems(page, total) {
  const wanted = [...new Set([1, page - 1, page, page + 1, total])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const items = [];
  wanted.forEach((p, i) => {
    if (i > 0 && p - wanted[i - 1] > 1) items.push(`gap-${p}`);
    items.push(p);
  });
  return items;
}

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Guard against invalid pages no matter how this is triggered.
  const go = (target) => {
    if (target < 1 || target > totalPages || target === page) return;
    onPageChange(target);
  };

  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" className="btn btn--ghost" onClick={() => go(page - 1)} disabled={page <= 1}>
        <ChevronLeftIcon width={18} height={18} />
        Previous
      </button>

      <ul className="pagination__pages">
        {getPageItems(page, totalPages).map((item) =>
          typeof item === 'string' ? (
            <li key={item} className="pagination__gap" aria-hidden="true">…</li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={`pagination__page ${item === page ? 'is-active' : ''}`}
                onClick={() => go(item)}
                aria-current={item === page ? 'page' : undefined}
                aria-label={`Page ${item}`}
              >
                {item}
              </button>
            </li>
          )
        )}
      </ul>

      <p className="pagination__status">
        Page {page} of {totalPages}
      </p>

      <button type="button" className="btn btn--ghost" onClick={() => go(page + 1)} disabled={page >= totalPages}>
        Next
        <ChevronRightIcon width={18} height={18} />
      </button>
    </nav>
  );
}
