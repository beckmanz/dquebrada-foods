import React from 'react';
import { ItemCardapio } from '../types';
import { getItemVisualMeta } from '../data/mockData';
import { Plus, Flame, Sparkles } from 'lucide-react';

interface ProductCardProps {
  item: ItemCardapio;
  onSelectItem: (item: ItemCardapio) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item, onSelectItem }) => {
  const visualMeta = getItemVisualMeta(item.id);

  const formattedPrice = item.preco.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelectItem(item);
  };

  return (
    <article
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectItem(item);
        }
      }}
      className="group relative flex flex-col sm:flex-row justify-between bg-zinc-900/90 hover:bg-zinc-900/95 border border-zinc-800 hover:border-red-600/60 rounded-2xl p-3.5 sm:p-4 gap-3.5 sm:gap-4 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-red-950/20 cursor-pointer overflow-hidden active:scale-[0.99] select-none text-left"
    >
      {/* Detalhe de borda luminosa sutil no hover */}
      <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-red-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Conteúdo à Esquerda */}
      <div className="flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Badges / Selo em Destaque */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {visualMeta.badge && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30">
                <Flame className="w-2.5 h-2.5 fill-red-400" />
                {visualMeta.badge}
              </span>
            )}

            {visualMeta.breadType && (
              <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                🍞 {visualMeta.breadType}
              </span>
            )}

            {item.opcoesExtras && item.opcoesExtras.length > 0 && (
              <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                ⚡ {item.opcoesExtras.length} opções
              </span>
            )}
          </div>

          {/* Nome do Produto */}
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
            {item.nome}
          </h3>

          {/* Descrição curta */}
          <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
            {item.descricao}
          </p>

          {/* Destaque especial de Ingredientes para Hambúrgueres */}
          {visualMeta.ingredients && visualMeta.ingredients.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-zinc-800/80">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Ingredientes selecionados:
              </span>
              <div className="flex flex-wrap gap-1">
                {visualMeta.ingredients.slice(0, 3).map((ing, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium bg-zinc-800/70 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700/50"
                  >
                    • {ing}
                  </span>
                ))}
                {visualMeta.ingredients.length > 3 && (
                  <span className="text-[10px] font-bold text-red-400 px-1 py-0.5">
                    +{visualMeta.ingredients.length - 3} mais
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé do Card: Preço com Etiqueta Branca e Ação */}
        <div className="flex items-center justify-between pt-2">
          {/* ETIQUETA DE PREÇO (Design System Solicitado) */}
          <div className="inline-flex items-center gap-1.5 bg-white text-zinc-900 font-extrabold px-2.5 py-1 rounded shadow-md group-hover:bg-amber-300 transition-colors">
            <span className="text-[10px] font-black uppercase text-zinc-600">Por</span>
            <span className="text-sm sm:text-base font-black tracking-tight">
              {formattedPrice}
            </span>
          </div>

          {/* Botão de Adicionar / Customizar */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectItem(item);
            }}
            aria-label={`Personalizar e adicionar ${item.nome}`}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-black px-3.5 py-2 rounded-xl shadow-md shadow-red-600/30 transition-all active:scale-95 group-hover:ring-2 ring-red-400/40 cursor-pointer z-10"
          >
            <span>{item.opcoesExtras && item.opcoesExtras.length > 0 ? 'Escolher' : 'Pedir'}</span>
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Imagem à Direita (ou Topo no mobile muito estreito) */}
      <div className="relative w-full sm:w-28 sm:h-28 md:w-32 md:h-32 h-36 rounded-xl overflow-hidden shrink-0 bg-zinc-950 border border-zinc-800 pointer-events-none">
        <img
          src={visualMeta.imageUrl}
          alt={item.nome}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* Ícone sutil no canto da imagem */}
        <div className="absolute bottom-1.5 right-1.5 bg-black/70 backdrop-blur-xs p-1 rounded-md text-amber-400 border border-white/10">
          <Sparkles className="w-3 h-3" />
        </div>
      </div>
    </article>
  );
};
