'use client';

import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
} from 'ag-grid-community';
import { useGetUsersQuery } from '@/lib/api';
import Pagination from '@/components/ui/Pagination';
import type { User } from '@/lib/api';
import type { RootState } from '@/store/store';

ModuleRegistry.registerModules([AllCommunityModule]);

// AG Grid theme wired to our CSS custom properties so it
// automatically adapts when the user switches themes or dark mode.
const gridTheme = themeQuartz.withParams({
  accentColor: 'var(--primary)',
  backgroundColor: 'var(--card)',
  foregroundColor: 'var(--foreground)',
  headerBackgroundColor: 'var(--muted)',
  headerTextColor: 'var(--muted-foreground)',
  headerFontSize: 11,
  borderColor: 'var(--border)',
  rowHoverColor: 'var(--accent)',
  selectedRowBackgroundColor: 'var(--accent)',
  oddRowBackgroundColor: 'transparent',
  fontFamily: 'inherit',
  fontSize: 13,
  wrapperBorder: false,
  rowBorder: true,
  columnBorder: false,
  headerColumnBorder: false,
  cellHorizontalPaddingScale: 1.2,
});

const PAGE_SIZE = 10;

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const { data, isLoading, isError, error, isFetching } = useGetUsersQuery(
    { page, size: PAGE_SIZE },
    { skip: !accessToken }
  );

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  const columnDefs = useMemo<ColDef<User>[]>(
    () => [
      { field: 'name', headerName: 'Name', flex: 1, minWidth: 140 },
      { field: 'email', headerName: 'Email', flex: 2, minWidth: 200 },
      {
        field: 'role',
        headerName: 'Role',
        flex: 1,
        minWidth: 120,
        valueFormatter: ({ value }) => value ?? '—',
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        minWidth: 120,
        cellRenderer: ({ value }: { value?: string }) =>
          value ? (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                value === 'active'
                  ? 'bg-emerald-500/10 text-emerald-600'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {value}
            </span>
          ) : (
            '—'
          ),
      },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  // ── Loading ──────────────────────────────────────────────

  if (isLoading || !accessToken) {
    return (
      <div className="flex items-center justify-center flex-1 min-h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────

  if (isError) {
    return (
      <div className="flex items-center justify-center flex-1 min-h-64">
        <div className="text-center">
          <p className="text-sm font-medium text-destructive">Failed to load users</p>
          <p className="text-xs text-muted-foreground mt-1">
            {(error as any)?.data?.message ?? 'An unexpected error occurred'}
          </p>
        </div>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Users</h1>
          {data && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {data.total} total user{data.total !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* AG Grid */}
      <div
        className={`flex-1 rounded-lg overflow-hidden border border-border transition-opacity ${
          isFetching ? 'opacity-60' : 'opacity-100'
        }`}
      >
        <AgGridReact
          theme={gridTheme}
          rowData={data?.data ?? []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowHeight={48}
          headerHeight={44}
          suppressMovableColumns
          suppressCellFocus
          overlayNoRowsTemplate="<span class='text-sm text-muted-foreground'>No users found</span>"
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm shrink-0">
          <p className="text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            disabled={isFetching}
          />
        </div>
      )}
    </div>
  );
}
