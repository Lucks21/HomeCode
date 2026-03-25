interface CurrencyDisplayProps {
  amount: number;
  className?: string;
}

const formatter = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

export function CurrencyDisplay({ amount, className }: CurrencyDisplayProps) {
  return <span className={className}>{formatter.format(amount)}</span>;
}

export function formatCLP(amount: number): string {
  return formatter.format(amount);
}
