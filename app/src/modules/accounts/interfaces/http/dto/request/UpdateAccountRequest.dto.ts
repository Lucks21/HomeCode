import { IsString, IsOptional, IsInt, IsIn, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccountRequestDto {
  @ApiProperty({ description: 'Nombre de la cuenta', required: false, example: 'Cuenta Editada' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Tipo de cuenta', required: false, example: 'MAIN', enum: ['MAIN', 'DEBT', 'INSTALLMENT'] })
  @IsOptional()
  @IsIn(['MAIN', 'DEBT', 'INSTALLMENT'], { message: 'El tipo debe ser MAIN, DEBT o INSTALLMENT' })
  type?: string;

  @ApiProperty({ description: 'ID de la cuenta padre (null para quitar el padre)', required: false, example: 1, nullable: true })
  @IsOptional()
  @ValidateIf((obj: UpdateAccountRequestDto) => obj.parentId !== null)
  @IsInt({ message: 'El ID de la cuenta padre debe ser un número entero' })
  parentId?: number | null;
}
