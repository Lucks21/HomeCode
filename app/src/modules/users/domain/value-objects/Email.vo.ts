// Value Object: Email
// Representa un email válido con sus reglas de validación

export class Email {
  private constructor(public readonly value: string) {
    this.validate(value);
  }

  // Factory method para crear un Email
  static create(value: string): Email {
    return new Email(value);
  }

  // Regla de negocio: Validar formato de email
  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('El email no puede estar vacío');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error('El formato del email no es válido');
    }

    if (value.length > 255) {
      throw new Error('El email no puede tener más de 255 caracteres');
    }
  }

  // Comparar con otro Email
  equals(other: Email): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }

  // Convertir a string
  toString(): string {
    return this.value;
  }
}
