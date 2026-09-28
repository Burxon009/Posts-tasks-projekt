import { Stack, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Stack spacing={2} sx={{ alignItems: 'center', marginTop: '40px' }}>
      <Typography variant="h4">{t('home.title')}</Typography>
      <Button variant="contained" onClick={() => navigate('/posts')}>{t('menu.posts')}</Button>
      <Button variant="contained" onClick={() => navigate('/chat')}>{t('menu.chat')}</Button>
      <Button variant="contained" onClick={() => navigate('/board')}>{t('menu.board')}</Button>
    </Stack>
  );
}

export default HomePage
