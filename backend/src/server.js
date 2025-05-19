require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

// Define valores padrão para as variáveis de ambiente caso não estejam definidas
if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'busao_project_secret_token';
    console.log('JWT_SECRET não encontrado no .env, usando valor padrão');
}

const app = require('./app');
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3333;

// Verificar a conexão com o banco de dados antes de iniciar o servidor
async function startServer() {
    try {
        // Testar a conexão com o banco de dados
        await prisma.$connect();
        console.log('Conexão com o banco de dados estabelecida com sucesso');

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            console.log('Variáveis de ambiente carregadas:', {
                PORT,
                JWT_SECRET_EXISTS: !!process.env.JWT_SECRET
            });
        });
    } catch (error) {
        console.error('Erro ao conectar com o banco de dados:', error);
        console.log('URL do banco de dados:', process.env.DATABASE_URL || 'Não definido');
        console.log('Verifique se o PostgreSQL está instalado e rodando, e se as credenciais estão corretas');

        // Desconecta o Prisma e encerra o processo
        await prisma.$disconnect();
        process.exit(1);
    }
}

startServer(); 