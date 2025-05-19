import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://projetobusao-backend.vercel.app/api'
    : 'http://localhost:3333/api';

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor para adicionar o token apenas quando está autenticado
api.interceptors.request.use(config => {
    // Lista de endpoints públicos que não precisam de autenticação
    const publicEndpoints = [
        { url: '/linhas', method: 'get' },
        { url: '/pontos', method: 'get' },
        { url: '/usuarios', method: 'get' },
        { url: '/auth/login', method: 'post' },
        { url: '/auth/register', method: 'post' }
    ];

    // Verifica se a URL atual é um endpoint público
    const isPublicEndpoint = publicEndpoints.some(endpoint => {
        if (config.url === endpoint.url && (!endpoint.method || config.method === endpoint.method))
            return true;

        if (config.url && config.url.startsWith('/linhas/') && config.method === 'get')
            return true;

        if (config.url && config.url.startsWith('/pontos/') && config.method === 'get')
            return true;

        if (config.url && config.url.startsWith('/usuarios/') && config.method === 'get')
            return true;

        return false;
    });

    if (!isPublicEndpoint && typeof window !== 'undefined') {
        const token = localStorage.getItem('@Busao:token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn(`Requisição para ${config.url} sem token de autenticação`);
        }
    }

    return config;
});

// Serviços para Linhas
export const linhaService = {
    listar: async () => {
        try {
            const response = await api.get('/linhas');
            return response.data.map(linha => ({
                ...linha,
                cor: linha.cor || 'default',
                passagem: linha.passagem || '',
                horarioOperacao: linha.horarioOperacao || '',
                horarios: linha.horarios ? linha.horarios.map(h => ({
                    ...h,
                    diasSemana: h.diasSemana || 'Seg-Sex'
                })) : [],
                pontos: linha.pontos || []
            }));
        } catch (error) {
            console.error('Erro ao listar linhas:', error);
            // Retorna uma lista vazia em caso de erro
            return [];
        }
    },

    obter: async (id) => {
        const response = await api.get(`/linhas/${id}`);
        return {
            ...response.data,
            cor: response.data.cor || 'default',
            passagem: response.data.passagem || '',
            horarioOperacao: response.data.horarioOperacao || '',
            horarios: response.data.horarios ? response.data.horarios.map(h => ({
                ...h,
                diasSemana: h.diasSemana || 'Seg-Sex'
            })) : [],
            pontos: response.data.pontos || []
        };
    },

    criar: async (dados) => {
        try {
            console.log('Enviando requisição para criar linha:', dados);
            const token = localStorage.getItem('@Busao:token');
            console.log('Token disponível:', !!token);

            const response = await api.post('/linhas', dados, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao criar linha:', error);
            console.error('Status:', error.response?.status);
            console.error('Dados do erro:', error.response?.data);
            throw error;
        }
    },

    atualizar: async (id, dados) => {
        try {
            const token = localStorage.getItem('@Busao:token');
            const response = await api.put(`/linhas/${id}`, dados, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar linha:', error);
            throw error;
        }
    },

    excluir: async (id) => {
        try {
            if (!id || isNaN(Number(id))) {
                throw new Error(`ID inválido: ${id}. Deve ser um número.`);
            }

            console.log(`Iniciando exclusão da linha ID: ${id}`);
            const token = localStorage.getItem('@Busao:token');

            if (!token) {
                console.error('Tentativa de excluir linha sem token de autenticação');
                throw new Error('Token de autenticação não encontrado');
            }

            console.log('Enviando requisição DELETE para o backend');
            await api.delete(`/linhas/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(`Linha ${id} excluída com sucesso`);
        } catch (error) {
            console.error('Erro ao excluir linha:', error);
            console.error('Status:', error.response?.status);
            console.error('Dados do erro:', error.response?.data);
            throw error;
        }
    }
};

// Serviços para Pontos
export const pontoService = {
    listar: async () => {
        try {
            const response = await api.get('/pontos');
            return response.data.map(ponto => ({
                ...ponto,
                linhas: ponto.linhas || []
            }));
        } catch (error) {
            console.error('Erro ao listar pontos:', error);
            // Retorna uma lista vazia em caso de erro
            return [];
        }
    },

    obter: async (id) => {
        const response = await api.get(`/pontos/${id}`);
        return {
            ...response.data,
            linhas: response.data.linhas || []
        };
    },

    criar: async (dados) => {
        try {
            const token = localStorage.getItem('@Busao:token');
            const response = await api.post('/pontos', dados, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao criar ponto:', error);
            throw error;
        }
    },

    atualizar: async (id, dados) => {
        try {
            const token = localStorage.getItem('@Busao:token');
            const response = await api.put(`/pontos/${id}`, dados, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar ponto:', error);
            throw error;
        }
    },

    excluir: async (id) => {
        try {
            const token = localStorage.getItem('@Busao:token');
            await api.delete(`/pontos/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Erro ao excluir ponto:', error);
            throw error;
        }
    }
};

// Serviços para Usuários
export const usuarioService = {
    listar: async () => {
        try {
            const response = await api.get('/usuarios');
            return response.data;
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            // Retorna uma lista vazia em caso de erro
            return [];
        }
    },

    obter: async (id) => {
        try {
            const response = await api.get(`/usuarios/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao obter usuário ${id}:`, error);
            // Retorna um objeto vazio em caso de erro
            return {};
        }
    },

    criar: async (dados) => {
        try {
            const response = await api.post('/auth/register', dados);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw error; // Propaga o erro para que o componente possa mostrar mensagem específica
        }
    },

    atualizar: async (id, dados) => {
        try {
            const token = localStorage.getItem('@Busao:token');
            const response = await api.put(`/usuarios/${id}`, dados, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw error; // Propaga o erro para que o componente possa mostrar mensagem específica
        }
    },

    excluir: async (id) => {
        try {
            const token = localStorage.getItem('@Busao:token');
            await api.delete(`/usuarios/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            throw error; // Propaga o erro para que o componente possa mostrar mensagem específica
        }
    }
};

export default api; 