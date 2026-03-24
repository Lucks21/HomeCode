'use client';

import { Archive, Eye, CreditCard } from 'lucide-react';
import { Button } from '@/shared/presentation/components/ui/Button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/shared/presentation/components/ui/Table';
import type { Installment } from '../../domain/types';

interface InstallmentsTableProps {
  installments: Installment[];
  onViewDetail: (installment: Installment) => void;
  onPay: (installment: Installment) => void;
  onArchive: (installment: Installment) => void;
}

const formatCLP = (amount: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);

export function InstallmentsTable({
  installments,
  onViewDetail,
  onPay,
  onArchive,
}: InstallmentsTableProps) {
  if (installments.length === 0) {
    return (
      <div className="border-2 border-foreground p-12 text-center bg-card">
        <div className="w-16 h-16 border-2 border-foreground mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">$</span>
        </div>
        <h3 className="font-bold text-lg mb-2">Sin resultados</h3>
        <p className="text-muted-foreground">
          No se encontraron cuotas registradas.
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
            <TableHead className="font-bold">Monto Total</TableHead>
            <TableHead className="font-bold">Cuotas</TableHead>
            <TableHead className="font-bold">Progreso</TableHead>
            <TableHead className="font-bold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {installments.map((inst) => {
            const paidCount = inst.paidCount ?? 0;
            const total = inst.totalInstallments;
            const percent = inst.progressPercentage ?? (total > 0 ? Math.round((paidCount / total) * 100) : 0);
            const isPaidOff = paidCount >= total;

            return (
              <TableRow key={inst.id} className="border-b border-border hover:bg-accent/50">
                <TableCell className="font-medium">{inst.description}</TableCell>
                <TableCell>{formatCLP(inst.totalAmount)}</TableCell>
                <TableCell>{formatCLP(inst.installmentValue)} x {total}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden border border-border">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {paidCount}/{total} - {percent}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetail(inst)}
                      title="Ver detalle"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {!isPaidOff && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPay(inst)}
                        title="Pagar cuotas"
                      >
                        <CreditCard className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onArchive(inst)}
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
