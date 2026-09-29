import { useEffect, useRef, useState } from 'react'
import { Stack, Paper, Typography, TextField, Button, IconButton, Popover, Box } from '@mui/material'
import ListIcon from '@mui/icons-material/List'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import { usePostsStore } from './postsStore'
import { useTranslation } from 'react-i18next'

function ChatPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const wsRef = useRef<WebSocket | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const posts = usePostsStore((state) => state.posts)
const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'chat') {
        setMessages((prev) => [...prev, data.text]);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSend = () => {
    if (!input) return;
    wsRef.current?.send(JSON.stringify({ type: 'chat', text: input }));
    setMessages((prev) => [...prev, `${t('chat.me')}: ${input}`]);
    setInput('');
  };

  return (
  <Box sx={{ p: 4, height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
    <Button sx={{ alignSelf: 'flex-start', mb: 2 }} startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>{t('common.back')}</Button>
    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h4">{t('chat.title')}</Typography>
      <IconButton aria-label={t('chat.postsList')} title={t('chat.postsList')} onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: 'primary.main' }}>
        <ListIcon />
      </IconButton>
    </Stack>

    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Box sx={{ p: 2, maxWidth: 320, maxHeight: 400 }}>
        {posts.map((post) => (
          <Typography key={post.id} variant="body2" sx={{ py: 0.75, borderBottom: 1, borderColor: 'divider' }}>{post.title}</Typography>
        ))}
      </Box>
    </Popover>

      <Paper elevation={2} sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
        {messages.map((message, i) => {
          const isMine = message.startsWith(`${t('chat.me')}: `);
          return (
            <Box
              key={i}
              sx={{
                alignSelf: isMine ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
                px: 2,
                py: 1,
                borderRadius: '16px',
                borderBottomRightRadius: isMine ? '4px' : '16px',
                borderBottomLeftRadius: isMine ? '16px' : '4px',
                bgcolor: isMine ? 'primary.main' : 'action.selected',
                color: isMine ? 'primary.contrastText' : 'text.primary',
                wordBreak: 'break-word',
              }}
            >
              <Typography variant="body2">{message}</Typography>
            </Box>
          );
        })}
      </Paper>

      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '999px', bgcolor: 'background.paper' } }}
        />
        <Button variant="contained" onClick={handleSend} sx={{ borderRadius: '999px', px: 3 }}>{t('chat.send')}</Button>
      </Stack>
    </Box>
  );
}

export default ChatPage
