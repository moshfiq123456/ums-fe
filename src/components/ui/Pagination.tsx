import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '...')[] = [1];

  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('...');

  pages.push(total);
  return pages;
}

export default function Pagination({ page, totalPages, onPageChange, disabled }: PaginationProps) {
  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="flex items-center gap-1">
      {/* Previous */}
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1 || disabled}
        className="flex items-center justify-center w-8 h-8 rounded-md border border-border text-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-sm text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            disabled={disabled}
            className={`w-8 h-8 rounded-md text-sm font-medium transition-colors disabled:cursor-not-allowed ${
              p === page
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-foreground hover:bg-accent'
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages || disabled}
        className="flex items-center justify-center w-8 h-8 rounded-md border border-border text-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
