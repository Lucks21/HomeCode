import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PayInstallmentsRequestDto {
  @ApiProperty({ description: 'Cantidad de cuotas a pagar', example: 1, minimum: 1 })
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad mínima es 1' })
  count: number;
}
