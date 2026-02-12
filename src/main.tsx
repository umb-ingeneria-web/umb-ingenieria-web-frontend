import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import './index.css'
import './styles/theme.scss'
import 'react-toastify/dist/ReactToastify.css'
import App from './App.tsx'

import { initAuth } from './app/initAuth'
import { initTheme } from './theme/theme'
import { persistor, store } from './app/store'

initTheme()
initAuth()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
