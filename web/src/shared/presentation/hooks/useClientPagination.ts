import { useState, useMemo, useCallback } from 'react';

interface UsePaginationOptions {
  itemsPerPage?: number;
}

interface UsePaginationResult<T> {
  paginatedItems: T[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export function useClientPagination<T>(
  items: T[],
  options: UsePaginationOptions = {},
): UsePaginationResult<T> {
  const { itemsPerPage = 10 } = options;
  const [currentPage, setCurrentPageState] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / itemsPerPage)),
    [items.length, itemsPerPage],
  );

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  const setCurrentPage = useCallback(
    (page: number) => {
      setCurrentPageState(Math.min(Math.max(1, page), totalPages));
    },
    [totalPages],
  );

  return { paginatedItems, currentPage, totalPages, setCurrentPage };
}
