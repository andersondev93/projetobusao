'use client';

import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiX, FiMapPin, FiTruck, FiUsers, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import { linhaService, pontoService, usuarioService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [linhas, setLinhas] = useState([]);
    const [pontos, setPontos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLinha, setCurrentLinha] = useState(null);
    const [formData, setFormData] = useState({
        numero: '',
        nome: '',
        sentido: '',
        pontos: [],
        horarios: [{ hora: '' }]
    });
    const [stats, setStats] = useState({
        linhas: 0,
        pontos: 0,
        usuarios: 0
    });

    const carregarDados = async () => {
        try {
            setLoading(true);
            setError(null);
            const [linhasData, pontosData] = await Promise.all([
                linhaService.listar(),
                pontoService.listar()
            ]);
            setLinhas(linhasData);
            setPontos(pontosData);

            // Atualizar as estatísticas com os dados reais
            setStats(prev => ({
                ...prev,
                linhas: linhasData.length,
                pontos: pontosData.length
            }));
        } catch (err) {
            console.error('Erro ao carregar dados:', err);
            setError('Erro ao carregar os dados. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    useEffect(() => {
        const carregarEstatisticas = async () => {
            try {
                // Buscar dados reais do backend
                const usuariosData = await usuarioService.listar();

                setStats(prev => ({
                    ...prev,
                    usuarios: usuariosData.length
                }));
            } catch (error) {
                console.error("Erro ao carregar estatísticas de usuários:", error);
            }
        };

        if (!authLoading && isAuthenticated) {
            carregarEstatisticas();
        }
    }, [authLoading, isAuthenticated]);

    const resetForm = () => {
        setFormData({
            numero: '',
            nome: '',
            sentido: '',
            pontos: [],
            horarios: [{ hora: '' }]
        });
        setCurrentLinha(null);
    };

    const openModal = (linha = null) => {
        if (linha) {
            setCurrentLinha(linha);
            setFormData({
                numero: linha.numero,
                nome: linha.nome,
                sentido: linha.sentido,
                pontos: linha.pontos.map(p => p.id),
                horarios: linha.horarios.length > 0
                    ? linha.horarios.map(h => ({ hora: h.hora }))
                    : [{ hora: '' }]
            });
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePontoChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value));
        setFormData(prev => ({
            ...prev,
            pontos: selectedOptions
        }));
    };

    const handleHorarioChange = (index, value) => {
        const newHorarios = [...formData.horarios];
        newHorarios[index] = { hora: value };
        setFormData(prev => ({
            ...prev,
            horarios: newHorarios
        }));
    };

    const addHorario = () => {
        setFormData(prev => ({
            ...prev,
            horarios: [...prev.horarios, { hora: '' }]
        }));
    };

    const removeHorario = (index) => {
        if (formData.horarios.length > 1) {
            const newHorarios = formData.horarios.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                horarios: newHorarios
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Remover horários vazios e garantir que os pontos estejam no formato correto
            const dadosEnvio = {
                ...formData,
                horarios: formData.horarios.filter(h => h.hora.trim() !== ''),
                pontos: formData.pontos.map(id => Number(id)) // Garantir que são números
            };

            console.log('Enviando dados:', dadosEnvio);

            if (currentLinha) {
                await linhaService.atualizar(currentLinha.id, dadosEnvio);
            } else {
                await linhaService.criar(dadosEnvio);
            }
            await carregarDados();
            closeModal();
        } catch (err) {
            console.error('Erro ao salvar linha:', err);
            setError('Erro ao salvar a linha. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta linha?')) {
            try {
                setLoading(true);
                await linhaService.excluir(id);
                await carregarDados();
            } catch (err) {
                console.error('Erro ao excluir linha:', err);
                setError('Erro ao excluir a linha. Por favor, tente novamente.');
            } finally {
                setLoading(false);
            }
        }
    };

    if (authLoading || loading) {
        return (
            <div className="p-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="p-8">
                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
                    <p className="text-yellow-700">
                        Você precisa estar autenticado para acessar esta página.
                    </p>
                    <Link href="/admin/login" className="text-blue-600 hover:underline mt-2 inline-block">
                        Ir para a página de login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Painel Administrativo</h1>
                <p className="text-gray-600">
                    Bem-vindo(a), {user?.nome || 'Administrador'}! Gerencie linhas, pontos e usuários do sistema.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center border-l-4 border-indigo-500">
                    <div className="bg-indigo-100 rounded-full p-3 mr-4">
                        <FiTruck className="text-indigo-600 text-xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Linhas</h3>
                        <p className="text-gray-500">{stats.linhas} linhas cadastradas</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 flex items-center border-l-4 border-green-500">
                    <div className="bg-green-100 rounded-full p-3 mr-4">
                        <FiMapPin className="text-green-600 text-xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Pontos</h3>
                        <p className="text-gray-500">{stats.pontos} pontos cadastrados</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 flex items-center border-l-4 border-purple-500">
                    <div className="bg-purple-100 rounded-full p-3 mr-4">
                        <FiUsers className="text-purple-600 text-xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Usuários</h3>
                        <p className="text-gray-500">{stats.usuarios} usuários cadastrados</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/admin/linhas" className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="p-6 border-b">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Gerenciar Linhas</h3>
                        <p className="text-gray-600">
                            Cadastre, edite ou exclua linhas de ônibus. Defina rotas, horários e pontos de parada.
                        </p>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                        <span className="text-indigo-600 font-medium">Acessar gerenciamento</span>
                        <FiArrowRight className="text-indigo-600" />
                    </div>
                </Link>

                <Link href="/admin/pontos" className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="p-6 border-b">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Gerenciar Pontos</h3>
                        <p className="text-gray-600">
                            Cadastre, edite ou exclua pontos de ônibus. Defina localizações e associe às linhas.
                        </p>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                        <span className="text-indigo-600 font-medium">Acessar gerenciamento</span>
                        <FiArrowRight className="text-indigo-600" />
                    </div>
                </Link>

                <Link href="/admin/usuarios" className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="p-6 border-b">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Gerenciar Usuários</h3>
                        <p className="text-gray-600">
                            Cadastre, edite ou exclua usuários do sistema. Defina perfis e permissões.
                        </p>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                        <span className="text-indigo-600 font-medium">Acessar gerenciamento</span>
                        <FiArrowRight className="text-indigo-600" />
                    </div>
                </Link>
            </div>

            {/* Modal para criar/editar linha */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                        <div className="px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {currentLinha ? 'Editar Linha' : 'Nova Linha'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FiX size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Número
                                    </label>
                                    <input
                                        type="text"
                                        name="numero"
                                        value={formData.numero}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sentido
                                </label>
                                <input
                                    type="text"
                                    name="sentido"
                                    value={formData.sentido}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pontos (Segure CTRL para selecionar múltiplos)
                                </label>
                                <select
                                    multiple
                                    name="pontos"
                                    value={formData.pontos}
                                    onChange={handlePontoChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    size="5"
                                >
                                    {pontos.map(ponto => (
                                        <option key={ponto.id} value={ponto.id}>
                                            {ponto.nome} - {ponto.endereco}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Horários
                                </label>
                                {formData.horarios.map((horario, index) => (
                                    <div key={index} className="flex mb-2">
                                        <input
                                            type="time"
                                            value={horario.hora}
                                            onChange={(e) => handleHorarioChange(index, e.target.value)}
                                            className="flex-grow p-2 border border-gray-300 rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeHorario(index)}
                                            className="ml-2 p-2 text-red-600 hover:text-red-800"
                                        >
                                            <FiX />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addHorario}
                                    className="mt-2 inline-flex items-center px-3 py-1 border border-indigo-300 text-sm leading-4 font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
                                >
                                    <FiPlus className="mr-1" /> Adicionar Horário
                                </button>
                            </div>
                            <div className="flex justify-end mt-6 space-x-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                                    disabled={loading}
                                >
                                    {loading ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
} 