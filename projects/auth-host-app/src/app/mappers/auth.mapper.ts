// auth.mapper.ts
import { LoginResponseDto, RegisterResponseDto } from '../dtos/auth.dto';
import { LoginData, RegisterData } from '../models/auth.model';

export function mapLoginDtoToAuthToken(dto: LoginResponseDto): LoginData {
  return {
    id: dto.user.id,
    token: dto.accessToken,
  };
}

export function mapRegisterDtoToAuthToken(
  dto: RegisterResponseDto
): RegisterData {
  return {
    id: dto.user.id,
    token: dto.accessToken,
  };
}
