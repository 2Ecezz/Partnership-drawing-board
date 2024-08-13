const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const drawingHistory = [];

wss.on('connection', (ws) => {
    console.log('Client connected');

    // Send the entire drawing history to the new client
    drawingHistory.forEach((data) => {
        ws.send(JSON.stringify(data));
    });

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'draw') {
            drawingHistory.push(data);
        } else if (data.type === 'clear') {
            drawingHistory = [];
        }

        // Broadcast message to all clients except the sender
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
