'use client';
import { useParams } from 'next/navigation';
import { AccountDetailView } from '@/modules/accounts/presentation/views/AccountDetailView';

export default function AccountDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  return <AccountDetailView accountId={id} />;
}
