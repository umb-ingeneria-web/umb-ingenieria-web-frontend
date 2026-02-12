import { apiRequest } from './http'
import type { MessageResponse } from './authApi'

export type UpdateProfileRequest = {
  fullName?: string | null
  avatarUrl?: string | null
}

export type ChangePasswordRequest = {
  currentPassword: string
  newPassword: string
}

export async function updateProfile(req: UpdateProfileRequest) {
  return apiRequest<MessageResponse>('/api/v1/profile/update', {
    method: 'PATCH',
    body: JSON.stringify(req),
  })
}

export async function changePassword(req: ChangePasswordRequest) {
  return apiRequest<MessageResponse>('/api/v1/profile/change-password', {
    method: 'PATCH',
    body: JSON.stringify(req),
  })
}
