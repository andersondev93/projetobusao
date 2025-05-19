const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class LinhaController {
  async index(req, res) {
    try {
      console.log("Requisição recebida para listar linhas");
      console.log("Headers:", req.headers);

      const linhas = await prisma.linha.findMany({
        include: {
          horarios: true,
          pontos: true,
        },
      });

      console.log(`Total de ${linhas.length} linhas encontradas`);

      return res.json(linhas);
    } catch (error) {
      console.error("Erro ao listar linhas:", error);
      return res.status(400).json({ error: "Erro ao listar linhas" });
    }
  }

  async store(req, res) {
    try {
      const {
        numero,
        nome,
        sentido,
        horarios,
        pontos,
        cor,
        passagem,
        horarioOperacao,
      } = req.body;

      console.log("Dados recebidos para criação:", {
        numero,
        nome,
        sentido,
        cor,
        passagem,
        horarioOperacao,
        horarios: JSON.stringify(horarios),
        pontos: JSON.stringify(pontos),
      });

      const linha = await prisma.linha.create({
        data: {
          numero,
          nome,
          sentido,
          cor,
          passagem,
          horarioOperacao,
          horarios: {
            create: horarios,
          },
          pontos: {
            connect: pontos.map((ponto) => {
              // Se ponto for um objeto com propriedade id, use essa propriedade
              // Caso contrário, assume que ponto é o próprio id
              const pontoId = ponto.id !== undefined ? ponto.id : ponto;
              return { id: Number(pontoId) };
            }),
          },
        },
        include: {
          horarios: true,
          pontos: true,
        },
      });

      return res.json(linha);
    } catch (error) {
      console.error("Erro ao criar linha:", error);
      return res.status(400).json({ error: "Erro ao criar linha" });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;

      const linha = await prisma.linha.findUnique({
        where: { id: Number(id) },
        include: {
          horarios: true,
          pontos: true,
        },
      });

      if (!linha) {
        return res.status(404).json({ error: "Linha não encontrada" });
      }

      return res.json(linha);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao buscar linha" });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        numero,
        nome,
        sentido,
        horarios,
        pontos,
        cor,
        passagem,
        horarioOperacao,
      } = req.body;

      console.log("Dados recebidos para atualização:", {
        id,
        numero,
        nome,
        sentido,
        cor,
        passagem,
        horarioOperacao,
        horarios: JSON.stringify(horarios),
        pontos: JSON.stringify(pontos),
      });

      const linha = await prisma.linha.update({
        where: { id: Number(id) },
        data: {
          numero,
          nome,
          sentido,
          cor,
          passagem,
          horarioOperacao,
          horarios: {
            deleteMany: {},
            create: horarios,
          },
          pontos: {
            set: pontos.map((ponto) => {
              // Se ponto for um objeto com propriedade id, use essa propriedade
              // Caso contrário, assume que ponto é o próprio id
              const pontoId = ponto.id !== undefined ? ponto.id : ponto;
              return { id: Number(pontoId) };
            }),
          },
        },
        include: {
          horarios: true,
          pontos: true,
        },
      });

      return res.json(linha);
    } catch (error) {
      console.error("Erro ao atualizar linha:", error);
      return res.status(400).json({ error: "Erro ao atualizar linha" });
    }
  }

  async destroy(req, res) {
    try {
      const { id } = req.params;
      console.log(`Requisição para excluir linha id: ${id}`);

      // Verificar se a linha existe
      const linhaExiste = await prisma.linha.findUnique({
        where: { id: Number(id) },
        include: {
          horarios: true,
          pontos: true,
        },
      });

      if (!linhaExiste) {
        console.log(`Linha id ${id} não encontrada para exclusão`);
        return res.status(404).json({ error: "Linha não encontrada" });
      }

      console.log(`Excluindo linha ${id} - ${linhaExiste.nome}`);
      console.log(`Horários vinculados: ${linhaExiste.horarios.length}`);
      console.log(`Pontos vinculados: ${linhaExiste.pontos.length}`);

      // Excluir a linha com seus horários em cascata
      // e desvinculá-la dos pontos (a relação será removida, mas os pontos continuarão existindo)
      await prisma.$transaction([
        // Primeiro excluir os horários
        prisma.horario.deleteMany({
          where: { linhaId: Number(id) },
        }),
        // Depois excluir a linha
        prisma.linha.delete({
          where: { id: Number(id) },
        }),
      ]);

      console.log(`Linha ${id} excluída com sucesso`);
      return res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar linha:", error);
      return res.status(400).json({
        error: "Erro ao deletar linha",
        details: error.message,
      });
    }
  }
}

module.exports = new LinhaController();
