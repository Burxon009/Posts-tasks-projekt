import { Stack, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate();

  return (
    <Stack spacing={2} sx={{ alignItems: 'center', marginTop: '40px' }}>
      <Typography variant="h4">Главное меню</Typography>
      <Button variant="contained" onClick={() => navigate('/posts')}>Посты</Button>
      <Button variant="contained" onClick={() => navigate('/chat')}>Чат</Button>
      <Button variant="contained" onClick={() => navigate('/board')}>Доски</Button>
    </Stack>
  );
}

export default HomePage
