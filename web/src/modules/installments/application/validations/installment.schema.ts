import { z } from 'zod';

export const installmentSchema = z.object({
  accountId: z.number({ error: 'Debe seleccionar una cuenta' }),
  description: z.string().min(1, 'La descripción es requerida'),
  totalAmount: z.number({ error: 'El monto total es requerido' }).positive('El monto debe ser positivo'),
  totalInstallments: z
    .number({ error: 'El número de cuotas es requerido' })
    .int('Debe ser un número entero')
    .min(1, 'Debe tener al menos 1 cuota'),
  installmentValue: z.number().positive('El valor de cuota debe ser positivo').optional(),
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
});

export type InstallmentFormData = z.infer<typeof installmentSchema>;
