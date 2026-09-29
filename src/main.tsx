import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import './index.css'
import './i18n'
import App from './App.tsx'
import { useThemeStore } from './themeStore'
import { darkTheme, lightTheme } from './theme'

function Root() {
  const mode = useThemeStore((state) => state.mode)

  return (
    <ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <HashRouter>
        <App />
      </HashRouter>
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
