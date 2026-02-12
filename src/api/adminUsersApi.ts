import { apiRequest } from './http'
import type { MessageResponse } from './authApi'

export type SpringPage<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
}

export type UserSummaryResponse = {
  id: string
  email: string
  fullName: string
  phoneCountryCode: string
  phoneNumber: string
  createdAt: string
  roles: string[]
  enabled: boolean
}

export type UserDetailResponse = {
  id: string
  email: string
  fullName: string
  avatarUrl: string
  phoneCountryCode: string
  phoneNumber: string
  createdAt: string
  updatedAt: string
  enabled: boolean
  roles: string[]
}

export async function listUsers(params: {
  page: number
  size: number
}) {
  const qs = new URLSearchParams({
    page: String(params.page),
    size: String(params.size),
  })

  return apiRequest<SpringPage<UserSummaryResponse>>(
    `/api/v1/admin/users?${qs.toString()}`,
    { method: 'GET' },
  )
}

export async function getUserDetail(id: string) {
  return apiRequest<UserDetailResponse>(`/api/v1/admin/users/${id}`, {
    method: 'GET',
  })
}

export async function updateUserStatus(id: string, enabled: boolean) {
  return apiRequest<MessageResponse>(`/api/v1/admin/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ enabled }),
  })
}

export async function updateUserRoles(id: string, roles: string[]) {
  return apiRequest<MessageResponse>(`/api/v1/admin/users/${id}/roles`, {
    method: 'PUT',
    body: JSON.stringify({ roles }),
  })
}
