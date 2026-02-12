import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import * as adminUsersApi from '../../api/adminUsersApi'

export type AdminUsersState = {
  loading: boolean
  page: number
  size: number
  totalPages: number
  totalElements: number
  users: adminUsersApi.UserSummaryResponse[]
  rolesByUserId: Record<string, string[]>
}

const initialState: AdminUsersState = {
  loading: false,
  page: 0,
  size: 10,
  totalPages: 0,
  totalElements: 0,
  users: [],
  rolesByUserId: {},
}

export const fetchUsers = createAsyncThunk(
  'adminUsers/fetchUsers',
  async (params: { page: number; size: number }) => {
    const pageRes = await adminUsersApi.listUsers(params)

    const roles = pageRes.content.map((u) => ({ id: u.id, roles: u.roles }))

    return {
      pageRes,
      roles,
      params,
    }
  },
)

export const setUserEnabled = createAsyncThunk(
  'adminUsers/setUserEnabled',
  async (args: { id: string; enabled: boolean }) => {
    await adminUsersApi.updateUserStatus(args.id, args.enabled)
    return args
  },
)

export const setUserRoles = createAsyncThunk(
  'adminUsers/setUserRoles',
  async (args: { id: string; roles: string[] }) => {
    await adminUsersApi.updateUserRoles(args.id, args.roles)
    return args
  },
)

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    resetAdminUsers: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.page = action.payload.params.page
        state.size = action.payload.params.size
        state.totalPages = action.payload.pageRes.totalPages
        state.totalElements = action.payload.pageRes.totalElements
        state.users = action.payload.pageRes.content

        for (const r of action.payload.roles) {
          state.rolesByUserId[r.id] = r.roles
        }
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false
      })
      .addCase(setUserEnabled.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u.id === action.payload.id)
        if (idx >= 0) {
          state.users[idx] = { ...state.users[idx], enabled: action.payload.enabled }
        }
      })
      .addCase(setUserRoles.fulfilled, (state, action) => {
        state.rolesByUserId[action.payload.id] = action.payload.roles
      })
  },
})

export const { resetAdminUsers } = adminUsersSlice.actions

export default adminUsersSlice.reducer
