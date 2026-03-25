import { IsString, IsOptional, IsNumber, IsEnum, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTransactionRequestDto {
  @ApiProperty({ description: 'Descripción del movimiento', required: false, example: 'Pago actualizado' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Monto del movimiento', required: false, example: 2000.00 })
  @IsOptional()
  @IsNumber({}, { message: 'El monto debe ser un número' })
  @Min(0.01, { message: 'El monto debe ser mayor a 0' })
  amount?: number;

  @ApiProperty({ description: 'Tipo de movimiento', required: false, enum: ['INCOME', 'EXPENSE'], example: 'EXPENSE' })
  @IsOptional()
  @IsEnum(['INCOME', 'EXPENSE'], { message: 'Tipo de movimiento inválido' })
  type?: string;

  @ApiProperty({ description: 'Fecha del movimiento', required: false, example: '2026-03-23T00:00:00.000Z' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe tener un formato válido' })
  date?: string;
}
