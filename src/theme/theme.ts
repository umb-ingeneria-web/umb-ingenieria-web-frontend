export type ThemeMode = 'dark' | 'light'

const STORAGE_KEY = 'app.theme'

export function getStoredTheme(): ThemeMode | null {
  const v = localStorage.getItem(STORAGE_KEY)
  if (v === 'dark' || v === 'light') return v
  return null
}

export function getSystemTheme(): ThemeMode {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}

export function getInitialTheme(): ThemeMode {
  return getStoredTheme() ?? getSystemTheme()
}

export function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme
  localStorage.setItem(STORAGE_KEY, theme)
}

export function initTheme() {
  applyTheme(getInitialTheme())
}

export function toggleTheme(current: ThemeMode): ThemeMode {
  const next: ThemeMode = current === 'dark' ? 'light' : 'dark'
  applyTheme(next)
  return next
}
