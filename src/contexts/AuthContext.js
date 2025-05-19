'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';

// Criar o contexto
const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    signIn: async () => { },
    signOut: () => { }
});

// Usuário mock para teste
const MOCK_USER = {
    id: 1,
    nome: 'Administrador',
    email: 'admin@example.com',
    tipo: 'admin'
};

// URL base da API
const API_URL = 'http://localhost:3333/api';
// Flag para definir se deve usar mock ou backend real
const USE_MOCK = false;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mounted, setMounted] = useState(false);

    // Efeito para marcar quando o componente está montado no cliente
    useEffect(() => {
        setMounted(true);
    }, []);

    // Verificar se já existe um usuário autenticado no localStorage
    useEffect(() => {
        // Só executar no cliente e apenas quando o componente estiver montado
        if (typeof window === 'undefined' || !mounted) return;

        const loadUserFromStorage = async () => {
            try {
                const token = localStorage.getItem('@Busao:token');
                const savedUser = localStorage.getItem('@Busao:user');

                if (token && savedUser) {
                    if (!USE_MOCK) {
                        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    }
                    setUser(JSON.parse(savedUser));
                    setIsAuthenticated(true);
                }
            } catch (err) {
                console.error('Erro ao carregar usuário:', err);
            } finally {
                setLoading(false);
            }
        };

        loadUserFromStorage();
    }, [mounted]);

    // Função de login
    const signIn = async (email, senha) => {
        if (typeof window === 'undefined') return false;

        setLoading(true);
        setError(null);

        try {
            if (USE_MOCK) {
                // Usar login mockado
                await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay de API

                if (email === 'admin@example.com' && senha === 'senha123') {
                    const mockToken = 'mock-token-' + Date.now();
                    localStorage.setItem('@Busao:token', mockToken);
                    localStorage.setItem('@Busao:user', JSON.stringify(MOCK_USER));

                    // Configurar cabeçalhos para ambos axios e api
                    axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;

                    setUser(MOCK_USER);
                    setIsAuthenticated(true);
                    return true;
                } else {
                    throw new Error('Credenciais inválidas');
                }
            } else {
                // Tenta fazer login no backend real
                console.log('Tentando login com:', { email, senha });
                try {
                    console.log('Enviando requisição para:', `${API_URL}/auth/login`);
                    const response = await axios.post(`${API_URL}/auth/login`, {
                        email,
                        senha
                    });

                    console.log('Resposta recebida:', response.data);
                    const { token, usuario } = response.data;

                    localStorage.setItem('@Busao:token', token);
                    localStorage.setItem('@Busao:user', JSON.stringify(usuario));

                    // Configurar cabeçalhos para ambos axios e api
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    setUser(usuario);
                    setIsAuthenticated(true);

                    console.log('Login bem-sucedido. Token armazenado.');

                    return true;
                } catch (err) {
                    console.error('Erro detalhado do login:', err);
                    console.error('Status de erro:', err.response?.status);
                    console.error('Dados do erro:', err.response?.data);
                    console.error('Mensagem de erro:', err.message);
                    throw err;
                }
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);

            setError(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Função de logout
    const signOut = () => {
        if (typeof window === 'undefined') return;

        localStorage.removeItem('@Busao:token');
        localStorage.removeItem('@Busao:user');

        // Limpar cabeçalhos para ambos axios e api
        delete axios.defaults.headers.common['Authorization'];

        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            error,
            signIn,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
} 