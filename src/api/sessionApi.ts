import { apiRequest } from './http'
import type { AuthResponse } from './authApi'

export type UserMeResponse = {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  phoneCountryCode: string | null
  phoneNumber: string | null
  createdAt: string | null
  updatedAt: string | null
  activeRole: string | null
  roles: string[]
}

export type PermissionsResponse = {
  permissions: string[]
}

export async function me() {
  return apiRequest<UserMeResponse>('/api/v1/session/me', {
    method: 'GET',
  })
}

export async function permissions() {
  return apiRequest<PermissionsResponse>('/api/v1/session/permissions', {
    method: 'GET',
  })
}

export async function switchRole(roleName: string) {
  return apiRequest<AuthResponse>('/api/v1/session/switch-role', {
    method: 'POST',
    body: JSON.stringify({ roleName }),
  })
}
