const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static('public'));

let stock = 1; // Napríklad už zostáva len 1 kus!

// Získanie aktuálneho počtu kusov
app.get('/api/stock', (req, res) => {
    res.json({ stock });
});

// Endpoint pre získanie QR kódu / nákup
app.post('/api/claim-qr', (req, res) => {
    // ATÓMNA KONTROLA NA SERVERI
    if (stock > 0) {
        stock -= 1; // Okamžite odpočíta zo skladu, aby druhý požiadavok neprešiel

        // Vygenerovanie unikátneho kódu pre tohto zákazníka
        const qrCodeData = `QR-KOD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        // VŠETKÝM OSTATNÝM odošle príkaz na reload stránky
        io.emit('force_reload');

        // Odpoveď pre konkrétneho kupujúceho s jeho QR kódom
        return res.json({ success: true, qrCode: qrCodeData, remainingStock: stock });
    } else {
        // Ak už niekto bol o milisekundu rýchlejší
        return res.status(400).json({ success: false, message: 'Ľutujeme, posledný kus si práve niekto kúpil!' });
    }
});

io.on('connection', (socket) => {
    console.log('Klient pripojený');
});

server.listen(3000, () => {
    console.log('Server beží na http://localhost:3000');
});
