import { createTheme } from '@mui/material'

const common: any = {
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Inter", system-ui, "Segoe UI", Roboto, sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiButton: {
      styleOverrides: { root: { borderRadius: 10 } },
    },
  },
}

export const darkTheme = createTheme({
  ...common,
  palette: {
    mode: 'dark',
    primary: { main: '#b388ff' },
    background: { default: '#120d1f', paper: '#1c1530' },
    text: { primary: '#ffffff', secondary: '#b8a9d9' },
    divider: 'rgba(179, 136, 255, 0.15)',
  },
})

export const lightTheme = createTheme({
  ...common,
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    background: { default: '#f5f7fa', paper: '#ffffff' },
  },
})
