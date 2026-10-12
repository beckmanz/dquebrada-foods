import React from 'react';
import { Flame, ShoppingBag, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onCartClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const { subtotal, totalItemsCount, openCart } = useCart();

  const handleOpenCart = () => {
    if (onCartClick) {
      onCartClick();
    } else {
      openCart();
    }
  };

  const formattedSubtotal = subtotal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <header className="sticky top-0 z-40 w-full bg-[#111111]/95 backdrop-blur-md border-b border-zinc-800 shadow-2xl transition-all">
      {/* Faixa superior de status urbano */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 px-4 py-1 text-xs font-semibold text-white flex items-center justify-between shadow-inner">
        <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="tracking-wide">CHAPA QUENTE • ABERTO AGORA</span>
          <span className="hidden sm:inline text-red-200">|</span>
          <span className="hidden sm:flex items-center gap-1 text-red-100 font-medium">
            <Clock className="w-3 h-3 inline" /> 35-50 min
          </span>
        </div>
        <span className="hidden sm:inline text-xs font-mono tracking-wider opacity-90 uppercase">
          Delivery & Retirada
        </span>
      </div>

      {/* Barra principal */}
      <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-3">
        {/* Marca / Logo com Chama */}
        <div className="flex items-center gap-3 select-none group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-white shadow-lg shadow-red-600/30 border border-red-500/40 group-hover:scale-105 transition-transform duration-300">
            <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300 fill-amber-400 animate-pulse" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-zinc-950 flex items-center justify-center border border-red-600 text-[10px] font-black text-red-500">
              D'
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans uppercase">
                D' Quebrada <span className="text-red-500">Foods</span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-extrabold tracking-widest text-amber-400 uppercase flex items-center gap-1 font-urban">
              🔥 Quebra e Manda!
            </p>
          </div>
        </div>

        {/* Indicador Flutuante/Fixo de Carrinho com Subtotal */}
        <button
          onClick={handleOpenCart}
          type="button"
          aria-label="Abrir carrinho de compras"
          className="relative flex items-center gap-2.5 sm:gap-3 bg-zinc-900/90 hover:bg-zinc-800 active:scale-95 border border-zinc-700/80 hover:border-red-600 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all shadow-lg group"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors duration-200">
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[11px] font-black text-white shadow-md animate-bounce ring-2 ring-[#111111]">
                {totalItemsCount}
              </span>
            )}
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-zinc-400 group-hover:text-zinc-300">
              {totalItemsCount === 1 ? '1 item' : `${totalItemsCount} itens`}
            </span>
            <span className="text-xs sm:text-sm font-black text-white group-hover:text-amber-400 transition-colors">
              {formattedSubtotal}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
