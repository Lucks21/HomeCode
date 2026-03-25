import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInstallmentRequestDto {
  @ApiProperty({ description: 'ID de la cuenta asociada', example: 1 })
  @IsInt({ message: 'El ID de la cuenta debe ser un número entero' })
  accountId: number;

  @ApiProperty({ description: 'Descripción del plan de cuotas', example: 'Compra televisor' })
  @IsString()
  @IsNotEmpty({ message: 'La descripción es requerida' })
  description: string;

  @ApiProperty({ description: 'Monto total del plan', example: 120000 })
  @IsNumber({}, { message: 'El monto total debe ser un número' })
  totalAmount: number;

  @ApiProperty({ description: 'Número total de cuotas', example: 12 })
  @IsInt({ message: 'El número de cuotas debe ser un número entero' })
  totalInstallments: number;

  @ApiProperty({ description: 'Valor de cada cuota (opcional, se calcula automáticamente)', required: false, example: 10000 })
  @IsOptional()
  @IsNumber({}, { message: 'El valor de la cuota debe ser un número' })
  installmentValue?: number;

  @ApiProperty({ description: 'Fecha de inicio del plan (ISO string)', example: '2026-01-15' })
  @IsString()
  @IsNotEmpty({ message: 'La fecha de inicio es requerida' })
  startDate: string;
}
