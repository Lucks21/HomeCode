import { IsOptional, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ListInstallmentsQueryDto {
  @ApiProperty({ description: 'Número de página', required: false, example: '1' })
  @IsOptional()
  @IsNumberString({}, { message: 'La página debe ser un número' })
  page?: string;

  @ApiProperty({ description: 'Resultados por página', required: false, example: '10' })
  @IsOptional()
  @IsNumberString({}, { message: 'El perPage debe ser un número' })
  perPage?: string;
}
