/**
 * Array Safety Utilities
 * Previne erros de .map() quando arrays podem ser null/undefined
 */

import React from 'react';

/**
 * Garante que o valor seja um array, mesmo que vazio
 */
export function safeArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

/**
 * Faz map seguro com fallback
 */
export function safeMap<T, R>(
  array: T[] | null | undefined,
  mapFn: (item: T, index: number) => R,
  fallback: R[] = []
): R[] {
  return Array.isArray(array) ? array.map(mapFn) : fallback;
}

/**
 * Faz map seguro com render condicional
 */
export function safeMapRender<T>(
  array: T[] | null | undefined,
  renderFn: (item: T, index: number) => React.ReactNode,
  emptyMessage?: string
): React.ReactNode {
  if (!Array.isArray(array) || array.length === 0) {
    return emptyMessage ? React.createElement('div', { className: 'text-center py-8 text-gray-500' }, emptyMessage) : null;
  }
  
  return array.map(renderFn);
}

/**
 * Verifica se array tem conteúdo
 */
export function hasContent(array: any[] | null | undefined): boolean {
  return Array.isArray(array) && array.length > 0;
}

/**
 * Conta itens de forma segura
 */
export function safeCount(array: any[] | null | undefined): number {
  return Array.isArray(array) ? array.length : 0;
}

/**
 * Filtra array de forma segura
 */
export function safeFilter<T>(
  array: T[] | null | undefined,
  filterFn: (item: T) => boolean
): T[] {
  return Array.isArray(array) ? array.filter(filterFn) : [];
}
