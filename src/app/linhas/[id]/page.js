"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../_componentes/Header";
import Footer from "../../_componentes/Footer";
import { linhaService, pontoService } from "../../../services/api";
import { useParams } from "next/navigation";

import dynamic from "next/dynamic";
const MapaRota = dynamic(() => import("../../_componentes/MapaRota"), {
  ssr: false,
});

export default function DetalhesLinha() {
  const { id } = useParams();
  const [linha, setLinha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLinha = async () => {
      try {
        setLoading(true);
        const data = await linhaService.obter(id);
        setLinha(data);
      } catch (err) {
        console.error("Erro ao carregar detalhes da linha:", err);
        setError("Não foi possível carregar os detalhes desta linha.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLinha();
    }
  }, [id]);

  // Função para definir as classes do Tailwind baseadas na cor da linha
  const getColorClasses = (color) => {
    const colors = {
      blue: {
        border: "border-primary",
        bg: "bg-primary-lightest",
        text: "text-primary-dark",
        badge: "bg-primary text-white",
        darker: "bg-primary-dark",
      },
      green: {
        border: "border-green-700",
        bg: "bg-green-100",
        text: "text-green-800",
        badge: "bg-green-600 text-white",
        darker: "bg-green-600",
      },
      red: {
        border: "border-red-700",
        bg: "bg-red-100",
        text: "text-red-800",
        badge: "bg-red-600 text-white",
        darker: "bg-red-600",
      },
      purple: {
        border: "border-purple-700",
        bg: "bg-purple-100",
        text: "text-purple-800",
        badge: "bg-purple-600 text-white",
        darker: "bg-purple-600",
      },
      orange: {
        border: "border-orange-700",
        bg: "bg-orange-100",
        text: "text-orange-800",
        badge: "bg-orange-600 text-white",
        darker: "bg-orange-600",
      },
      teal: {
        border: "border-teal-700",
        bg: "bg-teal-100",
        text: "text-teal-800",
        badge: "bg-teal-600 text-white",
        darker: "bg-teal-600",
      },
      default: {
        border: "border-primary",
        bg: "bg-primary-lightest",
        text: "text-primary-dark",
        badge: "bg-primary text-white",
        darker: "bg-primary-dark",
      },
    };

    return colors[color] || colors.default;
  };

  const colorClasses = getColorClasses(linha?.cor || "default");

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container-custom py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !linha) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container-custom py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error || "Linha não encontrada"}</p>
            <Link
              href="/linhas"
              className="text-red-700 font-medium hover:underline mt-2 inline-block"
            >
              ← Voltar para linhas
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container-custom py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <Link href="/" className={`hover:${colorClasses.text}`}>
            Início
          </Link>
          <span className="mx-2">›</span>
          <Link href="/linhas" className={`hover:${colorClasses.text}`}>
            Linhas
          </Link>
          <span className="mx-2">›</span>
          <span className={colorClasses.text}>
            {linha.numero} - {linha.nome}
          </span>
        </div>

        {/* Cabeçalho da linha */}
        <div
          className={`${colorClasses.bg} rounded-lg p-6 mb-8 border-l-4 ${colorClasses.border}`}
        >
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <div className="flex items-center mb-2">
                <span
                  className={`font-bold text-sm px-3 py-1 rounded-full mr-3 ${colorClasses.badge}`}
                >
                  {linha.numero}
                </span>
                <h1 className={`text-2xl font-bold ${colorClasses.text}`}>
                  {linha.nome}
                </h1>
              </div>
              <p className="text-gray-600">Sentido: {linha.sentido}</p>
              {linha.passagem && (
                <p className="text-gray-600 mt-1">
                  Valor da passagem: {linha.passagem}
                </p>
              )}
              {linha.horarioOperacao && (
                <p className="text-gray-600 mt-1">
                  Horário de operação: {linha.horarioOperacao}
                </p>
              )}
            </div>

            <div className="mt-4 md:mt-0">
              <span className="text-sm text-gray-500">
                Atualizado em{" "}
                {linha.updatedAt
                  ? new Date(linha.updatedAt).toLocaleDateString()
                  : "hoje"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Horários */}
          <div className="col-span-1 card">
            <div
              className={`${colorClasses.darker} text-white px-4 py-3 rounded-t-lg`}
            >
              <h2 className="text-lg font-semibold">Horários de Partida</h2>
            </div>
            <div className="p-4">
              {linha.horarios && linha.horarios.length > 0 ? (
                <ul className="space-y-2">
                  {linha.horarios.map((horario, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                    >
                      <span className="font-medium">{horario.hora}</span>
                      <span className="text-xs text-gray-500">
                        {horario.diasSemana === "Todos"
                          ? "Todos os dias"
                          : horario.diasSemana || "Seg-Sex"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 py-4 text-center">
                  Não há horários cadastrados.
                </p>
              )}
            </div>
          </div>

          {/* Pontos de Ônibus */}
          <div className="col-span-1 md:col-span-2 card">
            <div
              className={`${colorClasses.darker} text-white px-4 py-3 rounded-t-lg`}
            >
              <h2 className="text-lg font-semibold">
                Pontos de Ônibus ({linha.pontos?.length || 0})
              </h2>
            </div>
            <div className="p-4">
              {linha.pontos && linha.pontos.length > 0 ? (
                <div className="space-y-3">
                  {linha.pontos.map((ponto, index) => (
                    <div
                      key={ponto.id}
                      className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${colorClasses.bg} ${colorClasses.text} font-bold mr-3`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{ponto.nome}</h3>
                        <p className="text-sm text-gray-600">
                          {ponto.endereco}
                        </p>
                        <div
                          className={`mt-1 text-xs ${colorClasses.text} hover:underline`}
                        >
                          <Link href={`/pontos/${ponto.id}`}>
                            Ver detalhes do ponto
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 py-4 text-center">
                  Não há pontos cadastrados para esta linha.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mapa da rota */}
        <div className="card p-4 mb-8">
          <h2 className="text-xl font-bold mb-4">Mapa da Rota</h2>
          <div className="h-96 w-full rounded-lg overflow-hidden">
            <MapaRota pontos={linha.pontos} />
          </div>
        </div>

        {/* Voltar para lista de linhas */}
        <div className="mt-6">
          <Link
            href="/linhas"
            className={`${colorClasses.text} hover:underline font-medium flex items-center`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Voltar para lista de linhas
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
