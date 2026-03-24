import { IsOptional, IsBooleanString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ListAccountsQueryDto {
  @ApiProperty({
    description: 'Incluir cuentas archivadas',
    required: false,
    example: 'false',
  })
  @IsOptional()
  @IsBooleanString()
  includeArchived?: string;
}
