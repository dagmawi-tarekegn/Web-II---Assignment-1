# Movie Review API - Web II Assignment 1

A simple REST API for managing movie reviews built using Node.js core modules (`http` and `fs`).

## Features
- **Create**: Add a new movie review.
- **Read**: Retrieve all reviews or a single review by ID.
- **Update**: Modify an existing review.
- **Delete**: Remove a review.

## Tech Stack
- Node.js (Core modules: `http`, `fs`, `path`)
- No external frameworks (like Express)

## Setup
1. Clone the repository.
2. Run the server:
   ```bash
   node server.js
   ```
3. The server will be running on `http://localhost:3000`.

## API Endpoints
- `GET /movies` - Get all movies
- `GET /movies/:id` - Get a specific movie by ID
- `POST /movies` - Add a new movie
- `PUT /movies/:id` - Update a movie
- `DELETE /movies/:id` - Delete a movie
