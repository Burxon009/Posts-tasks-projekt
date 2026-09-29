import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, ToggleButton, ToggleButtonGroup } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import ArticleIcon from '@mui/icons-material/Article'
import ChatIcon from '@mui/icons-material/Chat'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

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
        width: 220,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 220,
          boxSizing: 'border-box',
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
    >
      <List>
        {items.map((item) => (
          <ListItemButton
            key={item.path}
            selected={isActive(item.path)}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
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
      </Box>
    </Drawer>
  );
}

export default Sidebar
