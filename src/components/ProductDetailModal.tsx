import React, { useState, useEffect } from 'react';
import { ItemCardapio } from '../types';
import { getItemVisualMeta } from '../data/mockData';
import { X, Plus, Minus, Flame, Check, AlertCircle, ShoppingBag, Info, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  item: ItemCardapio | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ item, onClose }) => {
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sincroniza estado sempre que um item for aberto
  useEffect(() => {
    if (item) {
      setQuantity(1);
      setNotes('');
      setValidationError(null);
      // Pre-seleciona a primeira opção extra se houver
      if (item.opcoesExtras && item.opcoesExtras.length > 0) {
        setSelectedOption(item.opcoesExtras[0]);
      } else {
        setSelectedOption('');
      }
    }
  }, [item]);

  // Bloqueia rolagem do body quando o modal está aberto
  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [item]);

  // Tecla ESC para fechar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const visualMeta = getItemVisualMeta(item.id);
  const totalPrice = item.preco * quantity;
  const hasOptions = Boolean(item.opcoesExtras && item.opcoesExtras.length > 0);

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (hasOptions && !selectedOption) {
      setValidationError('Por favor, selecione uma das opções disponíveis.');
      return;
    }

    addToCart(item, quantity, selectedOption || undefined, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity">
      {/* Backdrop clicável */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Caixa do Modal / Bottom Sheet */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-xl max-h-[92vh] sm:max-h-[88vh] bg-[#141414] border-t sm:border border-zinc-800 sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden z-20"
      >
        {/* Barra superior de arraste móvel (handle) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-zinc-700" />
        </div>

        {/* Botão de Fechar flutuante */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Fechar detalhes do item"
          className="absolute top-3.5 right-3.5 z-30 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-zinc-300 hover:text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all active:scale-90 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Área Rolável de Conteúdo */}
        <div className="overflow-y-auto flex-1 no-scrollbar pb-28">
          {/* Imagem do Item em destaque */}
          <div className="relative w-full h-48 sm:h-56 bg-zinc-950 overflow-hidden">
            <img
              src={visualMeta.imageUrl}
              alt={item.nome}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30 pointer-events-none" />

            {/* Badges na foto */}
            <div className="absolute bottom-3 left-4 flex flex-wrap gap-2 pointer-events-none">
              {visualMeta.badge && (
                <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-600 text-white shadow-lg">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  {visualMeta.badge}
                </span>
              )}
              {hasOptions && (
                <span className="inline-flex items-center text-xs font-black px-2.5 py-1 rounded-full bg-amber-500 text-zinc-950 shadow-lg">
                  ⚡ Escolha sua opção
                </span>
              )}
            </div>
          </div>

          {/* Cabeçalho do Produto e Preço */}
          <div className="p-4 sm:p-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {item.nome}
                </h2>
                {visualMeta.breadType && (
                  <p className="text-xs font-bold text-amber-400 mt-0.5">
                    🍞 {visualMeta.breadType}
                  </p>
                )}
              </div>

              {/* Etiqueta de Preço Branca */}
              <div className="self-start inline-flex items-center gap-1.5 bg-white text-zinc-950 font-extrabold px-3 py-1 rounded-lg shadow-md">
                <span className="text-[11px] font-black uppercase text-zinc-600">Preço</span>
                <span className="text-base sm:text-lg font-black tracking-tight">
                  {item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {item.descricao}
            </p>

            {/* Ingredientes Detalhados (Hambúrgueres) */}
            {visualMeta.ingredients && visualMeta.ingredients.length > 0 && (
              <div className="bg-zinc-900/80 rounded-xl p-3 border border-zinc-800">
                <span className="text-[11px] font-black text-zinc-300 uppercase tracking-wider block mb-1.5">
                  🔥 O que vem neste lanche:
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {visualMeta.ingredients.map((ing, i) => (
                    <li key={i} className="text-xs text-zinc-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Seleção de Opções Extras (Espetos, Latas, Jantinha, etc.) */}
          {hasOptions && (
            <div className="px-4 sm:px-6 space-y-3">
              <div className="bg-zinc-900/60 rounded-2xl p-4 border border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      Escolha a sua opção
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                        Obrigatório
                      </span>
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Selecione 1 opção para este item:
                    </p>
                  </div>
                </div>

                {/* Lista de Opções em Rádio */}
                <div className="space-y-2">
                  {item.opcoesExtras!.map((opcao, idx) => {
                    const isSelected = selectedOption === opcao;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedOption(opcao);
                          setValidationError(null);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all active:scale-[0.99] cursor-pointer ${
                          isSelected
                            ? 'bg-red-600/15 border-red-500 text-white shadow-inner'
                            : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                              isSelected
                                ? 'bg-red-600 border-red-500 text-white'
                                : 'border-zinc-700 bg-zinc-950'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-xs sm:text-sm font-semibold">
                            {opcao}
                          </span>
                        </div>

                        <span className="text-xs font-bold text-zinc-400">
                          Incluso
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Campo de Observações */}
          <div className="p-4 sm:px-6 pt-5">
            <label
              htmlFor="item-notes"
              className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5 text-zinc-400" />
              Alguma observação do pedido?
            </label>
            <textarea
              id="item-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Ponto bem passado, sem vinagrete, mandar gelo..."
              rows={2}
              maxLength={140}
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all resize-none"
            />
            <span className="text-[10px] text-zinc-500 block text-right mt-1">
              {notes.length}/140 caracteres
            </span>
          </div>

          {/* Mensagem de Erro de Validação */}
          {validationError && (
            <div className="mx-4 sm:px-6 mb-2 p-3 rounded-xl bg-red-950/80 border border-red-600/60 flex items-center gap-2 text-xs font-bold text-red-200 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* BARRA INFERIOR FIXA (Thumb-Friendly Mobile-First) */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#111111]/98 backdrop-blur-md border-t border-zinc-800 p-3 sm:p-4 flex items-center gap-3 z-30 shadow-2xl">
          {/* Seletor de Quantidade (+ e -) */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 shrink-0">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Diminuir quantidade"
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="w-8 sm:w-9 text-center text-sm font-black text-white">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(20, q + 1))}
              aria-label="Aumentar quantidade"
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Botão Vermelho Vibrante de Adicionar com Total Recalculado */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-between bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-black px-4 py-3 sm:py-3.5 rounded-xl shadow-lg shadow-red-600/40 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="text-xs sm:text-sm uppercase tracking-wide">
                Adicionar ao Pedido
              </span>
            </div>

            {/* Total Atualizado em Tempo Real */}
            <span className="bg-white/20 px-2.5 py-1 rounded-lg text-xs sm:text-sm font-mono tracking-tight font-black">
              {totalPrice.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
