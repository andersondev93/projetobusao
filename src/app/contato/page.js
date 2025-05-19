"use client";

import { useState } from "react";
import Header from "../_componentes/Header";
import Footer from "../_componentes/Footer";

export default function ContatoPage() {
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        assunto: "",
        mensagem: ""
    });

    const [enviando, setEnviando] = useState(false);
    const [mensagemEnvio, setMensagemEnvio] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setEnviando(true);

        // Simulação de envio do formulário
        setTimeout(() => {
            setEnviando(false);
            setMensagemEnvio({
                tipo: "sucesso",
                texto: "Mensagem enviada com sucesso! Entraremos em contato em breve."
            });

            // Limpar formulário
            setFormData({
                nome: "",
                email: "",
                assunto: "",
                mensagem: ""
            });

            // Limpar mensagem após 5 segundos
            setTimeout(() => {
                setMensagemEnvio(null);
            }, 5000);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow container-custom py-8">
                {/* Header da página */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary-dark mb-2">
                        Entre em Contato
                    </h1>
                    <p className="text-[#666666] max-w-3xl">
                        Tem dúvidas, sugestões ou precisa de suporte? Preencha o formulário abaixo para falar conosco.
                    </p>
                </div>

                {/* Conteúdo principal */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Formulário de contato */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-2xl font-bold text-primary-dark mb-4">Envie sua mensagem</h2>

                            {mensagemEnvio && (
                                <div className={`p-4 mb-6 rounded-lg ${mensagemEnvio.tipo === "sucesso"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}>
                                    {mensagemEnvio.texto}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label htmlFor="nome" className="block text-sm font-medium text-[#666666] mb-1">
                                            Nome completo*
                                        </label>
                                        <input
                                            type="text"
                                            id="nome"
                                            name="nome"
                                            value={formData.nome}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 rounded-lg border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Seu nome"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-[#666666] mb-1">
                                            E-mail*
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 rounded-lg border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="seu.email@exemplo.com"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="assunto" className="block text-sm font-medium text-[#666666] mb-1">
                                        Assunto*
                                    </label>
                                    <input
                                        type="text"
                                        id="assunto"
                                        name="assunto"
                                        value={formData.assunto}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 rounded-lg border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Assunto da mensagem"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="mensagem" className="block text-sm font-medium text-[#666666] mb-1">
                                        Mensagem*
                                    </label>
                                    <textarea
                                        id="mensagem"
                                        name="mensagem"
                                        value={formData.mensagem}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        className="w-full p-3 rounded-lg border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Digite sua mensagem aqui..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={enviando}
                                    className={`w-full sm:w-auto px-6 py-3 font-medium rounded-lg ${enviando
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-primary hover:bg-primary-dark text-white transition-colors"
                                        }`}
                                >
                                    {enviando ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Enviando...
                                        </span>
                                    ) : "Enviar Mensagem"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Informações de contato */}
                    <div>
                        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                            <h3 className="text-xl font-bold text-primary-dark mb-4">Informações de Contato</h3>

                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <h4 className="font-medium text-[#333333]">E-mail</h4>
                                        <p className="text-[#666666]">contato@vaidebusao.com.br</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <div>
                                        <h4 className="font-medium text-[#333333]">Telefone</h4>
                                        <p className="text-[#666666]">(98) 3333-0000</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div>
                                        <h4 className="font-medium text-[#333333]">Endereço</h4>
                                        <p className="text-[#666666]">Av. dos Holandeses, 1000, São Luís - MA</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary/10 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-primary-dark mb-2">Horário de Atendimento</h3>
                            <p className="text-[#666666] mb-4">
                                Nossa equipe está disponível para atendimento nos seguintes horários:
                            </p>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-[#333333] font-medium">Segunda a Sexta:</span>
                                    <span className="text-[#666666]">8h às 18h</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#333333] font-medium">Sábado:</span>
                                    <span className="text-[#666666]">9h às 13h</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#333333] font-medium">Domingo e Feriados:</span>
                                    <span className="text-[#666666]">Fechado</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mapa */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-primary-dark mb-4">Nossa Localização</h2>
                    <div className="bg-gray-200 rounded-xl h-80 flex items-center justify-center">
                        <p className="text-gray-500">Mapa será carregado em breve</p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
} 