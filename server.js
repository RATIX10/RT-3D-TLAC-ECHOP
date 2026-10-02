<!DOCTYPE html>
<html lang="sk">
<head>
    <meta charset="UTF-8">
    <title>Získať QR Kód</title>
    <script src="/socket.io/socket.io.js"></script>
    <style>
        .disabled { opacity: 0.5; pointer-events: none; }
    </style>
</head>
<body>
    <h1>Získanie QR kódu</h1>
    <p>Na sklade zostáva: <strong id="stock-count">...</strong> kusov</p>

    <button id="claim-btn" onclick="claimQR()">Získať QR Kód</button>

    <div id="result" style="margin-top: 20px;"></div>

    <script>
        const socket = io();

        // Načítanie stavu pri otborení stránky
        async function loadStock() {
            const res = await fetch('/api/stock');
            const data = await res.json();
            document.getElementById('stock-count').innerText = data.stock;
            
            if (data.stock <= 0) {
                const btn = document.getElementById('claim-btn');
                btn.disabled = true;
                btn.innerText = "VYPREDANÉ";
            }
        }
        loadStock();

        // Keď server pošle 'force_reload', stránka sa všetkým automaticky obnoví
        socket.on('force_reload', () => {
            console.log('Niekto si kúpil kus, obnovujem stránku...');
            window.location.reload();
        });

        // Funkcia po kliknutí na tlačidlo
        async function claimQR() {
            const btn = document.getElementById('claim-btn');
            btn.disabled = true; // Prevencia dvojitého kliknutia
            btn.innerText = "Spracovávam...";

            const res = await fetch('/api/claim-qr', { method: 'POST' });
            const data = await res.json();

            if (data.success) {
                document.getElementById('result').innerHTML = `
                    <h2 style="color: green;">Váš QR kód: ${data.qrCode}</h2>
                    <p>Uložte si tento kód!</p>
                `;
            } else {
                alert(data.message);
                window.location.reload(); // Obnoví stránku pri neúspechu
            }
        }
    </script>
</body>
</html>
