import Header from "../_componentes/Header";
import Footer from "../_componentes/Footer";
import Link from "next/link";

export default function SobrePage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow container-custom py-8">
                {/* Header da página */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary-dark mb-2">
                        Sobre o Vai de Busão
                    </h1>
                    <p className="text-[#666666] max-w-3xl">
                        Conheça mais sobre o projeto que está transformando a mobilidade urbana em São Luís do Maranhão.
                    </p>
                </div>

                {/* Conteúdo principal */}
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <h2 className="text-2xl font-bold text-primary-dark mb-4">Nossa Missão</h2>
                            <p className="text-[#666666] mb-4">
                                O Vai de Busão é uma iniciativa dedicada a melhorar a experiência de transporte público
                                em São Luís do Maranhão. Nosso objetivo é fornecer informações precisas e atualizadas
                                sobre linhas de ônibus, pontos de parada e horários, ajudando os cidadãos a se deslocarem
                                pela cidade com mais facilidade e eficiência.
                            </p>

                            <p className="text-[#666666] mb-4">
                                Acreditamos que um sistema de transporte público bem informado é essencial para uma cidade
                                mais acessível e sustentável. Por isso, trabalhamos em parceria com o MOB Maranhão para
                                garantir dados confiáveis e atualizados, facilitando o dia a dia dos usuários.
                            </p>

                            <h2 className="text-2xl font-bold text-primary-dark mt-8 mb-4">Nossa História</h2>
                            <p className="text-[#666666] mb-4">
                                O projeto Vai de Busão nasceu em 2025, quando um grupo de desenvolvedores
                                maranhenses identificou a dificuldade dos cidadãos em encontrar informações sobre o
                                transporte público local. A partir dessa necessidade, decidimos criar uma solução digital
                                que centralizasse todas as informações necessárias para os usuários.
                            </p>

                            <p className="text-[#666666]">
                                Começamos com um aplicativo simples, contendo apenas dados básicos sobre as principais
                                linhas. Com o tempo, expandimos nossa plataforma para incluir mapas interativos, alertas
                                de horários, informações sobre tarifa e acessibilidade, consolidando-nos como uma
                                ferramenta essencial para quem utiliza o transporte público em São Luís.
                            </p>
                        </div>

                        <div className="bg-gray-100 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-primary-dark mb-4">Nossos Números</h3>

                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-lg">
                                    <span className="text-3xl font-bold text-primary-dark">10+</span>
                                    <p className="text-[#666666]">Linhas de ônibus cadastradas</p>
                                </div>

                                <div className="bg-white p-4 rounded-lg">
                                    <span className="text-3xl font-bold text-primary-dark">50+</span>
                                    <p className="text-[#666666]">Pontos de ônibus mapeados</p>
                                </div>

                                <div className="bg-white p-4 rounded-lg">
                                    <span className="text-3xl font-bold text-primary-dark">10k+</span>
                                    <p className="text-[#666666]">Usuários mensais</p>
                                </div>

                                <div className="bg-white p-4 rounded-lg">
                                    <span className="text-3xl font-bold text-primary-dark">4.8</span>
                                    <p className="text-[#666666]">Avaliação média do aplicativo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Equipe */}
                <h2 className="text-2xl font-bold text-primary-dark mb-4">Nossa Equipe</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { nome: "Carlos Eduardo", cargo: "Desenvolvedor front-end", foto: "https://via.placeholder.com/150" },
                        { nome: "Iago Lima", cargo: "Desenvolvedor full-stack", foto: "https://via.placeholder.com/150" },
                        { nome: "Anderson Gonçalves", cargo: "Desenvolvedor full-stack", foto: "https://via.placeholder.com/150" },
                        { nome: "Vitor Emanuel", cargo: "Desenvolvedor back-end", foto: "https://via.placeholder.com/150" },

                    ].map((membro, index) => (
                        <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md">
                            <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-primary-dark">{membro.nome}</h3>
                                <p className="text-[#666666] text-sm">{membro.cargo}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </main>

            <Footer />
        </div>
    );
} 