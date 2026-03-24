'use client';

/**
 * Modal para crear/editar cuenta
 *
 * - Formulario con validacion Zod
 * - Selector de tipo de cuenta
 * - Selector de cuenta padre opcional
 */

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/presentation/components/ui/Select';

import type { Account } from '../../domain/types';
import { accountSchema, type AccountFormData } from '../../application/validations/account.schema';

const accountTypeOptions = [
  { value: 'MAIN', label: 'Principal' },
  { value: 'DEBT', label: 'Deuda' },
  { value: 'INSTALLMENT', label: 'Cuota' },
];

interface AccountFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AccountFormData) => Promise<void>;
  account?: Account | null;
  accounts: Account[];
  isLoading?: boolean;
}

export function AccountFormModal({
  isOpen,
  onClose,
  onSubmit,
  account,
  accounts,
  isLoading = false,
}: AccountFormModalProps) {
  const isEditing = !!account;

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: '',
      type: 'MAIN',
      parentId: null,
    },
  });

  useEffect(() => {
    if (account) {
      form.reset({
        name: account.name,
        type: account.type,
        parentId: account.parentId,
      });
    } else {
      form.reset({
        name: '',
        type: 'MAIN',
        parentId: null,
      });
    }
  }, [account, form]);

  const handleSubmit = async (data: AccountFormData) => {
    await onSubmit(data);
    onClose();
  };

  // Filtrar cuentas padre: excluir la cuenta actual (si editando) y sus hijos
  const availableParents = accounts.filter(
    (a) => !account || (a.id !== account.id && a.parentId !== account.id),
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg border-2 border-foreground p-0 gap-0 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="p-6 border-b-2 border-foreground">
          <DialogTitle className="text-xl font-bold">
            {isEditing ? `Editar Cuenta: ${account.name}` : 'Nueva Cuenta'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {/* Nombre */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Nombre de la Cuenta *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Cuenta Principal, Tarjeta de Credito"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Tipo de Cuenta *</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {accountTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cuenta Padre */}
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Cuenta Padre (opcional)</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value?.toString() ?? ''}
                        onValueChange={(val) =>
                          field.onChange(val === '' ? null : Number(val))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sin cuenta padre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Sin cuenta padre</SelectItem>
                          {availableParents.map((a) => (
                            <SelectItem key={a.id} value={a.id.toString()}>
                              {a.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-2 p-6 border-t-2 border-foreground bg-background">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : isEditing ? (
                  'Guardar Cambios'
                ) : (
                  'Crear Cuenta'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
