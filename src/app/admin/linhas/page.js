'use client';

import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { linhaService, pontoService } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LinhasPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [linhas, setLinhas] = useState([]);
    const [pontos, setPontos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLinha, setCurrentLinha] = useState(null);
    const [selectedPontos, setSelectedPontos] = useState([]);
    const [formData, setFormData] = useState({
        numero: '',
        nome: '',
        sentido: '',
        cor: 'default',
        passagem: '',
        horarioOperacao: ''
    });
    const [horarios, setHorarios] = useState([{ hora: '', diasSemana: 'Seg-Sex' }]);

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

    const resetForm = () => {
        setFormData({
            numero: '',
            nome: '',
            sentido: '',
            cor: 'default',
            passagem: '',
            horarioOperacao: ''
        });
        setSelectedPontos([]);
        setHorarios([{ hora: '', diasSemana: 'Seg-Sex' }]);
        setCurrentLinha(null);
    };

    const openModal = (linha = null) => {
        if (linha) {
            setCurrentLinha(linha);
            setFormData({
                numero: linha.numero,
                nome: linha.nome,
                sentido: linha.sentido,
                cor: linha.cor || 'default',
                passagem: linha.passagem || '',
                horarioOperacao: linha.horarioOperacao || ''
            });
            setSelectedPontos(linha.pontos?.map(p => Number(p.id)) || []);
            setHorarios(linha.horarios?.length > 0
                ? linha.horarios.map(h => ({
                    hora: h.hora,
                    diasSemana: ajustarDiasSemana(h.diasSemana)
                }))
                : [{ hora: '', diasSemana: 'Seg-Sex' }]);
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const ajustarDiasSemana = (diasSemana) => {
        if (!diasSemana) return 'Seg-Sex';
        if (diasSemana === 'Sáb' || diasSemana === 'Dom') return 'Sáb-Dom';
        if (diasSemana === 'Todos') return 'Todos os dias';
        return diasSemana;
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

    const handlePontoChange = (pontoId) => {
        const numericId = Number(pontoId);
        setSelectedPontos(prev => {
            if (prev.includes(numericId)) {
                return prev.filter(id => id !== numericId);
            } else {
                return [...prev, numericId];
            }
        });
    };

    const handleHorarioChange = (index, field, value) => {
        const novosHorarios = [...horarios];
        novosHorarios[index] = {
            ...novosHorarios[index],
            [field]: value
        };
        setHorarios(novosHorarios);
    };

    const adicionarHorario = () => {
        setHorarios([...horarios, { hora: '', diasSemana: 'Seg-Sex' }]);
    };

    const removerHorario = (index) => {
        if (horarios.length > 1) {
            const novosHorarios = horarios.filter((_, i) => i !== index);
            setHorarios(novosHorarios);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            setError("Você precisa estar autenticado para realizar esta ação. Por favor, faça login novamente.");
            return;
        }

        try {
            setLoading(true);

            // Verificar se há token de autenticação
            const token = localStorage.getItem('@Busao:token');
            if (!token) {
                setError("Sessão expirada ou token não encontrado. Por favor, faça login novamente.");
                setTimeout(() => {
                    router.push('/admin/login');
                }, 2000);
                return;
            }

            // Filtrar horários vazios
            const horariosPreenchidos = horarios
                .filter(h => h.hora.trim() !== '')
                .map(h => ({
                    ...h,
                    diasSemana: normalizarDiasSemana(h.diasSemana)
                }));

            const dadosLinha = {
                ...formData,
                horarios: horariosPreenchidos,
                pontos: selectedPontos.map(id => ({ id: Number(id) }))
            };

            console.log('Enviando dados para o backend:', dadosLinha);
            console.log('Token disponível:', !!token);

            if (currentLinha) {
                await linhaService.atualizar(currentLinha.id, dadosLinha);
            } else {
                await linhaService.criar(dadosLinha);
            }
            await carregarDados();
            closeModal();
        } catch (err) {
            console.error('Erro ao salvar linha:', err);

            if (err.response && err.response.status === 401) {
                setError('Erro de autenticação. Por favor, faça login novamente.');
                setTimeout(() => {
                    router.push('/admin/login');
                }, 2000);
            } else {
                setError(`Erro ao salvar a linha: ${err.message || 'Verifique sua conexão com o servidor'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const normalizarDiasSemana = (diasSemana) => {
        if (diasSemana === 'Todos os dias') return 'Todos';
        return diasSemana;
    };

    const handleDelete = async (id) => {
        if (!isAuthenticated) {
            setError("Você precisa estar autenticado para realizar esta ação.");
            return;
        }

        try {
            // Validar o ID
            if (!id || isNaN(Number(id))) {
                setError(`ID inválido: ${id}. Não é possível excluir esta linha.`);
                return;
            }

            // Confirmar a exclusão
            if (!window.confirm(`Tem certeza que deseja excluir a linha ${id}?`)) {
                return; // Usuário cancelou a operação
            }

            setLoading(true);
            setError(null);

            // Verificar se há token de autenticação
            const token = localStorage.getItem('@Busao:token');
            if (!token) {
                setError("Sessão expirada ou token não encontrado. Por favor, faça login novamente.");
                setTimeout(() => {
                    router.push('/admin/login');
                }, 2000);
                return;
            }

            // Encontrar a linha pelo ID para mostrar informações na confirmação
            const linhaParaExcluir = linhas.find(linha => linha.id === id);
            console.log('Excluindo linha:', linhaParaExcluir ? `${linhaParaExcluir.numero} - ${linhaParaExcluir.nome}` : id);

            await linhaService.excluir(id);
            console.log('Atualizando a lista após exclusão');
            await carregarDados();

        } catch (err) {
            console.error('Erro detalhado ao excluir linha:', err);

            let mensagemErro = 'Erro ao excluir a linha.';

            // Tratar erros específicos baseados no código de status
            if (err.response) {
                if (err.response.status === 401) {
                    mensagemErro = 'Erro de autenticação. Por favor, faça login novamente.';
                    setTimeout(() => {
                        router.push('/admin/login');
                    }, 2000);
                } else if (err.response.status === 404) {
                    mensagemErro = 'Linha não encontrada. A página será atualizada.';
                    setTimeout(() => {
                        carregarDados();
                    }, 1500);
                } else if (err.response.status === 400) {
                    // Tentar extrair detalhes do erro
                    const detalhes = err.response.data?.details || err.response.data?.error || '';
                    if (detalhes.includes('foreign key constraint')) {
                        mensagemErro = 'Não foi possível excluir a linha porque existem registros dependentes.';
                    } else {
                        mensagemErro = `Erro ao excluir: ${detalhes}`;
                    }
                } else {
                    mensagemErro = `Erro ao excluir a linha: ${err.response.data?.error || err.message}`;
                }
            } else {
                mensagemErro = `Erro ao excluir a linha: ${err.message || 'Verifique sua conexão com o servidor'}`;
            }

            setError(mensagemErro);
        } finally {
            setLoading(false);
        }
    };

    if (loading && linhas.length === 0) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Gerenciamento de Linhas</h1>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gerenciamento de Linhas</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
                >
                    <FiPlus className="mr-2" /> Nova Linha
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Número
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nome
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sentido
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pontos
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {linhas.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                    Nenhuma linha cadastrada.
                                </td>
                            </tr>
                        ) : (
                            linhas.map(linha => (
                                <tr key={linha.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {linha.numero}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {linha.nome}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {linha.sentido}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {linha.pontos?.length || 0} pontos
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => openModal(linha)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        >
                                            <FiEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(linha.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal para criar/editar linha */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-start justify-center p-2 pt-10 z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-3xl my-4 relative flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pt-1 z-10">
                            <h2 className="text-xl font-bold">
                                {currentLinha ? 'Editar Linha' : 'Nova Linha'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                <FiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 pr-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numero">
                                        Número
                                    </label>
                                    <input
                                        id="numero"
                                        name="numero"
                                        type="text"
                                        required
                                        value={formData.numero}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nome">
                                        Nome
                                    </label>
                                    <input
                                        id="nome"
                                        name="nome"
                                        type="text"
                                        required
                                        value={formData.nome}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sentido">
                                        Sentido
                                    </label>
                                    <input
                                        id="sentido"
                                        name="sentido"
                                        type="text"
                                        required
                                        value={formData.sentido}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passagem">
                                        Valor da Passagem
                                    </label>
                                    <input
                                        id="passagem"
                                        name="passagem"
                                        type="text"
                                        placeholder="Ex: R$ 4,50"
                                        value={formData.passagem}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cor">
                                        Cor
                                    </label>
                                    <select
                                        id="cor"
                                        name="cor"
                                        value={formData.cor}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        <option value="default">Azul (Padrão)</option>
                                        <option value="green">Verde</option>
                                        <option value="red">Vermelho</option>
                                        <option value="purple">Roxo</option>
                                        <option value="orange">Laranja</option>
                                        <option value="teal">Teal</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="horarioOperacao">
                                        Horário de Operação
                                    </label>
                                    <input
                                        id="horarioOperacao"
                                        name="horarioOperacao"
                                        type="text"
                                        placeholder="Ex: 05:00-23:00"
                                        value={formData.horarioOperacao}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Horários
                                </label>
                                <div className="mb-2">
                                    {horarios.map((horario, index) => (
                                        <div key={index} className="flex mb-2 items-center">
                                            <div className="flex-1 mr-2">
                                                <input
                                                    type="time"
                                                    value={horario.hora}
                                                    onChange={(e) => handleHorarioChange(index, 'hora', e.target.value)}
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                />
                                            </div>
                                            <div className="flex-1 mr-2">
                                                <select
                                                    value={horario.diasSemana}
                                                    onChange={(e) => handleHorarioChange(index, 'diasSemana', e.target.value)}
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                >
                                                    <option value="Seg-Sex">Segunda a Sexta</option>
                                                    <option value="Sáb-Dom">Sábados e Domingos</option>
                                                    <option value="Todos os dias">Todos os dias</option>
                                                </select>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removerHorario(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <FiX />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={adicionarHorario}
                                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                                >
                                    <FiPlus className="mr-1" /> Adicionar Horário
                                </button>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Pontos de Parada ({selectedPontos.length} selecionados)
                                </label>
                                <div className="border rounded p-3">
                                    {pontos.length === 0 ? (
                                        <p className="text-gray-500">Nenhum ponto disponível</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {pontos.map(ponto => (
                                                <div key={ponto.id} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`ponto-${ponto.id}`}
                                                        checked={selectedPontos.includes(Number(ponto.id))}
                                                        onChange={() => handlePontoChange(ponto.id)}
                                                        className="mr-2"
                                                    />
                                                    <label htmlFor={`ponto-${ponto.id}`} className="text-sm">
                                                        {ponto.nome} - {ponto.endereco}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
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