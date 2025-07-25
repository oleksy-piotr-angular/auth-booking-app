// projects/auth/src/lib/mappers/auth.mapper.spec.ts
import {
  mapLoginDtoToAuthToken,
  mapRegisterDtoToAuthToken,
} from './auth.mapper';
import { LoginResponseDto, RegisterResponseDto } from '../dtos/auth.dto';
import { LoginData, RegisterData } from '../models/auth.model';

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
});
