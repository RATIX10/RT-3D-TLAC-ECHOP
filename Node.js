const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Keď niekto kúpi produkt:
app.post('/buy-product', (req, res) => {
    // 1. Zmeníme stav skladu v databáze...
    const updatedStock = 5; 

    // 2. Pošleme správu VŠETKÝM pripojeným používateľom
    io.emit('stockUpdated', { newStock: updatedStock });

    res.json({ success: true });
});
