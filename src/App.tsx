import React, { useState } from 'react';
import { ItemCardapio } from './types';
import { cardapioDQuebrada } from './data/mockData';
import { CartProvider, useCart } from './context/CartContext';
import {
  Header,
  CategoryNav,
  MenuShowcase,
  ProductDetailModal,
  CartDrawer,
  CheckoutModal,
  FloatingCartBar,
} from './components';
import { MapPin, Phone, Flame, CheckCircle2 } from 'lucide-react';

export const AppContent: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<ItemCardapio | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(cardapioDQuebrada[0].id);

  const { lastAddedItemName, clearLastAddedNotification, openCart } = useCart();

  return (
    <div className="min-h-screen bg-[#111111] text-zinc-100 flex flex-col font-sans">
      {/* 1. CABEÇALHO COM LOGO E INDICADOR DE CARRINHO */}
      <Header />

      {/* TOAST DE FEEDBACK DE ITEM ADICIONADO */}
      {lastAddedItemName && (
        <div className="fixed top-20 right-4 left-4 sm:left-auto sm:w-80 z-50 bg-emerald-600 text-white p-3 rounded-2xl shadow-2xl border border-emerald-400/30 flex items-center justify-between gap-3 transition-all animate-bounce">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
            <span className="line-clamp-1">{lastAddedItemName} adicionado!</span>
          </div>
          <button
            onClick={() => {
              clearLastAddedNotification();
              openCart();
            }}
            type="button"
            className="text-[11px] font-black uppercase underline hover:text-emerald-200 shrink-0 cursor-pointer"
          >
            Ver Sacola
          </button>
        </div>
      )}

      {/* 2. NAVEGAÇÃO DE CATEGORIAS COM SCROLL HORIZONTAL */}
      <CategoryNav
        categories={cardapioDQuebrada}
        activeCategoryId={activeCategoryId}
        onSelectCategory={(catId) => setActiveCategoryId(catId)}
      />

      {/* 3. VITRINE DO CARDÁPIO COM SEÇÕES E CARDS */}
      <div className="flex-1 pb-16 sm:pb-8">
        <MenuShowcase
          categories={cardapioDQuebrada}
          onSelectItem={(item) => setSelectedProduct(item)}
        />
      </div>

      {/* 4. MODAL / DRAWER DE DETALHES DO PRODUTO */}
      {selectedProduct && (
        <ProductDetailModal
          item={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* 5. GAVETA DO CARRINHO (CART DRAWER) */}
      <CartDrawer />

      {/* 6. FORMULÁRIO E MODAL DE CHECKOUT */}
      <CheckoutModal />

      {/* 7. BOTÃO FLUTUANTE DE CARRINHO PARA MOBILE */}
      <FloatingCartBar />

      {/* RODAPÉ INSTITUCIONAL D' QUEBRADA */}
      <footer className="border-t border-zinc-800/90 bg-zinc-950 py-10 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Flame className="w-5 h-5 text-red-600 fill-red-600 animate-pulse" />
            <span className="text-base font-black text-white uppercase tracking-wider font-urban">
              D' Quebrada Foods
            </span>
          </div>
          <p className="max-w-md mx-auto text-zinc-400">
            Hambúrgueres artesanais no pão francês, espetos na brasa e porções de respeito. O verdadeiro sabor da periferia para a sua mesa!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-400 text-xs font-medium pt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-500" /> Av. Principal da Quebrada, 1000
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-red-500" /> (11) 95780-9746
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-red-500 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              @dquebradafoods
            </span>
          </div>

          <div className="pt-4 border-t border-zinc-900 text-[11px] text-zinc-600">
            © {new Date().getFullYear()} D' Quebrada Foods. Todos os direitos reservados. "Quebra e Manda!"
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
