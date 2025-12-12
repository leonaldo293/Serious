'use client';

import { useState } from 'react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Apoiar Nossa Causa
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Agradecemos imensamente o seu interesse em apoiar nossa missão de transformar vidas através da educação tecnológica em África. Sua contribuição faz toda a diferença!
        </p>
        
        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Transferência Bancária (Express)
            </p>
            <p className="text-lg font-bold text-african-gold dark:text-african-gold">
              939 947 819
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              ELTx Hub - Conta para Apoio
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <a
            href="https://wa.me/244939947819?text=Olá! Gostaria de apoiar a causa da ELTx Hub. Podem me dar mais informações?"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.897-.105.537-.299.994-.748 1.247-1.249.253-.501.398-1.056.398-1.653 0-.198-.025-.372-.075-.521z"/>
            </svg>
            Falar via WhatsApp
          </a>
          
          <a
            href="tel:+244939947819"
            className="flex items-center justify-center gap-2 w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Ligar Agora
          </a>
        </div>
        
        <div className="mt-6 p-4 bg-african-gold/10 border border-african-gold/30 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-semibold text-african-gold dark:text-african-gold">Obrigado!</span> Sua generosidade nos ajuda a continuar levando educação de qualidade para mais pessoas em toda África.
          </p>
        </div>
        
        <button
          onClick={onClose}
          className="mt-6 w-full py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
