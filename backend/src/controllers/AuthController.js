const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

class AuthController {
    async register(req, res) {
        try {
            const { nome, email, senha, tipo } = req.body;

            const usuarioExiste = await prisma.usuario.findUnique({
                where: { email }
            });

            if (usuarioExiste) {
                return res.status(400).json({ error: 'Usuário já existe' });
            }

            const senhaHash = await bcrypt.hash(senha, 10);

            const usuario = await prisma.usuario.create({
                data: {
                    nome,
                    email,
                    senha: senhaHash,
                    tipo
                }
            });

            usuario.senha = undefined;

            return res.json(usuario);
        } catch (error) {
            return res.status(400).json({ error: 'Erro ao registrar usuário' });
        }
    }

    async login(req, res) {
        try {
            const { email, senha } = req.body;
            console.log('Tentativa de login:', { email });

            const usuario = await prisma.usuario.findUnique({
                where: { email }
            });

            if (!usuario) {
                console.log('Usuário não encontrado:', email);
                return res.status(400).json({ error: 'Usuário não encontrado' });
            }

            console.log('Usuário encontrado:', { id: usuario.id, email: usuario.email });

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            console.log('Senha válida?', senhaValida);

            if (!senhaValida) {
                return res.status(400).json({ error: 'Senha inválida' });
            }

            usuario.senha = undefined;

            console.log('JWT_SECRET disponível?', !!process.env.JWT_SECRET);

            const token = jwt.sign(
                { id: usuario.id, tipo: usuario.tipo },
                process.env.JWT_SECRET || 'busao_project_secret_token',
                { expiresIn: '1d' }
            );

            console.log('Token gerado com sucesso');

            return res.json({ usuario, token });
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            return res.status(400).json({ error: 'Erro ao fazer login' });
        }
    }
}

module.exports = new AuthController(); 