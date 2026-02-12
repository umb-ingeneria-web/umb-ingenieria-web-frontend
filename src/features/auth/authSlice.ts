import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import * as authApi from '../../api/authApi'
import * as profileApi from '../../api/profileApi'
import * as sessionApi from '../../api/sessionApi'

export type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  activeRole: string | null
  user: sessionApi.UserMeResponse | null
  permissions: string[]
  loading: boolean
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  activeRole: null,
  user: null,
  permissions: [],
  loading: false,
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async (req: authApi.RegisterRequest) => {
    await authApi.register(req)
    return true
  },
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async (req: authApi.LoginRequest, { dispatch }) => {
    const res = await authApi.login(req)
    dispatch(
      tokensUpdated({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        activeRole: res.activeRole,
      }),
    )

    await dispatch(loadSession()).unwrap()

    return true
  },
)

export const loadSession = createAsyncThunk(
  'auth/loadSession',
  async (_, { dispatch }) => {
    const [me, perms] = await Promise.all([
      sessionApi.me(),
      sessionApi.permissions(),
    ])

    dispatch(userUpdated(me))
    dispatch(permissionsUpdated(perms.permissions))

    return true
  },
)

export const switchActiveRole = createAsyncThunk(
  'auth/switchRole',
  async (roleName: string, { dispatch, getState }) => {
    const res = await sessionApi.switchRole(roleName)
    const state = getState() as { auth: AuthState }

    dispatch(
      tokensUpdated({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken ?? state.auth.refreshToken,
        activeRole: res.activeRole,
      }),
    )

    await dispatch(loadSession()).unwrap()

    return true
  },
)

export const updateMyProfile = createAsyncThunk(
  'auth/updateProfile',
  async (req: profileApi.UpdateProfileRequest, { dispatch }) => {
    await profileApi.updateProfile(req)
    await dispatch(loadSession()).unwrap()
    return true
  },
)

export const changeMyPassword = createAsyncThunk(
  'auth/changePassword',
  async (req: profileApi.ChangePasswordRequest) => {
    await profileApi.changePassword(req)
    return true
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    tokensUpdated: (
      state,
      action: {
        payload: {
          accessToken: string
          refreshToken: string | null
          activeRole: string | null
        }
      },
    ) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.activeRole = action.payload.activeRole
    },
    userUpdated: (state, action: { payload: sessionApi.UserMeResponse }) => {
      state.user = action.payload
      state.activeRole = action.payload.activeRole
    },
    permissionsUpdated: (state, action: { payload: string[] }) => {
      state.permissions = action.payload
    },
    loggedOut: (state) => {
      state.accessToken = null
      state.refreshToken = null
      state.activeRole = null
      state.user = null
      state.permissions = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.startsWith('auth/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith('auth/') &&
          (action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected')),
        (state) => {
          state.loading = false
        },
      )
  },
})

export const { tokensUpdated, userUpdated, permissionsUpdated, loggedOut } =
  authSlice.actions

export default authSlice.reducer
