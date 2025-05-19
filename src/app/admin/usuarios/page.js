'use client';

import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { usuarioService } from '../../../services/api';

export default function UsuariosPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUsuario, setCurrentUsuario] = useState(null);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        tipo: 'voluntario'
    });

    const carregarDados = async () => {
        try {
            setLoading(true);
            setError(null);
            const usuariosData = await usuarioService.listar();
            setUsuarios(usuariosData);
        } catch (err) {
            console.error('Erro ao carregar usuários:', err);
            setError('Erro ao carregar os usuários. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    const resetForm = () => {
        setFormData({
            nome: '',
            email: '',
            senha: '',
            tipo: 'voluntario'
        });
        setCurrentUsuario(null);
    };

    const openModal = (usuario = null) => {
        if (usuario) {
            setCurrentUsuario(usuario);
            setFormData({
                nome: usuario.nome,
                email: usuario.email,
                senha: '',
                tipo: usuario.tipo
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const dadosEnvio = { ...formData };

            // Se estiver editando um usuário existente e a senha estiver vazia, não envie o campo
            if (currentUsuario && !dadosEnvio.senha) {
                delete dadosEnvio.senha;
            }

            if (currentUsuario) {
                await usuarioService.atualizar(currentUsuario.id, dadosEnvio);
            } else {
                await usuarioService.criar(dadosEnvio);
            }
            await carregarDados();
            closeModal();
        } catch (err) {
            console.error('Erro ao salvar usuário:', err);
            setError('Erro ao salvar o usuário. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                setLoading(true);
                await usuarioService.excluir(id);
                await carregarDados();
            } catch (err) {
                console.error('Erro ao excluir usuário:', err);
                setError('Erro ao excluir o usuário. Por favor, tente novamente.');
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading && usuarios.length === 0) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Gerenciamento de Usuários</h1>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
                >
                    <FiPlus className="mr-2" /> Novo Usuário
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
                                Nome
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tipo
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {usuarios.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                    Nenhum usuário cadastrado.
                                </td>
                            </tr>
                        ) : (
                            usuarios.map(usuario => (
                                <tr key={usuario.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {usuario.nome}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {usuario.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {usuario.tipo === 'admin' ? 'Administrador' : 'Voluntário'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => openModal(usuario)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        >
                                            <FiEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(usuario.id)}
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

            {/* Modal para criar/editar usuário */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                        <div className="px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {currentUsuario ? 'Editar Usuário' : 'Novo Usuário'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FiX size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-4">
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
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Senha {currentUsuario && '(deixe em branco para manter a atual)'}
                                </label>
                                <input
                                    type="password"
                                    name="senha"
                                    value={formData.senha}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required={!currentUsuario}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo
                                </label>
                                <select
                                    name="tipo"
                                    value={formData.tipo}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="admin">Administrador</option>
                                    <option value="voluntario">Voluntário</option>
                                </select>
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