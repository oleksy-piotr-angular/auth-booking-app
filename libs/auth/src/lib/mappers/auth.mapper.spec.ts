// projects/auth/src/lib/mappers/auth.mapper.spec.ts

import {
  mapLoginDtoToAuthToken,
  mapRegisterDtoToAuthToken,
  mapForgotPasswordDtoToData,
  mapResetPasswordDtoToData,
  mapUserProfileDtoToData,
} from './auth.mapper';

import {
  LoginResponseDto,
  RegisterResponseDto,
  ForgotPasswordResponseDto,
  ResetPasswordResponseDto,
  UserProfileDto,
} from '../dtos/auth.dto';

import {
  LoginData,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  UserProfileData,
} from '../models/auth.model';

describe('auth.mapper', () => {
  it('should map LoginResponseDto to LoginData', () => {
    const dto: LoginResponseDto = {
      accessToken: 'jwt.abc.123',
      user: { id: 99, email: 'test@example.com' },
    };

    const result: LoginData = mapLoginDtoToAuthToken(dto);
    expect(result).toEqual({ id: 99, token: 'jwt.abc.123' });
  });

  it('should map RegisterResponseDto to RegisterData', () => {
    const dto: RegisterResponseDto = {
      accessToken: 'jwt.def.456',
      user: { id: 7, email: 'new@user.com' },
    };

    const result: RegisterData = mapRegisterDtoToAuthToken(dto);
    expect(result).toEqual({ id: 7, token: 'jwt.def.456' });
  });

  it('should map ForgotPasswordResponseDto to ForgotPasswordData', () => {
    const dto: ForgotPasswordResponseDto = {
      message: 'Reset link sent successfully.',
    };

    const result: ForgotPasswordData = mapForgotPasswordDtoToData(dto);
    expect(result).toEqual({ message: 'Reset link sent successfully.' });
  });

  it('should map ResetPasswordResponseDto to ResetPasswordData', () => {
    const dto: ResetPasswordResponseDto = {
      message: 'Password has been reset.',
    };

    const result: ResetPasswordData = mapResetPasswordDtoToData(dto);
    expect(result).toEqual({ message: 'Password has been reset.' });
  });

  it('should map UserProfileDto to UserProfile', () => {
    const dto: UserProfileDto = {
      id: 5,
      name: 'Alice',
      email: 'alice@x.com',
    };

    const result: UserProfileData = mapUserProfileDtoToData(dto);
    expect(result).toEqual({
      id: 5,
      name: 'Alice',
      email: 'alice@x.com',
    });
  });
});
