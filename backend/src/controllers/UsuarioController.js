const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

class UsuarioController {
    async index(req, res) {
        try {
            console.log('Requisição recebida para listar usuários');
            console.log('Headers:', req.headers);

            const usuarios = await prisma.usuario.findMany({
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    tipo: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            console.log(`Total de ${usuarios.length} usuários encontrados`);

            return res.json(usuarios);
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            return res.status(400).json({ error: 'Erro ao listar usuários' });
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params;

            const usuario = await prisma.usuario.findUnique({
                where: { id: Number(id) },
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    tipo: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            return res.json(usuario);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            return res.status(400).json({ error: 'Erro ao buscar usuário' });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, senha, tipo } = req.body;

            // Verificar se o email já está em uso por outro usuário
            if (email) {
                const usuarioExistente = await prisma.usuario.findFirst({
                    where: {
                        email,
                        id: {
                            not: Number(id)
                        }
                    }
                });

                if (usuarioExistente) {
                    return res.status(400).json({ error: 'Email já está em uso por outro usuário' });
                }
            }

            // Dados para atualização
            const atualizacao = {
                nome,
                email,
                tipo
            };

            // Se uma nova senha foi fornecida, faz o hash
            if (senha) {
                atualizacao.senha = await bcrypt.hash(senha, 10);
            }

            const usuario = await prisma.usuario.update({
                where: { id: Number(id) },
                data: atualizacao,
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    tipo: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            return res.json(usuario);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            return res.status(400).json({ error: 'Erro ao atualizar usuário' });
        }
    }

    async destroy(req, res) {
        try {
            const { id } = req.params;

            await prisma.usuario.delete({
                where: { id: Number(id) }
            });

            return res.status(204).send();
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            return res.status(400).json({ error: 'Erro ao deletar usuário' });
        }
    }
}

module.exports = new UsuarioController(); 