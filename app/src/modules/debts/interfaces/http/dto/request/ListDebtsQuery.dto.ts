import { IsOptional, IsString, IsInt, IsEnum, IsBooleanString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ListDebtsQueryDto {
  @ApiProperty({ description: 'ID de cuenta para filtrar', required: false, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El ID de la cuenta debe ser un número entero' })
  accountId?: number;

  @ApiProperty({
    description: 'Estado de la deuda',
    required: false,
    enum: ['PENDING', 'PARTIAL', 'PAID'],
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Fecha desde (ISO 8601)', required: false })
  @IsOptional()
  @IsString()
  dateFrom?: string;

  @ApiProperty({ description: 'Fecha hasta (ISO 8601)', required: false })
  @IsOptional()
  @IsString()
  dateTo?: string;

  @ApiProperty({ description: 'Número de página', required: false, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La página debe ser un número entero' })
  page?: number;

  @ApiProperty({ description: 'Elementos por página', required: false, example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Los elementos por página deben ser un número entero' })
  perPage?: number;

  @ApiProperty({ description: 'Incluir archivados', required: false })
  @IsOptional()
  @IsBooleanString()
  includeArchived?: string;
}
