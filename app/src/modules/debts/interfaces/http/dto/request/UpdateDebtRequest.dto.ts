import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDebtRequestDto {
  @ApiProperty({ description: 'Descripción de la deuda', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Fecha de la deuda', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;
}
