const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static('public'));

let stock = 10;

app.get('/api/stock', (req, res) => {
    res.json({ stock });
});

app.post('/api/buy', (req, res) => {
    if (stock > 0) {
        stock -= 1;
        
        // Broadcast nového stavu skladu všetkým pripojeným používateľom
        io.emit('stock_updated', { newStock: stock });

        res.json({ success: true, stock });
    } else {
        res.status(400).json({ success: false, message: 'Vypredané!' });
    }
});

io.on('connection', (socket) => {
    console.log('Nový používateľ pripojený');
});

server.listen(3000, () => {
    console.log('Server beží na http://localhost:3000');
});
