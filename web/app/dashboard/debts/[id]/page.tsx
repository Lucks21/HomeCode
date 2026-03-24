'use client';
import { useParams } from 'next/navigation';
import { DebtDetailView } from '@/modules/debts/presentation/views/DebtDetailView';

export default function DebtDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  return <DebtDetailView debtId={id} />;
}
