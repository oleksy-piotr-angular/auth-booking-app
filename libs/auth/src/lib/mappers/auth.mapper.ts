// projects/auth/src/lib/mappers/auth.mapper.ts
import {
  LoginResponseDto,
  RegisterResponseDto,
  ForgotPasswordResponseDto,
  ResetPasswordResponseDto,
} from '../dtos/auth.dto';
import {
  LoginData,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
} from '../models/auth.model';

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

export function mapForgotPasswordDtoToData(
  dto: ForgotPasswordResponseDto
): ForgotPasswordData {
  return {
    message: dto.message,
  };
}

export function mapResetPasswordDtoToData(
  dto: ResetPasswordResponseDto
): ResetPasswordData {
  return {
    message: dto.message,
  };
}
