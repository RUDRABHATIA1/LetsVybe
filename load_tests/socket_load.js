// socket_load.js
// Simple Socket.IO load generator (CommonJS)
// Usage: node socket_load.js <numClients> <serverUrl>

const { io } = require('socket.io-client');
const numClients = parseInt(process.argv[2] || '100', 10);
const server = process.argv[3] || 'https://lets-vybe.vercel.app';

console.log(`Starting ${numClients} clients against ${server}`);

for (let i = 0; i < numClients; i++) {
  const socket = io(server, {
    query: { userId: `loaduser${i}` },
    transports: ['websocket'],
    reconnection: false,
    secure: true,
  });

  socket.on('connect', () => {
    console.log(`client ${i} connected ${socket.id}`);
    // optional periodic emit
    setInterval(() => {
      socket.emit('ping', { ts: Date.now(), idx: i });
    }, 15000);
  });

  socket.on('connect_error', (err) => {
    console.error(`client ${i} connect_error:`, err && err.message);
  });
}

// Keep process alive
setInterval(() => {}, 1e6);
