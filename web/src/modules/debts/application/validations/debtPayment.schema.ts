import { z } from 'zod';

export const debtPaymentSchema = z.object({
  amount: z.number({ error: 'El monto es requerido' }).positive('El monto debe ser positivo'),
  date: z.string().min(1, 'La fecha es requerida'),
});

export type DebtPaymentFormData = z.infer<typeof debtPaymentSchema>;
