const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

// Servovanie statických súborov z priečinka "public"
app.use(express.static('public'));

// Simulatívny stav skladu
let stock = 15;

// Endpoint na zistenie aktuálneho stavu skladu pri prvom načítaní
app.get('/api/stock', (req, res) => {
    res.json({ stock });
});

// Endpoint pre nákup
app.post('/api/buy', (req, res) => {
    if (stock > 0) {
        stock -= 1; // Znížime stav o 1

        // Odošleme správy VŠETKÝM pripojeným klientom
        io.emit('stock_updated', { newStock: stock });

        res.json({ success: true, remaining: stock });
    } else {
        res.status(400).json({ success: false, message: 'Produkt je už vypredaný!' });
    }
});

io.on('connection', (socket) => {
    console.log('Používateľ sa pripojil do aplikácie');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server beží na http://localhost:${PORT}`);
});
