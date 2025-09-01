const express = require('express');
const cors = require('cors');
const api = require('./api'); // Imports the main API router

const app = express();

app.use(cors());
app.use(express.json());

// Use the main router for any path that starts with /api
app.use('/api', api);

module.exports = app;