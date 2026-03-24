'use client';

import { Pencil, Archive } from 'lucide-react';
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
import type { Transaction } from '../../domain/types';

interface TransactionsTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onArchive: (transaction: Transaction) => void;
}

const formatCLP = (amount: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-CL');
};

export function TransactionsTable({ transactions, onEdit, onArchive }: TransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="border-2 border-foreground p-12 text-center bg-card">
        <div className="w-16 h-16 border-2 border-foreground mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">$</span>
        </div>
        <h3 className="font-bold text-lg mb-2">Sin resultados</h3>
        <p className="text-muted-foreground">
          No se encontraron transacciones con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="border-2 border-foreground overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-foreground bg-muted hover:bg-muted">
            <TableHead className="font-bold">Fecha</TableHead>
            <TableHead className="font-bold">Descripción</TableHead>
            <TableHead className="font-bold">Monto</TableHead>
            <TableHead className="font-bold">Tipo</TableHead>
            <TableHead className="font-bold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} className="border-b border-border hover:bg-accent/50">
              <TableCell className="text-sm">{formatDate(transaction.date)}</TableCell>
              <TableCell className="font-medium">{transaction.description}</TableCell>
              <TableCell className="font-medium">{formatCLP(transaction.amount)}</TableCell>
              <TableCell>
                <Badge variant={transaction.type === 'INCOME' ? 'success' : 'destructive'}>
                  {transaction.type === 'INCOME' ? 'Ingreso' : 'Gasto'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(transaction)}
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onArchive(transaction)}
                    title="Archivar"
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
