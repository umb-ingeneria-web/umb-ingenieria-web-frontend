import { useEffect, useState } from 'react'

import { getInitialTheme, toggleTheme, type ThemeMode } from './theme'

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return {
    theme,
    isDark: theme === 'dark',
    toggle: () => setTheme((t) => toggleTheme(t)),
  }
}
