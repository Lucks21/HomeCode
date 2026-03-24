'use client';

import { useEffect, useMemo } from 'react';
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
  FormDescription,
} from '@/shared/presentation/components/ui/Form';
import { Input } from '@/shared/presentation/components/ui/Input';
import { Button } from '@/shared/presentation/components/ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/presentation/components/ui/Select';

import type { Account } from '@/modules/accounts/domain/types';
import {
  installmentSchema,
  type InstallmentFormData,
} from '../../application/validations/installment.schema';

interface InstallmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InstallmentFormData) => Promise<void>;
  accounts: Account[];
  isLoading?: boolean;
}

const formatCLP = (amount: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);

export function InstallmentFormModal({
  isOpen,
  onClose,
  onSubmit,
  accounts,
  isLoading = false,
}: InstallmentFormModalProps) {
  const form = useForm<InstallmentFormData>({
    resolver: zodResolver(installmentSchema),
    defaultValues: {
      accountId: undefined,
      description: '',
      totalAmount: 0,
      totalInstallments: 1,
      installmentValue: undefined,
      startDate: '',
    },
  });

  const totalAmount = form.watch('totalAmount');
  const totalInstallments = form.watch('totalInstallments');

  const calculatedValue = useMemo(() => {
    if (totalAmount > 0 && totalInstallments > 0) {
      return Math.ceil(totalAmount / totalInstallments);
    }
    return 0;
  }, [totalAmount, totalInstallments]);

  useEffect(() => {
    if (isOpen) {
      form.reset({
        accountId: undefined,
        description: '',
        totalAmount: 0,
        totalInstallments: 1,
        installmentValue: undefined,
        startDate: new Date().toISOString().substring(0, 10),
      });
    }
  }, [isOpen, form]);

  const handleSubmit = async (data: InstallmentFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg border-2 border-foreground p-0 gap-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 border-b-2 border-foreground sticky top-0 bg-background z-10">
          <DialogTitle className="text-xl font-bold">Nuevo Plan de Cuotas</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-6">
            {/* Cuenta */}
            <FormField
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Cuenta *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una cuenta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id.toString()}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage>{form.formState.errors.accountId?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Descripción */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Descripción *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Compra en 12 cuotas" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.description?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Monto Total */}
            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Monto Total *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage>{form.formState.errors.totalAmount?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Número de Cuotas */}
            <FormField
              control={form.control}
              name="totalInstallments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Número de Cuotas *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1"
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage>{form.formState.errors.totalInstallments?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Valor de Cuota (optional) */}
            <FormField
              control={form.control}
              name="installmentValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Valor de Cuota (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Auto-calculado"
                      min={1}
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val ? Number(val) : undefined);
                      }}
                    />
                  </FormControl>
                  {calculatedValue > 0 && !field.value && (
                    <FormDescription>
                      Valor calculado: {formatCLP(calculatedValue)} por cuota
                    </FormDescription>
                  )}
                  <FormMessage>{form.formState.errors.installmentValue?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Fecha de Inicio */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Fecha de Inicio *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.startDate?.message}</FormMessage>
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
                    Guardando...
                  </>
                ) : (
                  'Crear Plan de Cuotas'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
