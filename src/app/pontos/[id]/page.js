"use client";

import { useState, useEffect } from "react";
import Header from "../../_componentes/Header";
import Footer from "../../_componentes/Footer";
import { pontoService } from "../../../services/api";
import { useParams } from "next/navigation";
import Link from "next/link";

import dynamic from "next/dynamic";

const MapaPonto = dynamic(() => import("../../_componentes/MapaPonto"), {
  ssr: false,
});

export default function DetalhesPonto() {
  const { id } = useParams();
  const [ponto, setPonto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPonto = async () => {
      try {
        setLoading(true);
        const data = await pontoService.obter(id);
        setPonto(data);
      } catch (err) {
        console.error("Erro ao carregar detalhes do ponto:", err);
        setError("Não foi possível carregar os detalhes deste ponto.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPonto();
    }
  }, [id]);

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

  if (error || !ponto) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container-custom py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error || "Ponto não encontrado"}</p>
            <Link
              href="/pontos"
              className="text-red-700 font-medium hover:underline mt-2 inline-block"
            >
              ← Voltar para pontos
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
          <Link href="/" className="hover:text-primary">
            Início
          </Link>
          <span className="mx-2">›</span>
          <Link href="/pontos" className="hover:text-primary">
            Pontos
          </Link>
          <span className="mx-2">›</span>
          <span className="text-primary">{ponto.nome}</span>
        </div>

        {/* Cabeçalho do ponto */}
        <div className="bg-primary-lightest rounded-lg p-6 mb-8 border-l-4 border-primary">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary-dark mb-2">
                {ponto.nome}
              </h1>
              <p className="text-gray-600">{ponto.endereco}</p>
            </div>

            <div className="mt-4 md:mt-0">
              <span className="text-sm text-gray-500">
                Atualizado em{" "}
                {ponto.updatedAt
                  ? new Date(ponto.updatedAt).toLocaleDateString()
                  : "hoje"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Informações do Ponto */}
          <div className="col-span-1 card">
            <div className="bg-primary-dark text-white px-4 py-3 rounded-t-lg">
              <h2 className="text-lg font-semibold">Detalhes do Ponto</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Endereço Completo
                  </h3>
                  <p className="mt-1">{ponto.endereco}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Coordenadas
                  </h3>
                  <p className="mt-1">
                    {ponto.latitude}, {ponto.longitude}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Referência
                  </h3>
                  <p className="mt-1">
                    Próximo ao {ponto.endereco.split(",")[0]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Linhas que passam neste ponto */}
          <div className="col-span-1 md:col-span-2 card">
            <div className="bg-primary-dark text-white px-4 py-3 rounded-t-lg">
              <h2 className="text-lg font-semibold">
                Linhas que passam por este ponto ({ponto.linhas?.length || 0})
              </h2>
            </div>
            <div className="p-4">
              {ponto.linhas && ponto.linhas.length > 0 ? (
                <div className="space-y-3">
                  {ponto.linhas.map((linha) => (
                    <div
                      key={linha.id}
                      className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                    >
                      <div className="bg-primary-lightest text-primary px-2 py-1 rounded font-bold mr-3">
                        {linha.numero}
                      </div>
                      <div>
                        <h3 className="font-medium">{linha.nome}</h3>
                        <p className="text-sm text-gray-600">
                          Sentido: {linha.sentido}
                        </p>
                        <div className="mt-1 text-xs text-primary hover:underline">
                          <Link href={`/linhas/${linha.id}`}>
                            Ver detalhes da linha
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 py-4 text-center">
                  Não há linhas cadastradas para este ponto.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mapa (Placeholder) */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Localização no Mapa</h2>
          <MapaPonto ponto={ponto} />
        </div>

        {/* Voltar para lista de pontos */}
        <div className="mt-6">
          <Link
            href="/pontos"
            className="text-primary hover:text-primary-dark font-medium flex items-center"
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
            Voltar para lista de pontos
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
