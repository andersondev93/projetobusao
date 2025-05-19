const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PontoController {
    async index(req, res) {
        try {
            const pontos = await prisma.ponto.findMany({
                include: {
                    linhas: true
                }
            });

            return res.json(pontos);
        } catch (error) {
            return res.status(400).json({ error: 'Erro ao listar pontos' });
        }
    }

    async store(req, res) {
        try {
            const { nome, endereco, latitude, longitude } = req.body;

            const ponto = await prisma.ponto.create({
                data: {
                    nome,
                    endereco,
                    latitude,
                    longitude
                }
            });

            return res.json(ponto);
        } catch (error) {
            return res.status(400).json({ error: 'Erro ao criar ponto' });
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params;

            const ponto = await prisma.ponto.findUnique({
                where: { id: Number(id) },
                include: {
                    linhas: true
                }
            });

            if (!ponto) {
                return res.status(404).json({ error: 'Ponto não encontrado' });
            }

            return res.json(ponto);
        } catch (error) {
            return res.status(400).json({ error: 'Erro ao buscar ponto' });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, endereco, latitude, longitude } = req.body;

            const ponto = await prisma.ponto.update({
                where: { id: Number(id) },
                data: {
                    nome,
                    endereco,
                    latitude,
                    longitude
                }
            });

            return res.json(ponto);
        } catch (error) {
            return res.status(400).json({ error: 'Erro ao atualizar ponto' });
        }
    }

    async destroy(req, res) {
        try {
            const { id } = req.params;

            await prisma.ponto.delete({
                where: { id: Number(id) }
            });

            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ error: 'Erro ao deletar ponto' });
        }
    }
}

module.exports = new PontoController(); 