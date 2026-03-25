import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDebtRequestDto {
  @ApiProperty({ description: 'ID de la cuenta asociada', example: 1 })
  @IsInt({ message: 'El ID de la cuenta debe ser un número entero' })
  accountId: number;

  @ApiProperty({ description: 'Descripción de la deuda', example: 'Préstamo personal' })
  @IsString()
  @IsNotEmpty({ message: 'La descripción es requerida' })
  description: string;

  @ApiProperty({ description: 'Monto de la deuda', example: 5000.0 })
  @IsNumber({}, { message: 'El monto debe ser un número' })
  @IsPositive({ message: 'El monto debe ser mayor a 0' })
  amount: number;

  @ApiProperty({ description: 'Fecha de la deuda (ISO 8601)', example: '2026-03-23T00:00:00.000Z' })
  @IsString()
  @IsNotEmpty({ message: 'La fecha es requerida' })
  date: string;
}
