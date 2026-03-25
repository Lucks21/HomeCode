import { IsOptional, IsEnum, IsDateString, IsNumberString, IsBooleanString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ListTransactionsQueryDto {
  @ApiProperty({ description: 'ID de la cuenta', required: false, example: '1' })
  @IsOptional()
  @IsNumberString({}, { message: 'El ID de la cuenta debe ser un número' })
  accountId?: string;

  @ApiProperty({ description: 'Tipo de movimiento', required: false, enum: ['INCOME', 'EXPENSE'] })
  @IsOptional()
  @IsEnum(['INCOME', 'EXPENSE'], { message: 'Tipo de movimiento inválido' })
  type?: string;

  @ApiProperty({ description: 'Fecha desde', required: false, example: '2026-01-01' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha desde debe tener un formato válido' })
  dateFrom?: string;

  @ApiProperty({ description: 'Fecha hasta', required: false, example: '2026-12-31' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha hasta debe tener un formato válido' })
  dateTo?: string;

  @ApiProperty({ description: 'Página', required: false, example: '1' })
  @IsOptional()
  @IsNumberString({}, { message: 'La página debe ser un número' })
  page?: string;

  @ApiProperty({ description: 'Registros por página', required: false, example: '20' })
  @IsOptional()
  @IsNumberString({}, { message: 'Los registros por página deben ser un número' })
  perPage?: string;

  @ApiProperty({ description: 'Incluir archivados', required: false })
  @IsOptional()
  @IsBooleanString()
  includeArchived?: string;
}
