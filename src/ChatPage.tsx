import { useEffect, useRef, useState } from 'react'
import { Stack, Paper, Typography, TextField, Button, IconButton, Popover, Box } from '@mui/material'
import ListIcon from '@mui/icons-material/List'
import { usePostsStore } from './postsStore'

function ChatPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const wsRef = useRef<WebSocket | null>(null);
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
    setMessages((prev) => [...prev, `Я: ${input}`]);
    setInput('');
  };

  return (
  <Stack spacing={2} style={{ margin: '20px' }}>
    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h4">Чат</Typography>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <ListIcon sx={{color: "#fff"}} />
      </IconButton>
    </Stack>

    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Box style={{ padding: '10px', maxWidth: '300px' }}>
        {posts.map((post) => (
          <Typography key={post.id}>{post.title}</Typography>
        ))}
      </Box>
    </Popover>

      <Paper style={{ padding: '10px', minHeight: '300px' }}>
        {messages.map((message, i) => (
          <Typography key={i}>{message}</Typography>
        ))}
      </Paper>

      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{backgroundColor: 'white', borderRadius: '40px'}}
        />
        <Button variant="contained" onClick={handleSend} style={{borderRadius: '40px'}}>Отправить</Button>
      </Stack>
    </Stack>
  );
}

export default ChatPage
