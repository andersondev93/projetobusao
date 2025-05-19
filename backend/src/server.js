require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

// Define valores padrão para as variáveis de ambiente caso não estejam definidas
if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'busao_project_secret_token';
    console.log('JWT_SECRET não encontrado no .env, usando valor padrão');
}

const app = require('./app');
const prisma = new PrismaClient();

// Conecta o Prisma ao iniciar (opcional, mas recomendado para serverless)
prisma.$connect().then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso');
}).catch((error) => {
    console.error('Erro ao conectar com o banco de dados:', error);
    console.log('URL do banco de dados:', process.env.DATABASE_URL || 'Não definido');
});

// Exporta o app para a Vercel usar como handler
module.exports = app; 