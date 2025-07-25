// auth.dto.ts
export interface LoginResponseDto {
  accessToken: string;
  user: { id: number; email: string };
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}
export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
}

export interface RegisterResponseDto extends LoginResponseDto {}
