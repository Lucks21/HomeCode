import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountRequestDto {
  @ApiProperty({ description: 'Nombre de la cuenta', example: 'Cuenta Principal' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string;

  @ApiProperty({
    description: 'Tipo de cuenta',
    enum: ['MAIN', 'DEBT', 'INSTALLMENT'],
    example: 'MAIN',
  })
  @IsEnum(['MAIN', 'DEBT', 'INSTALLMENT'], { message: 'Tipo de cuenta inválido' })
  type: string;

  @ApiProperty({ description: 'ID de la cuenta padre (opcional)', required: false, example: 1 })
  @IsOptional()
  @IsInt({ message: 'El ID de la cuenta padre debe ser un número entero' })
  parentId?: number;
}
