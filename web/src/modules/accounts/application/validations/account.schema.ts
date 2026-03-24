import { z } from 'zod';

export const accountSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres'),
  type: z.enum(['MAIN', 'DEBT', 'INSTALLMENT'], { message: 'Tipo de cuenta inválido' }),
  parentId: z.number().nullable().optional(),
});

export type AccountFormData = z.infer<typeof accountSchema>;
