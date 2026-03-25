import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDebtPaymentRequestDto {
  @ApiProperty({ description: 'Monto del pago', example: 1000.0 })
  @IsNumber({}, { message: 'El monto debe ser un número' })
  @IsPositive({ message: 'El monto debe ser mayor a 0' })
  amount: number;

  @ApiProperty({ description: 'Fecha del pago (ISO 8601)', example: '2026-03-23T00:00:00.000Z' })
  @IsString()
  @IsNotEmpty({ message: 'La fecha es requerida' })
  date: string;
}
