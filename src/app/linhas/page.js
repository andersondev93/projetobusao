"use client";

import { useState, useEffect } from 'react';
import Header from '../_componentes/Header';
import Footer from '../_componentes/Footer';
import LinhaCard from '../_componentes/LinhaCard';
import { linhaService } from '../../services/api';
import Link from 'next/link';

export default function LinhasPage() {
  const [linhas, setLinhas] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarLinhas = async () => {
      try {
        setLoading(true);
        const data = await linhaService.listar();
        setLinhas(data);
      } catch (err) {
        console.error('Erro ao carregar linhas:', err);
        setError('Erro ao carregar as linhas. Por favor, tente novamente.');
      } finally {
        setLoading(false);
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
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link>
          <span className="mx-2">›</span>
          <span className="text-primary">Linhas</span>
        </div>

        {/* Cabeçalho da página */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-dark mb-2">Linhas de Ônibus</h1>
          <p className="text-gray-600">
            Encontre informações sobre todas as linhas de ônibus disponíveis, incluindo horários, pontos de parada e rotas.
          </p>
        </div>

        {/* Barra de pesquisa */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex-grow">
              <label htmlFor="busca" className="block text-sm font-medium text-gray-700 mb-2">
                Pesquisar por linha, nome ou destino
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="busca"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Ex: 123, Centro, Terminal..."
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-4 flex items-center">
              {busca && (
                <button
                  onClick={() => setBusca('')}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-primary"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Resultados */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Carregando linhas...</p>
          </div>
        ) : linhasFiltradas.length > 0 ? (
          <>
            <p className="text-gray-600 mb-6">
              {busca
                ? `Exibindo ${linhasFiltradas.length} ${linhasFiltradas.length === 1 ? 'resultado' : 'resultados'} para "${busca}"`
                : `Mostrando todas as ${linhasFiltradas.length} linhas disponíveis`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {linhasFiltradas.map((linha) => (
                <LinhaCard key={linha.id} linha={linha} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 mb-2">
              Nenhuma linha encontrada com esses termos.
            </p>
            <button
              onClick={() => setBusca('')}
              className="border border-primary text-primary font-medium px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors"
            >
              Limpar busca
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
