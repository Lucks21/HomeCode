// DTO de Response para autenticación
import { UserResponseDto } from '../../../../../users/interfaces/http/dto/response/UserResponse.dto';

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserResponseDto;
  expiresIn: number;
}
