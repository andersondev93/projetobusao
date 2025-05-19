"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-3">
          {/* Logo e Título */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-white p-1.5 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Vai de Busão</h1>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="py-2 hover:text-white/80 transition-colors font-medium">
              Início
            </Link>
            <Link href="/linhas" className="py-2 hover:text-white/80 transition-colors font-medium">
              Linhas
            </Link>
            <Link href="/pontos" className="py-2 hover:text-white/80 transition-colors font-medium">
              Pontos
            </Link>
            <Link href="/sobre" className="py-2 hover:text-white/80 transition-colors font-medium">
              Sobre
            </Link>
            <Link href="/contato" className="bg-white text-primary hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors">
              Suporte
            </Link>
          </nav>

          {/* Botão Menu Mobile */}
          <div className="md:hidden">
            <button
              className="text-white focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {!isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <nav className="pt-4 pb-3 md:hidden border-t border-white/20 mt-1">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="py-2 hover:bg-white/10 px-2 rounded transition-colors">
                Início
              </Link>
              <Link href="/linhas" className="py-2 hover:bg-white/10 px-2 rounded transition-colors">
                Linhas
              </Link>
              <Link href="/pontos" className="py-2 hover:bg-white/10 px-2 rounded transition-colors">
                Pontos
              </Link>
              <Link href="/sobre" className="py-2 hover:bg-white/10 px-2 rounded transition-colors">
                Sobre
              </Link>
              <Link href="/contato" className="bg-white text-primary mt-2 px-4 py-2 rounded-lg font-medium transition-colors text-center">
                Suporte
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
