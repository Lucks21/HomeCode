import { z } from 'zod';

export const debtSchema = z.object({
  accountId: z.number({ error: 'Debe seleccionar una cuenta' }),
  description: z.string().min(1, 'La descripción es requerida'),
  amount: z.number({ error: 'El monto es requerido' }).positive('El monto debe ser positivo'),
  date: z.string().min(1, 'La fecha es requerida'),
});

export type DebtFormData = z.infer<typeof debtSchema>;
