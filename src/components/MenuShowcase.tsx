import React, { useState, useMemo } from 'react';
import { CategoriaCardapio, ItemCardapio } from '../types';
import { ProductCard } from './ProductCard';
import { Search, Flame, Sparkles } from 'lucide-react';

interface MenuShowcaseProps {
  categories: CategoriaCardapio[];
  onSelectItem: (item: ItemCardapio) => void;
}

export const MenuShowcase: React.FC<MenuShowcaseProps> = ({
  categories,
  onSelectItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Todos os itens achatados para a pesquisa rápida
  const allItems = useMemo(() => {
    return categories.flatMap((cat) => cat.itens);
  }, [categories]);

  // Itens filtrados pela busca
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allItems.filter(
      (item) =>
        item.nome.toLowerCase().includes(q) ||
        item.descricao.toLowerCase().includes(q) ||
        item.opcoesExtras?.some((op) => op.toLowerCase().includes(q))
    );
  }, [allItems, searchQuery]);

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-10">
      {/* Banner Urbano Hero / Quebrada Foods */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 p-5 sm:p-8 shadow-2xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-red-400" />
              Sabor de Raiz • Feito na Brasa
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              O Autêntico Smash <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-amber-200">
                Quebrada Style!
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Carne de verdade, queijo derretendo de verdade e aquele toque especial que só quem é da quebrada conhece. Escolha seu pedido e manda brasa!
            </p>
          </div>

          {/* Selos de Qualidade */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 shrink-0">
            <div className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-2xl text-center">
              <span className="block text-base sm:text-lg font-black text-white">100%</span>
              <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                Artesanal
              </span>
            </div>
            <div className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-2xl text-center">
              <span className="block text-base sm:text-lg font-black text-amber-400">Na Brasa</span>
              <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                Defumação Real
              </span>
            </div>
          </div>
        </div>

        {/* Barra de Pesquisa Rápida */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por lanche, espeto, batata ou refrigerante..."
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500 hover:text-white cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Renderização das Seções por Categoria */}
      {searchQuery.trim() ? (
        // Resultado de Busca Direto
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white uppercase flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Resultados para "{searchQuery}"
            </h3>
            <span className="text-xs text-zinc-400 font-bold">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'itens'}
            </span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900/40 rounded-2xl border border-zinc-800 p-6 space-y-2">
              <p className="text-sm font-bold text-zinc-300">Nenhum item encontrado</p>
              <p className="text-xs text-zinc-500">Tente buscar por outro termo ou navegue pelas categorias acima.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onSelectItem={onSelectItem}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        // Seções Normais agrupadas por Categoria
        categories.map((category) => {
          if (category.itens.length === 0) return null;

          return (
            <section
              key={category.id}
              id={category.id}
              className="space-y-4 scroll-mt-36"
            >
              {/* Título da Seção */}
              <div className="border-b border-zinc-800/80 pb-3 flex items-end justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2">
                    <span className="w-2.5 h-6 rounded-full bg-red-600 inline-block" />
                    {category.titulo}
                  </h3>
                  {category.subtitulo && (
                    <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                      {category.subtitulo}
                    </p>
                  )}
                </div>
                <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest hidden sm:inline">
                  {category.itens.length} opções
                </span>
              </div>

              {/* Grid Responsivo de Cards (1 coluna mobile, 2 desktop) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.itens.map((item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    onSelectItem={onSelectItem}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}
    </main>
  );
};
