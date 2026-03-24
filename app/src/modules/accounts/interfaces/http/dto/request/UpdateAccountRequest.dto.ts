import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccountRequestDto {
  @ApiProperty({ description: 'Nombre de la cuenta', required: false, example: 'Cuenta Editada' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'ID de la cuenta padre', required: false, example: 1 })
  @IsOptional()
  @IsInt({ message: 'El ID de la cuenta padre debe ser un número entero' })
  parentId?: number | null;
}
