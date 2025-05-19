const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Configuração CORS mais detalhada
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://projetobusao.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api', routes);

module.exports = app; 