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

// Helper to write data to the JSON file
const writeData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing to data file:', err);
    }
};

// Helper to parse request body
const getRequestBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (err) {
                reject(err);
            }
        });
    });
};

// Send JSON response
const sendResponse = (res, statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
};

const server = http.createServer(async (req, res) => {
    const { method, url } = req;
    const urlParts = url.split('/');
    const id = urlParts[2]; // /movies/:id

    // Routing Logic
    if (url === '/movies' && method === 'GET') {
        // GET all movies
        const movies = readData();
        sendResponse(res, 200, movies);

    } else if (url.startsWith('/movies/') && method === 'GET' && id) {
        // GET single movie by ID
        const movies = readData();
        const movie = movies.find(m => m.id === id);
        if (movie) {
            sendResponse(res, 200, movie);
        } else {
            sendResponse(res, 404, { message: 'Movie not found' });
        }

    } else if (url === '/movies' && method === 'POST') {
        // CREATE new movie
        try {
            const body = await getRequestBody(req);
            const movies = readData();

            const newMovie = {
                id: Date.now().toString(), // Simple ID generation
                title: body.title,
                director: body.director,
                releaseYear: body.releaseYear,
                rating: body.rating,
                review: body.review
            };

            movies.push(newMovie);
            writeData(movies);
            sendResponse(res, 201, newMovie);
        } catch (err) {
            sendResponse(res, 400, { message: 'Invalid JSON body' });
        }

    } else if (url.startsWith('/movies/') && method === 'PUT' && id) {
        // UPDATE movie by ID
        try {
            const body = await getRequestBody(req);
            let movies = readData();
            const index = movies.findIndex(m => m.id === id);

            if (index !== -1) {
                movies[index] = { ...movies[index], ...body, id }; // Ensure ID stays the same
                writeData(movies);
                sendResponse(res, 200, movies[index]);
            } else {
                sendResponse(res, 404, { message: 'Movie not found' });
            }
        } catch (err) {
            sendResponse(res, 400, { message: 'Invalid JSON body' });
        }

    } else {
        // Fallback for unknown routes
        sendResponse(res, 404, { message: 'Route not found' });
    }
});

server.listen(PORT, () => {
    console.log('Server is running on http://localhost:' + PORT);
});
