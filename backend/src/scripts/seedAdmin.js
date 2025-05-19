const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    try {
        // Verificar se já existe um admin
        const adminExists = await prisma.usuario.findFirst({
            where: {
                email: 'admin@example.com',
                tipo: 'admin'
            }
        });

        if (adminExists) {
            console.log('Usuário administrador já existe!');
            return;
        }

        // Criar um novo admin
        const senhaHash = await bcrypt.hash('senha123', 10);

        const admin = await prisma.usuario.create({
            data: {
                nome: 'Administrador',
                email: 'admin@example.com',
                senha: senhaHash,
                tipo: 'admin'
            }
        });

        console.log('Administrador criado com sucesso:');
        console.log({
            id: admin.id,
            nome: admin.nome,
            email: admin.email,
            tipo: admin.tipo
        });
    } catch (error) {
        console.error('Erro ao criar administrador:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main(); 