'use client';

/**
 * Vista de detalle de una cuenta
 *
 * Muestra la informacion completa de la cuenta
 * con su resumen financiero y subcuentas
 */

import { Button } from '@/shared/presentation/components/ui/Button';
import { AccountDetailCard } from '../components/AccountDetailCard';
import { useAccountDetail } from '../hooks/useAccountDetail';

interface AccountDetailViewProps {
  accountId: number;
}

export function AccountDetailView({ accountId }: AccountDetailViewProps) {
  const { accountDetail, isLoading, error } = useAccountDetail(accountId);

  const handleGoBack = () => {
    window.location.href = '/dashboard/accounts';
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Cargando detalle de cuenta...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={handleGoBack}>
          Volver a Cuentas
        </Button>
        <div className="p-4 border-2 border-destructive bg-destructive/10 text-destructive rounded-lg">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!accountDetail) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={handleGoBack}>
          Volver a Cuentas
        </Button>
        <div className="text-center py-12 text-muted-foreground">
          <p>No se encontro la cuenta</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handleGoBack}>
          Volver a Cuentas
        </Button>
      </div>

      <AccountDetailCard detail={accountDetail} />
    </div>
  );
}
