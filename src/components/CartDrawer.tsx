import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    openCheckout,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    total,
    clearCart,
    checkout,
  } = useCart();

  if (!isCartOpen) return null;

  const formattedSubtotal = subtotal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const handleProceedToCheckout = () => {
    closeCart();
    openCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={closeCart} aria-hidden="true" />

      {/* Gaveta do Carrinho */}
      <div className="relative w-full max-w-md bg-[#141414] border-l border-zinc-800 h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Topo do Carrinho */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-tight">
                Seu Pedido
              </h2>
              <span className="text-xs text-zinc-400">
                {items.length === 1 ? '1 item na sacola' : `${items.length} itens na sacola`}
              </span>
            </div>
          </div>

          <button
            onClick={closeCart}
            type="button"
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lista de Itens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold text-zinc-300">Sua sacola está vazia</p>
              <p className="text-xs text-zinc-500 max-w-xs">
                Escolha aquele Parça, Pod Pá ou espeto na brasa pra quebrar a larica!
              </p>
              <button
                onClick={closeCart}
                className="mt-2 text-xs font-black uppercase text-red-500 hover:text-red-400 cursor-pointer"
              >
                Ver cardápio
              </button>
            </div>
          ) : (
            items.map((cartItem) => (
              <div
                key={cartItem.cartItemId}
                className="bg-zinc-900/80 border border-zinc-800/90 rounded-2xl p-3.5 space-y-2.5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-black text-white leading-tight">
                      {cartItem.item.nome}
                    </h3>
                    <span className="text-xs font-bold text-amber-400">
                      {cartItem.item.preco.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(cartItem.cartItemId)}
                    className="text-zinc-500 hover:text-red-500 p-1 transition-colors cursor-pointer"
                    aria-label="Remover item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Opção Selecionada (ex: Sabor do espeto ou refrigerante) */}
                {cartItem.selectedOption && (
                  <div className="text-[11px] text-zinc-300 bg-zinc-950/70 p-2 rounded-lg border border-zinc-800/60 flex items-center justify-between">
                    <span className="font-semibold text-amber-300">
                      ⚡ Opção: {cartItem.selectedOption}
                    </span>
                    <span className="text-zinc-500 text-[10px]">Incluso</span>
                  </div>
                )}

                {/* Observação */}
                {cartItem.notes && (
                  <p className="text-[11px] text-zinc-400 italic bg-zinc-950/40 px-2 py-1 rounded">
                    Obs: {cartItem.notes}
                  </p>
                )}

                {/* Controles de Quantidade e Subtotal do Item */}
                <div className="flex items-center justify-between pt-1 border-t border-zinc-800/50">
                  <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
                    <button
                      onClick={() => updateQuantity(cartItem.cartItemId, cartItem.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-black text-white px-1">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(cartItem.cartItemId, cartItem.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-xs font-black text-white">
                    {cartItem.subtotal.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé com Subtotal e Botão para o Checkout */}
        {items.length > 0 && (
          <div className="p-4 bg-zinc-900/90 border-t border-zinc-800 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="font-bold text-white">{formattedSubtotal}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>
                  {checkout.deliveryMethod === 'delivery' ? 'Taxa de Entrega' : 'Retirada no Balcão'}
                </span>
                <span className={deliveryFee > 0 ? 'text-zinc-300 font-bold' : 'text-emerald-400 font-bold'}>
                  {deliveryFee > 0
                    ? deliveryFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                    : 'Grátis'}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-zinc-800">
                <span>Total Estimado</span>
                <span className="text-amber-400 text-base">
                  {total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-black py-3 rounded-xl shadow-lg shadow-red-600/40 transition-all text-xs sm:text-sm uppercase tracking-wider group cursor-pointer"
            >
              <span>Avançar para Entrega e Pagamento</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={clearCart}
              type="button"
              className="w-full text-center text-[11px] font-bold text-zinc-500 hover:text-zinc-400 pt-1 cursor-pointer"
            >
              Limpar sacola
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
