import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, ToggleButton, ToggleButtonGroup, Typography, IconButton, Tooltip } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import ArticleIcon from '@mui/icons-material/Article'
import ChatIcon from '@mui/icons-material/Chat'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from './themeStore'

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);

  const items = [
    { path: '/', label: t('menu.home'), icon: <HomeIcon /> },
    { path: '/posts', label: t('menu.posts'), icon: <ArticleIcon /> },
    { path: '/chat', label: t('menu.chat'), icon: <ChatIcon /> },
    { path: '/board', label: t('menu.board'), icon: <DashboardIcon /> },
    {path: '/location', label: t('menu.location'), icon: <LocationOnIcon />}
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
        },
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ px: 3, py: 3, fontWeight: 700, color: 'primary.main' }}>
          {t('app.name')}
        </Typography>
        <List sx={{ px: 1.5 }}>
          {items.map((item) => (
            <ListItemButton
              key={item.path}
              selected={isActive(item.path)}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: '10px',
                mb: 0.5,
                color: 'text.secondary',
                '& .MuiListItemIcon-root': { color: 'text.secondary', minWidth: 40 },
                '&.Mui-selected, &.Mui-selected:hover': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: 1, borderColor: 'divider' }}>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={i18n.language}
          onChange={(_e, value) => {
            if (value) i18n.changeLanguage(value);
          }}
        >
          <ToggleButton value="ru">RU</ToggleButton>
          <ToggleButton value="uz">UZ</ToggleButton>
        </ToggleButtonGroup>
        <Tooltip title={mode === 'dark' ? t('theme.light') : t('theme.dark')}>
          <IconButton onClick={toggleMode} aria-label={t('theme.toggle')} sx={{ color: 'primary.main' }}>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
}

export default Sidebar
