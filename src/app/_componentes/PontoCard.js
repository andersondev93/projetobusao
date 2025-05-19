"use client";

import Link from "next/link";

export default function PontoCard({ ponto }) {
    // Função para renderizar ícones de estrutura
    const renderEstruturaIcons = () => {
        const estruturaItems = [
            {
                label: "Cobertura",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                ),
                value: ponto.estrutura.cobertura,
            },
            {
                label: "Assento",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                ),
                value: ponto.estrutura.assento,
            },
            {
                label: "Acessibilidade",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                ),
                value: ponto.estrutura.acessibilidade,
            },
            {
                label: "Iluminação",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                ),
                value: ponto.estrutura.iluminacao,
            },
            {
                label: "Painel",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                ),
                value: ponto.estrutura.painel,
            },
        ];

        return (
            <div className="flex flex-wrap gap-3 mt-3">
                {estruturaItems.map((item, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${item.value
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-500 line-through"
                            }`}
                        title={item.label}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Link href={`/pontos/${ponto.id}`}>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="p-5">
                    <h3 className="font-bold text-lg text-primary-dark mb-1">
                        {ponto.nome}
                    </h3>
                    <p className="text-[#666666] text-sm mb-3 flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{ponto.endereco}</span>
                    </p>

                    <div className="mb-3">
                        <div className="text-sm font-medium text-[#666666] mb-1">Linhas que passam por este ponto:</div>
                        <div className="flex flex-wrap gap-2">
                            {ponto.linhas.map((linha) => (
                                <span key={linha} className="bg-primary-lightest text-primary-dark text-xs font-medium px-2 py-1 rounded-full">
                                    {linha}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3">
                        <div className="text-sm font-medium text-[#666666] mb-1">Estrutura do ponto:</div>
                        {renderEstruturaIcons()}
                    </div>
                </div>
            </div>
        </Link>
    );
} 