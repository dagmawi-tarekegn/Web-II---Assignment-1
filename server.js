const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'movies.json');

// Helper to read data from the JSON file
const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading data file:', err);
        return [];
    }
};

// Send JSON response
const sendResponse = (res, statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
    const { method, url } = req;
    const urlParts = url.split('/');
    const id = urlParts[2];

    if (url === '/movies' && method === 'GET') {
        const movies = readData();
        sendResponse(res, 200, movies);
    } else if (url.startsWith('/movies/') && method === 'GET' && id) {
        const movies = readData();
        const movie = movies.find(m => m.id === id);
        if (movie) {
            sendResponse(res, 200, movie);
        } else {
            sendResponse(res, 404, { message: 'Movie not found' });
        }
    } else {
        sendResponse(res, 404, { message: 'Route not found' });
    }
});

server.listen(PORT, () => {
    console.log('Server is running on http://localhost:' + PORT);
});
