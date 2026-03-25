import { z } from 'zod';

export const transactionSchema = z.object({
  accountId: z.number({ error: 'Debe seleccionar una cuenta' }),
  description: z.string().min(1, 'La descripción es requerida'),
  amount: z.number({ error: 'El monto es requerido' }).positive('El monto debe ser positivo'),
  type: z.enum(['INCOME', 'EXPENSE'], { error: 'Debe seleccionar un tipo' }),
  date: z.string().min(1, 'La fecha es requerida'),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
