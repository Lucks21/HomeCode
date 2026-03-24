export function calculateSkip(page: number, perPage: number): number {
  const safePage = Math.max(1, page);
  return (safePage - 1) * perPage;
}
