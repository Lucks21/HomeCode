// Adaptador para generar códigos de verificación aleatorios
// Implementación concreta del puerto CodeGenerator

import { Injectable } from '@nestjs/common';
import { CodeGenerator } from '../../../domain/services/CodeGenerator.interface';

@Injectable()
export class RandomCodeGenerator implements CodeGenerator {
  generate(): string {
    // Genera un código de 6 dígitos aleatorio entre 100000 y 999999
    const code = Math.floor(100000 + Math.random() * 900000);
    return code.toString();
  }
}
