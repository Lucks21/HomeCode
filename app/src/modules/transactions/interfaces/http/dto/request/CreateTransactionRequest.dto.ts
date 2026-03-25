import { IsString, IsNotEmpty, IsNumber, IsEnum, IsDateString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionRequestDto {
  @ApiProperty({ description: 'ID de la cuenta', example: 1 })
  @IsInt({ message: 'El ID de la cuenta debe ser un número entero' })
  accountId: number;

  @ApiProperty({ description: 'Descripción del movimiento', example: 'Pago de salario' })
  @IsString()
  @IsNotEmpty({ message: 'La descripción es requerida' })
  description: string;

  @ApiProperty({ description: 'Monto del movimiento', example: 1500.50 })
  @IsNumber({}, { message: 'El monto debe ser un número' })
  @Min(0.01, { message: 'El monto debe ser mayor a 0' })
  amount: number;

  @ApiProperty({ description: 'Tipo de movimiento', enum: ['INCOME', 'EXPENSE'], example: 'INCOME' })
  @IsEnum(['INCOME', 'EXPENSE'], { message: 'Tipo de movimiento inválido' })
  type: string;

  @ApiProperty({ description: 'Fecha del movimiento', example: '2026-03-23T00:00:00.000Z' })
  @IsDateString({}, { message: 'La fecha debe tener un formato válido' })
  date: string;
}
