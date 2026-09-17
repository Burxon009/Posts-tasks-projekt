import { useEffect, useRef, useState } from 'react'
import { Stack, Paper, Typography, TextField, Button } from '@mui/material'

function ChatPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

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
      <Typography variant="h4">Чат</Typography>

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
        />
        <Button variant="contained" onClick={handleSend}>Отправить</Button>
      </Stack>
    </Stack>
  );
}

export default ChatPage
