'use client';

import { Archive, Eye, DollarSign } from 'lucide-react';
import { Badge } from '@/shared/presentation/components/ui/Badge';
import { Button } from '@/shared/presentation/components/ui/Button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/shared/presentation/components/ui/Table';
import type { Debt } from '../../domain/types';

interface DebtsTableProps {
  debts: Debt[];
  onViewDetail: (debt: Debt) => void;
  onRegisterPayment: (debt: Debt) => void;
  onArchive: (debt: Debt) => void;
}

const formatCLP = (amount: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);

const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'destructive' | 'outline' | 'secondary' }> = {
  PENDING: { label: 'Pendiente', variant: 'outline' },
  PARTIAL: { label: 'Parcial', variant: 'secondary' },
  PAID: { label: 'Pagada', variant: 'success' },
};

export function DebtsTable({ debts, onViewDetail, onRegisterPayment, onArchive }: DebtsTableProps) {
  if (debts.length === 0) {
    return (
      <div className="border-2 border-foreground p-12 text-center bg-card">
        <div className="w-16 h-16 border-2 border-foreground mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">$</span>
        </div>
        <h3 className="font-bold text-lg mb-2">Sin resultados</h3>
        <p className="text-muted-foreground">
          No se encontraron deudas con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="border-2 border-foreground overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-foreground bg-muted hover:bg-muted">
            <TableHead className="font-bold">Descripción</TableHead>
            <TableHead className="font-bold">Monto</TableHead>
            <TableHead className="font-bold">Pendiente</TableHead>
            <TableHead className="font-bold">Estado</TableHead>
            <TableHead className="font-bold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {debts.map((debt) => {
            const config = statusConfig[debt.status] ?? statusConfig.PENDING;
            return (
              <TableRow key={debt.id} className="border-b border-border hover:bg-accent/50">
                <TableCell className="font-medium">{debt.description}</TableCell>
                <TableCell>{formatCLP(debt.amount)}</TableCell>
                <TableCell>{formatCLP(debt.remainingAmount)}</TableCell>
                <TableCell>
                  <Badge variant={config.variant}>{config.label}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetail(debt)}
                      title="Ver detalle"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {debt.status !== 'PAID' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRegisterPayment(debt)}
                        title="Registrar pago"
                      >
                        <DollarSign className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onArchive(debt)}
                      title="Archivar"
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
