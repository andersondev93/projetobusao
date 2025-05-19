"use client";

import { useState, useEffect } from 'react';
import Header from '../_componentes/Header';
import Footer from '../_componentes/Footer';
import { pontoService } from '../../services/api';
import Link from 'next/link';

export default function PontosPage() {
    const [pontos, setPontos] = useState([]);
    const [busca, setBusca] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const carregarPontos = async () => {
            try {
                setLoading(true);
                const data = await pontoService.listar();
                setPontos(data);
            } catch (err) {
                console.error('Erro ao carregar pontos:', err);
                setError('Erro ao carregar os pontos. Por favor, tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        carregarPontos();
    }, []);

    const pontosFiltrados = pontos.filter(
        (ponto) =>
            ponto.nome?.toLowerCase().includes(busca.toLowerCase()) ||
            ponto.endereco?.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow container-custom py-8">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-600 mb-6">
                    <Link href="/" className="hover:text-primary">Início</Link>
                    <span className="mx-2">›</span>
                    <span className="text-primary">Pontos</span>
                </div>

                {/* Cabeçalho da página */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary-dark mb-2">Pontos de Ônibus</h1>
                    <p className="text-gray-600">
                        Encontre informações sobre todos os pontos de ônibus disponíveis, incluindo endereços e linhas que passam por eles.
                    </p>
                </div>

                {/* Barra de pesquisa */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center">
                        <div className="flex-grow">
                            <label htmlFor="busca" className="block text-sm font-medium text-gray-700 mb-2">
                                Pesquisar por nome ou endereço
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="busca"
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    placeholder="Ex: Centro, Rua Principal..."
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
                        <p className="mt-4 text-gray-600">Carregando pontos...</p>
                    </div>
                ) : pontosFiltrados.length > 0 ? (
                    <>
                        <p className="text-gray-600 mb-6">
                            {busca
                                ? `Exibindo ${pontosFiltrados.length} ${pontosFiltrados.length === 1 ? 'resultado' : 'resultados'} para "${busca}"`
                                : `Mostrando todos os ${pontosFiltrados.length} pontos disponíveis`}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {pontosFiltrados.map((ponto) => (
                                <div key={ponto.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-primary-dark mb-2">{ponto.nome}</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-start">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <p className="text-gray-600">{ponto.endereco}</p>
                                            </div>
                                            <div className="flex items-start">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                </svg>
                                                <p className="text-gray-600">
                                                    {ponto.linhas && ponto.linhas.length > 0
                                                        ? `${ponto.linhas.length} ${ponto.linhas.length === 1 ? 'linha' : 'linhas'} passam aqui`
                                                        : 'Não há linhas cadastradas para este ponto'}
                                                </p>
                                            </div>
                                            <div className="flex items-start">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                </svg>
                                                <p className="text-gray-600">
                                                    {ponto.latitude}, {ponto.longitude}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-5 py-3 bg-gray-50 border-t flex justify-between items-center">
                                        <span className="text-xs text-gray-500">
                                            Atualizado em {ponto.updatedAt ? new Date(ponto.updatedAt).toLocaleDateString() : 'hoje'}
                                        </span>
                                        <Link href={`/pontos/${ponto.id}`} className="text-sm font-medium text-primary hover:underline">
                                            Ver detalhes →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-500 mb-2">
                            Nenhum ponto encontrado com esses termos.
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