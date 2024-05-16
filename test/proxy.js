const express = require('express');
const request = require('request');
const cors = require('cors');

const app = express();
const PORT = 3001; // 改为3001

// Enable CORS for all routes
app.use(cors());

app.get('/fetch', (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('Missing url parameter');
    }

    // Use request to fetch the external content
    request(url, (error, response, body) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send(body);
    });
});

app.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
});
