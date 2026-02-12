import { initAuthHandlers } from '../api/http'
import { store } from './store'
import { loggedOut, tokensUpdated } from '../features/auth/authSlice'

export function initAuth() {
  initAuthHandlers({
    getAccessToken: () => store.getState().auth.accessToken,
    getRefreshToken: () => store.getState().auth.refreshToken,
    setTokens: ({ accessToken, refreshToken, activeRole }) => {
      store.dispatch(tokensUpdated({ accessToken, refreshToken, activeRole }))
    },
    logout: () => {
      store.dispatch(loggedOut())
    },
  })
}
