/**
 * Validaciones del módulo Users
 *
 * Esquema Zod para formulario de usuario
 */

import { z } from 'zod';

/**
 * Esquema de validación para el formulario de usuario
 */
// Solo letras (incluye acentos y ñ), espacios, guión y apóstrofe
const nameRegex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑàèìòùÀÈÌÒÙ\s'-]+$/;

export const userSchema = z
  .object({
    name: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre no puede exceder 100 caracteres')
      .regex(nameRegex, 'Solo se permiten letras y espacios'),
    email: z.string().email('Email inválido').max(100, 'El email no puede exceder 100 caracteres'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(100, 'La contraseña no puede exceder 100 caracteres')
      .optional()
      .or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
    roleIds: z.array(z.number()).min(1, 'Debe seleccionar al menos un rol').optional(),
    active: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // Si hay contraseña, debe coincidir con confirmación
      if (data.password && data.password !== '') {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword'],
    },
  );

export type UserFormData = z.infer<typeof userSchema>;
