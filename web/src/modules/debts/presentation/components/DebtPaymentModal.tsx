'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/presentation/components/ui/Dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/presentation/components/ui/Form';
import { Input } from '@/shared/presentation/components/ui/Input';
import { Button } from '@/shared/presentation/components/ui/Button';

import type { Debt } from '../../domain/types';
import {
  debtPaymentSchema,
  type DebtPaymentFormData,
} from '../../application/validations/debtPayment.schema';

interface DebtPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DebtPaymentFormData) => Promise<void>;
  debt: Debt | null;
  isLoading?: boolean;
}

const formatCLP = (amount: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);

export function DebtPaymentModal({
  isOpen,
  onClose,
  onSubmit,
  debt,
  isLoading = false,
}: DebtPaymentModalProps) {
  const form = useForm<DebtPaymentFormData>({
    resolver: zodResolver(debtPaymentSchema),
    defaultValues: {
      amount: 0,
      date: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        amount: 0,
        date: new Date().toISOString().substring(0, 10),
      });
    }
  }, [isOpen, form]);

  const handleSubmit = async (data: DebtPaymentFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-2 border-foreground p-0 gap-0">
        <DialogHeader className="p-6 border-b-2 border-foreground">
          <DialogTitle className="text-xl font-bold">Registrar Pago</DialogTitle>
        </DialogHeader>

        <div className="px-6 pt-4">
          {debt && (
            <div style={{ padding: 12, background: '#0b0f19', borderRadius: 8, marginBottom: 16, border: '1px solid #1e293b' }}>
              <p style={{ fontSize: 14, color: '#94a3b8', margin: 0 }}>Deuda: {debt.description}</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', margin: 0, marginTop: 4 }}>
                Pendiente: {formatCLP(debt.remainingAmount)}
              </p>
            </div>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="px-6 pb-6 space-y-6">
            {/* Monto */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Monto del pago *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      min={1}
                      max={debt?.remainingAmount ?? undefined}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage>{form.formState.errors.amount?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Fecha */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Fecha del pago *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.date?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Botones */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 16, borderTop: '1px solid #1e293b' }}>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  'Registrar Pago'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
