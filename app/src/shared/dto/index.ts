import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Número de página', example: 1, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page debe ser un número entero' })
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Elementos por página', example: 30, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'perPage debe ser un número entero' })
  @Min(1)
  perPage?: number = 30;
}
