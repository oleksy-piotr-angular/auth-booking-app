// auth.mapper.spec.ts
import { mapLoginDtoToAuthToken } from './auth.mapper';
import { LoginResponseDto } from '../dtos/auth.dto';

describe('auth.mapper', () => {
  it('should map LoginResponseDto to AuthToken', () => {
    const dto: LoginResponseDto = {
      accessToken: 'jwt.abc.123',
      user: { id: 99, email: 'test@example.com' },
    };

    const result = mapLoginDtoToAuthToken(dto);
    expect(result).toEqual({ id: 99, token: 'jwt.abc.123' });
  });
});
