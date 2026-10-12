import React, { useRef } from 'react';
import { CategoriaCardapio } from '../types';
import { Flame, UtensilsCrossed, Beef, Sparkles, CupSoda } from 'lucide-react';

interface CategoryNavProps {
  categories: CategoriaCardapio[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Mapeamento de ícones visuais para o clima street food
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'artesanais':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'acompanhamentos':
        return <UtensilsCrossed className="w-4 h-4 text-amber-400" />;
      case 'churras-jantinha':
        return <Beef className="w-4 h-4 text-amber-400" />;
      case 'bebidas':
        return <CupSoda className="w-4 h-4 text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  const handleCategoryClick = (category: CategoriaCardapio) => {
    onSelectCategory(category.id);

    // Rola a tela até o container da categoria correspondente
    const element = document.getElementById(category.id);
    if (element) {
      const yOffset = -140; // compensação do header e do category nav fixos
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-[69px] sm:top-[77px] z-30 w-full bg-[#111111]/90 backdrop-blur-md border-b border-zinc-800/80 py-2.5 sm:py-3 shadow-md">
      <div className="max-w-5xl mx-auto px-4">
        <nav
          ref={scrollContainerRef}
          aria-label="Categorias do Cardápio"
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 -my-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => {
            const isActive = category.id === activeCategoryId;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                type="button"
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 active:scale-95 select-none cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 ring-2 ring-red-500/50'
                    : 'bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                <span>{getCategoryIcon(category.id)}</span>
                <span>{category.titulo}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping ml-0.5" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
