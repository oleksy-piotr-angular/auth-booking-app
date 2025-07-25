// auth.model.ts
export interface LoginData {
  id: number;
  token: string;
}

export interface RegisterData extends LoginData {}
