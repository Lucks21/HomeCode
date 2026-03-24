'use client';
import { useParams } from 'next/navigation';
import { InstallmentDetailView } from '@/modules/installments/presentation/views/InstallmentDetailView';

export default function InstallmentDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  return <InstallmentDetailView installmentId={id} />;
}
