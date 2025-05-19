'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { FiMap, FiMapPin, FiUsers, FiLogOut, FiTruck } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLayout({ children }) {
    const { isAuthenticated, loading, user, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        // Só redireciona se não estiver carregando e não estiver autenticado e não estiver na página de login
        if (!loading && !isAuthenticated && !isLoginPage) {
            router.push('/admin/login');
        }
    }, [isAuthenticated, loading, router, isLoginPage]);

    // Se estiver na página de login, apenas renderize o componente filho
    if (isLoginPage) {
        return children;
    }

    // Exibe um spinner durante o carregamento
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    // Se não estiver autenticado, não renderiza nada (será redirecionado)
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold text-indigo-600">Painel Admin</h1>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    href="/admin"
                                    className={`${pathname === '/admin' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    <FiMap className="mr-2" />
                                    Dashboard
                                </Link>
                                <Link
                                    href="/admin/linhas"
                                    className={`${pathname === '/admin/linhas' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    <FiTruck className="mr-2" />
                                    Linhas
                                </Link>
                                <Link
                                    href="/admin/pontos"
                                    className={`${pathname === '/admin/pontos' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    <FiMapPin className="mr-2" />
                                    Pontos
                                </Link>
                                <Link
                                    href="/admin/usuarios"
                                    className={`${pathname === '/admin/usuarios' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    <FiUsers className="mr-2" />
                                    Usuários
                                </Link>
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <div className="ml-3 relative">
                                <div className="flex items-center">
                                    <span className="text-gray-700 mr-4">
                                        Olá, {user?.nome || 'Admin'}
                                    </span>
                                    <button
                                        onClick={signOut}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <FiLogOut className="mr-2" />
                                        Sair
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
} 