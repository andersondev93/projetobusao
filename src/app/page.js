"use client";

import Header from "./_componentes/Header";
import Footer from "./_componentes/Footer";
import LinhaCard from "./_componentes/LinhaCard";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { linhaService } from "../services/api";

export default function Home() {
  const [linhas, setLinhas] = useState([]);
  const [busca, setBusca] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarLinhas = async () => {
      try {
        setIsLoading(true);
        const data = await linhaService.listar();
        setLinhas(data);
      } catch (error) {
        console.error("Erro ao carregar linhas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarLinhas();
  }, []);

  const linhasFiltradas = linhas.filter(
    (linha) =>
      linha.numero?.toLowerCase().includes(busca.toLowerCase()) ||
      linha.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      linha.sentido?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container-custom py-8">
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden mb-12 shadow-lg bg-primary">
          <div className="absolute inset-0 opacity-15 bg-[url('/bus-pattern.png')] bg-repeat"></div>
          <div className="relative z-10 px-6 py-16 md:py-20 md:px-12 flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-white">
              Transporte Público no Maranhão
            </h1>
            <p className="text-xl text-center text-white/90 mb-8 max-w-2xl">
              Encontre facilmente horários, rotas e pontos de ônibus em tempo real nas cidades maranhenses.
            </p>

            <div className="w-full max-w-2xl relative">
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Digite o número da linha, destino ou nome..."
                className="w-full p-4 pl-10 rounded-full border-2 border-white/30 shadow-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-white"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Linhas Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-primary-dark">Linhas Disponíveis</h2>
            {busca && (
              <span className="text-sm text-[#666666]">
                Mostrando resultados para &quot;{busca}&quot;
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-[#666666]">Carregando linhas...</p>
            </div>
          ) : linhasFiltradas.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {linhasFiltradas.slice(0, 3).map((linha) => (
                  <LinhaCard key={linha.id} linha={linha} />
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/linhas"
                  className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-lg transition-colors inline-flex items-center"
                >
                  Ver todas as linhas
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500 mb-2">
                Nenhuma linha encontrada com esses termos.
              </p>
              <button
                onClick={() => setBusca("")}
                className="border border-primary text-primary font-medium px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors"
              >
                Limpar busca
              </button>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full mb-4 bg-primary-lightest">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Horários em Tempo Real</h3>
            <p className="text-[#666666]">Consulte os horários atualizados dos ônibus para planejar sua viagem com precisão.</p>
          </div>

          <div className="card p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full mb-4 bg-primary-lightest">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Rotas Detalhadas</h3>
            <p className="text-[#666666]">Visualize o trajeto completo das linhas de ônibus, com todos os bairros e vias percorridas.</p>
          </div>

          <div className="card p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full mb-4 bg-primary-lightest">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Pontos de Parada</h3>
            <p className="text-[#666666]">Encontre os pontos de ônibus mais próximos de você e veja quais linhas param neles.</p>
          </div>
        </section>


      </main>

      <Footer />
    </div>
  );
}
