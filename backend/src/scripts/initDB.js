require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Iniciando teste de conexão com o banco de dados...');

        // Testar a conexão
        await prisma.$connect();
        console.log('Conexão com o banco de dados estabelecida com sucesso');

        // Verificar se o banco de dados tem a tabela Usuario
        try {
            const usuariosCount = await prisma.usuario.count();
            console.log(`Total de usuários no banco: ${usuariosCount}`);

            // Se não houver usuários, criar um usuário administrador padrão
            if (usuariosCount === 0) {
                console.log('Criando usuário administrador padrão...');
                const senhaHash = await bcrypt.hash('senha123', 10);

                const usuario = await prisma.usuario.create({
                    data: {
                        nome: 'Administrador',
                        email: 'admin@example.com',
                        senha: senhaHash,
                        tipo: 'admin'
                    }
                });

                console.log('Usuário administrador criado com sucesso:', {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email
                });
            }
        } catch (error) {
            console.error('Erro ao verificar/criar usuários. O schema do banco de dados pode não estar configurado:', error);
            console.log('Tente executar: npx prisma migrate dev');
        }
    } catch (error) {
        console.error('Erro ao conectar com o banco de dados:', error);
        console.log('Verifique se:');
        console.log('1. O PostgreSQL está instalado e rodando');
        console.log('2. O banco de dados "busao" existe');
        console.log('3. O usuário e senha estão corretos (postgres/admin)');
        console.log('4. A porta 5432 está correta');

        if (!process.env.DATABASE_URL) {
            console.log('\nA variável DATABASE_URL não está definida no .env');
            console.log('URL esperada: postgresql://postgres:admin@localhost:5432/busao?schema=public');
        }
    } finally {
        await prisma.$disconnect();
    }
}

main(); 