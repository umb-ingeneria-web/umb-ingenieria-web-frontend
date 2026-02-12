import { apiRequest } from './http'

export type MessageResponse = { message: string }

export type AuthResponse = {
  accessToken: string
  refreshToken: string | null
  activeRole: string | null
}

export type RegisterRequest = {
  email: string
  password: string
  phoneCountryCode: string
  phoneNumber: string
  fullName?: string
}

export type LoginRequest = {
  email: string
  password: string
}

export async function register(req: RegisterRequest) {
  return apiRequest<MessageResponse>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(req),
    auth: false,
  })
}

export async function login(req: LoginRequest) {
  return apiRequest<AuthResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(req),
    auth: false,
  })
}
