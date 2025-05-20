require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

// Define valores padrão para as variáveis de ambiente caso não estejam definidas
if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'busao_project_secret_token';
    console.log('JWT_SECRET não encontrado no .env, usando valor padrão');
}

// Crie o PrismaClient fora do handler (importante para serverless)
global.prisma = global.prisma || new PrismaClient();
const app = require('./app');

// Não precisa conectar manualmente o Prisma em serverless
module.exports = app; 