require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  try {
    // Cria usuário admin se não existir
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: "admin@example.com" },
    });

    if (!usuarioExistente) {
      const senha = await bcrypt.hash("senha123", 10);
      await prisma.usuario.create({
        data: {
          nome: "Administrador",
          email: "admin@example.com",
          senha: senha,
          tipo: "admin",
        },
      });
      console.log("Usuário de teste criado com sucesso");
    } else {
      console.log("Usuário de teste já existe");
    }

    // Verifica se já existe linha cadastrada
    const linhasExistentes = await prisma.linha.findMany();
    if (linhasExistentes.length > 0) {
      console.log("Linhas já estão cadastradas");
      return;
    }

    // Cria pontos
    const ponto1 = await prisma.ponto.create({
      data: {
        nome: "Ponto Central",
        endereco: "Av. Principal, 100",
        latitude: -23.5505,
        longitude: -46.6333,
      },
    });

    const ponto2 = await prisma.ponto.create({
      data: {
        nome: "Ponto Bairro",
        endereco: "Rua das Flores, 200",
        latitude: -23.5522,
        longitude: -46.63,
      },
    });

    // Cria linha com horários e pontos
    const linha = await prisma.linha.create({
      data: {
        numero: "101",
        nome: "Centro - Bairro",
        sentido: "ida",
        cor: "azul",
        passagem: "4.50",
        horarioOperacao: "05:00 - 22:00",
        pontos: {
          connect: [{ id: ponto1.id }, { id: ponto2.id }],
        },
        horarios: {
          create: [
            { hora: "06:00", diasSemana: "seg-sex" },
            { hora: "12:00", diasSemana: "seg-sex" },
          ],
        },
      },
    });

    console.log("Linha de ônibus criada:", linha.numero);
  } catch (error) {
    console.error("Erro ao executar seed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
