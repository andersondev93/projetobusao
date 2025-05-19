'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [localError, setLocalError] = useState('');
    const { signIn, loading, error: authError } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        try {
            await signIn(email, senha);
            router.push('/admin');
        } catch (err) {
            console.error('Erro detalhado no login:', err);
            if (err.response) {
                // O servidor respondeu com um código de status diferente de 2xx
                const mensagemErro = err.response.data?.error || 'Erro no servidor';
                setLocalError(`Erro: ${mensagemErro} (${err.response.status})`);
            } else if (err.request) {
                // A requisição foi feita mas não houve resposta do servidor
                setLocalError('Erro: Servidor não respondeu. Verifique se o backend está rodando.');
            } else {
                // Erro na configuração da requisição
                setLocalError(`Erro: ${err.message}`);
            }
        }
    };

    // Usa erro do contexto se existir, senão usa erro local
    const errorMessage = authError || localError;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Login Administrativo
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Use: admin@example.com / senha123
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="senha" className="sr-only">
                                Senha
                            </label>
                            <input
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Senha"
                                required
                            />
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="text-red-600 text-sm text-center">{errorMessage}</div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {loading ? (
                                <>
                                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </span>
                                    Entrando...
                                </>
                            ) : 'Entrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 