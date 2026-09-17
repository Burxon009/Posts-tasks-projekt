const express = require('express');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');

const app = express();
app.use(cors());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Клиент подключился');

  ws.on('message', (message) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === client.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on('close', () => {
    console.log('Клиент отключился');
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
