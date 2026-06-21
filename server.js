const http = require('http');
const path = require('path');
const os = require('os');
const express = require('express');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const rooms = new Map(); // roomCode -> Set<WebSocket>

wss.on('connection', (ws, req) => {
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  const room = new URLSearchParams(qs).get('room') || '';

  if (!room) { ws.close(4000, 'no room'); return; }

  if (!rooms.has(room)) rooms.set(room, new Set());
  rooms.get(room).add(ws);
  console.log(`[${room}] connected (${rooms.get(room).size})`);

  ws.on('message', (data) => {
    let msg;
    try { msg = JSON.parse(data); } catch { return; }

    if (msg.type === 'ring') {
      for (const client of rooms.get(room)) {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify({ type: 'ring' }));
        }
      }
    }
  });

  ws.on('close', () => {
    const set = rooms.get(room);
    if (set) { set.delete(ws); if (!set.size) rooms.delete(room); }
    console.log(`[${room}] disconnected (${rooms.get(room)?.size ?? 0})`);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const lanIp = getLanIp();
  console.log(`\nas.dindon running`);
  console.log(`  Local:   http://localhost:${PORT}`);
  if (lanIp) {
    console.log(`  Network: http://${lanIp}:${PORT}  ← share this with others on your Wi-Fi\n`);
  }
});

function getLanIp() {
  for (const ifaces of Object.values(os.networkInterfaces())) {
    for (const iface of ifaces) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address;
    }
  }
  return null;
}
