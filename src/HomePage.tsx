import { Box, Card, CardActionArea, Typography } from '@mui/material'
import ArticleIcon from '@mui/icons-material/Article'
import ChatIcon from '@mui/icons-material/Chat'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const tiles = [
    { path: '/posts', label: t('menu.posts'), icon: <ArticleIcon sx={{ fontSize: 40 }} /> },
    { path: '/chat', label: t('menu.chat'), icon: <ChatIcon sx={{ fontSize: 40 }} /> },
    { path: '/board', label: t('menu.board'), icon: <DashboardIcon sx={{ fontSize: 40 }} /> },
    { path: '/location', label: t('menu.location'), icon: <LocationOnIcon sx={{ fontSize: 40 }} /> },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>{t('home.title')}</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 3 }}>
        {tiles.map((tile) => (
          <Card
            key={tile.path}
            elevation={2}
            sx={{ transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}
          >
            <CardActionArea
              onClick={() => navigate(tile.path)}
              sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <Box sx={{ color: 'primary.main' }}>{tile.icon}</Box>
              <Typography variant="h6">{tile.label}</Typography>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default HomePage
