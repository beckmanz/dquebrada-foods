import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const FloatingCartBar: React.FC = () => {
  const { totalItemsCount, subtotal, openCart } = useCart();

  if (totalItemsCount === 0) return null;

  const formattedSubtotal = subtotal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:hidden z-40 animate-in slide-in-from-bottom-5 duration-300">
      <button
        onClick={openCart}
        type="button"
        aria-label="Ver sacola de pedidos"
        className="w-full flex items-center justify-between bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white px-4 py-3.5 rounded-2xl shadow-2xl shadow-red-600/50 border border-red-400/30 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-xl bg-black/30 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-white" />
            <span className="absolute -top-1.5 -right-1.5 bg-white text-zinc-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {totalItemsCount}
            </span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-black tracking-wider text-red-200">
              Ver Sacola
            </span>
            <span className="text-sm font-black text-white">{formattedSubtotal}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-black/20 px-3 py-1.5 rounded-xl">
          <span>Avançar</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      </button>
    </div>
  );
};
