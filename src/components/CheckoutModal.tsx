import React, { useState } from 'react';
import {
  X,
  Bike,
  Store,
  MapPin,
  QrCode,
  CreditCard,
  Banknote,
  AlertCircle,
  CheckCircle2,
  Phone,
  User,
  ArrowLeft,
  MessageCircle,
  HelpCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { DeliveryMethod, PaymentMethod } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    items,
    checkout,
    subtotal,
    deliveryFee,
    total,
    isCheckoutOpen,
    closeCheckout,
    openCart,
    setDeliveryMethod,
    updateCustomer,
    updateAddress,
    updatePayment,
    submitOrder,
  } = useCart();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [exactChange, setExactChange] = useState<boolean>(!checkout.payment.changeFor);

  if (!isCheckoutOpen) return null;

  // Formatação de telefone brasileira
  const handlePhoneChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 11);
    let formatted = digits;
    if (digits.length > 2) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length > 7) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    updateCustomer({ phone: formatted });
    if (errors['customer.phone']) {
      setErrors((prev) => ({ ...prev, ['customer.phone']: '' }));
    }
  };

  // Busca automática de CEP pelo ViaCEP
  const handleCepChange = async (cepRaw: string) => {
    const digits = cepRaw.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;
    if (digits.length > 5) {
      formatted = `${digits.slice(0, 5)}-${digits.slice(5)}`;
    }
    updateAddress({ zipCode: formatted });

    if (digits.length === 8) {
      setIsLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        const data = await res.json();
        if (!data.erro) {
          updateAddress({
            street: data.logradouro || checkout.address?.street || '',
            neighborhood: data.bairro || checkout.address?.neighborhood || '',
          });
          // Limpa erros se houver
          setErrors((prev) => {
            const next = { ...prev };
            delete next['address.street'];
            delete next['address.neighborhood'];
            return next;
          });
        }
      } catch (err) {
        console.warn('Erro ao consultar ViaCEP', err);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  // Troco em dinheiro
  const handleExactChangeToggle = (isExact: boolean) => {
    setExactChange(isExact);
    if (isExact) {
      updatePayment({ changeFor: undefined });
    } else {
      updatePayment({ changeFor: Math.ceil(total / 10) * 10 });
    }
  };

  const handleFinalize = () => {
    const result = submitOrder();
    if (!result.isValid) {
      setErrors(result.errors);
      // Rolar até o topo do modal para visualizar os erros se necessário
      const modalContent = document.getElementById('checkout-scroll-content');
      if (modalContent) modalContent.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (result.whatsappUrl) {
      // Abre o WhatsApp
      window.open(result.whatsappUrl, '_blank');
      closeCheckout();
    }
  };

  const isDelivery = checkout.deliveryMethod === 'delivery';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={closeCheckout} aria-hidden="true" />

      {/* Caixa do Modal */}
      <div className="relative w-full sm:max-w-xl max-h-[94vh] sm:max-h-[90vh] bg-[#141414] border-t sm:border border-zinc-800 sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden z-10 transition-transform">
        {/* Barra superior de arraste móvel */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-zinc-700" />
        </div>

        {/* Topo do Checkout */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/70 shrink-0">
          <button
            onClick={() => {
              closeCheckout();
              openCart();
            }}
            type="button"
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar à sacola</span>
          </button>

          <div className="text-center">
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight font-sans">
              Finalizar Pedido
            </h2>
            <span className="text-[11px] font-bold text-amber-400">
              D' Quebrada Foods • Chapa Quente
            </span>
          </div>

          <button
            onClick={closeCheckout}
            type="button"
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo Rolável */}
        <div
          id="checkout-scroll-content"
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 no-scrollbar pb-6"
        >
          {/* Banner de Erros Gerais */}
          {Object.keys(errors).length > 0 && (
            <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-600/70 flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <div className="text-xs text-red-200">
                <p className="font-black uppercase tracking-wide">
                  Atenção aos dados obrigatórios:
                </p>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                  {Object.values(errors).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 1. SELETOR RÁPIDO ENTREGA VS RETIRADA */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-300">
              1. Como deseja receber seu pedido?
            </label>
            <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-2xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setDeliveryMethod('delivery')}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-black transition-all ${isDelivery
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/40'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
              >
                <Bike className="w-4 h-4" />
                <span>Entrega (Delivery)</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('pickup')}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-black transition-all ${!isDelivery
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/40'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
              >
                <Store className="w-4 h-4" />
                <span>Retirada no Balcão</span>
              </button>
            </div>

            {/* Aviso de Retirada */}
            {!isDelivery && (
              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2">
                <Store className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Retirada na <strong>Av. Principal da Quebrada, 1000</strong>. Fica pronto em cerca de 25-35 minutos!
                </span>
              </div>
            )}
          </div>

          {/* 2. DADOS DO CLIENTE */}
          <div className="space-y-3 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80">
            <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <User className="w-4 h-4 text-red-500" />
              2. Seus Dados de Contato
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Nome */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  value={checkout.customer.name}
                  onChange={(e) => {
                    updateCustomer({ name: e.target.value });
                    if (errors['customer.name']) {
                      setErrors((prev) => ({ ...prev, ['customer.name']: '' }));
                    }
                  }}
                  placeholder="Ex: Mauricio Silva"
                  className={`w-full bg-zinc-950 border rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-600 ${errors['customer.name'] ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-800'
                    }`}
                />
                {errors['customer.name'] && (
                  <span className="text-[10px] text-red-400 mt-1 block">
                    {errors['customer.name']}
                  </span>
                )}
              </div>

              {/* Telefone / WhatsApp */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-400" />
                  WhatsApp com DDD *
                </label>
                <input
                  type="tel"
                  value={checkout.customer.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className={`w-full bg-zinc-950 border rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-600 ${errors['customer.phone'] ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-800'
                    }`}
                />
                {errors['customer.phone'] && (
                  <span className="text-[10px] text-red-400 mt-1 block">
                    {errors['customer.phone']}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 3. ENDEREÇO DE ENTREGA (SE FOR ENTREGA) */}
          {isDelivery && (
            <div className="space-y-3 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-500" />
                  3. Endereço para Entrega
                </h3>
                <span className="text-[10px] font-bold text-zinc-500 uppercase">
                  Taxa: R$ 5,00
                </span>
              </div>

              {/* CEP com busca automática */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1 flex items-center justify-between">
                    <span>CEP</span>
                    {isLoadingCep && <Loader2 className="w-3 h-3 text-red-500 animate-spin" />}
                  </label>
                  <input
                    type="text"
                    value={checkout.address?.zipCode || ''}
                    onChange={(e) => handleCepChange(e.target.value)}
                    placeholder="00000-000"
                    maxLength={9}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>

                {/* Logradouro / Rua */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                    Rua / Avenida / Travessa *
                  </label>
                  <input
                    type="text"
                    value={checkout.address?.street || ''}
                    onChange={(e) => {
                      updateAddress({ street: e.target.value });
                      if (errors['address.street']) {
                        setErrors((prev) => ({ ...prev, ['address.street']: '' }));
                      }
                    }}
                    placeholder="Ex: Rua das Palmeiras"
                    className={`w-full bg-zinc-950 border rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-600 ${errors['address.street'] ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-800'
                      }`}
                  />
                  {errors['address.street'] && (
                    <span className="text-[10px] text-red-400 mt-1 block">
                      {errors['address.street']}
                    </span>
                  )}
                </div>
              </div>

              {/* Número e Bairro */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                    Número *
                  </label>
                  <input
                    type="text"
                    value={checkout.address?.number || ''}
                    onChange={(e) => {
                      updateAddress({ number: e.target.value });
                      if (errors['address.number']) {
                        setErrors((prev) => ({ ...prev, ['address.number']: '' }));
                      }
                    }}
                    placeholder="Ex: 450 ou S/N"
                    className={`w-full bg-zinc-950 border rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-600 ${errors['address.number'] ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-800'
                      }`}
                  />
                  {errors['address.number'] && (
                    <span className="text-[10px] text-red-400 mt-1 block">
                      {errors['address.number']}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    value={checkout.address?.neighborhood || ''}
                    onChange={(e) => {
                      updateAddress({ neighborhood: e.target.value });
                      if (errors['address.neighborhood']) {
                        setErrors((prev) => ({ ...prev, ['address.neighborhood']: '' }));
                      }
                    }}
                    placeholder="Ex: Vila Esperança"
                    className={`w-full bg-zinc-950 border rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-600 ${errors['address.neighborhood']
                        ? 'border-red-500 ring-1 ring-red-500'
                        : 'border-zinc-800'
                      }`}
                  />
                  {errors['address.neighborhood'] && (
                    <span className="text-[10px] text-red-400 mt-1 block">
                      {errors['address.neighborhood']}
                    </span>
                  )}
                </div>
              </div>

              {/* Complemento e Ponto de Referência */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                    Complemento (Opcional)
                  </label>
                  <input
                    type="text"
                    value={checkout.address?.complement || ''}
                    onChange={(e) => updateAddress({ complement: e.target.value })}
                    placeholder="Ex: Bloco B, Apto 102, Casa 2"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                    Ponto de Referência
                  </label>
                  <input
                    type="text"
                    value={checkout.address?.referencePoint || ''}
                    onChange={(e) => updateAddress({ referencePoint: e.target.value })}
                    placeholder="Ex: Em frente ao campinho, ao lado da padaria"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. FORMA DE PAGAMENTO */}
          <div className="space-y-3 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80">
            <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <Banknote className="w-4 h-4 text-red-500" />
              {isDelivery ? '4. Forma de Pagamento' : '3. Forma de Pagamento'}
            </h3>

            {/* Opções de Pagamento (PIX, Cartão, Dinheiro) */}
            <div className="grid grid-cols-3 gap-2">
              {/* PIX */}
              <button
                type="button"
                onClick={() => updatePayment({ method: 'pix' })}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${checkout.payment.method === 'pix'
                    ? 'bg-red-600/15 border-red-500 text-white shadow-inner'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
              >
                <QrCode
                  className={`w-5 h-5 ${checkout.payment.method === 'pix' ? 'text-red-400' : 'text-zinc-500'
                    }`}
                />
                <span className="text-xs font-black">PIX</span>
                <span className="text-[10px] text-emerald-400 font-bold">Imediato</span>
              </button>

              {/* CARTÃO */}
              <button
                type="button"
                onClick={() => updatePayment({ method: 'card_on_delivery' })}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${checkout.payment.method === 'card_on_delivery'
                    ? 'bg-red-600/15 border-red-500 text-white shadow-inner'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
              >
                <CreditCard
                  className={`w-5 h-5 ${checkout.payment.method === 'card_on_delivery' ? 'text-red-400' : 'text-zinc-500'
                    }`}
                />
                <span className="text-xs font-black">Cartão</span>
                <span className="text-[10px] text-zinc-400">Na Entrega</span>
              </button>

              {/* DINHEIRO */}
              <button
                type="button"
                onClick={() => updatePayment({ method: 'cash' })}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${checkout.payment.method === 'cash'
                    ? 'bg-red-600/15 border-red-500 text-white shadow-inner'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
              >
                <Banknote
                  className={`w-5 h-5 ${checkout.payment.method === 'cash' ? 'text-red-400' : 'text-zinc-500'
                    }`}
                />
                <span className="text-xs font-black">Dinheiro</span>
                <span className="text-[10px] text-amber-400">Com Troco</span>
              </button>
            </div>

            {/* DETALHES DE ACORDO COM O MÉTODO DE PAGAMENTO SELECIONADO */}
            {/* Se PIX: Aviso que a chave/QR Code será enviado no atendimento */}
            {checkout.payment.method === 'pix' && (
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 space-y-1.5 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 text-emerald-400 font-black">
                  <QrCode className="w-4 h-4" />
                  <span>Pagamento via Chave PIX / QR Code</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Ao enviar o pedido pelo WhatsApp, nosso atendente enviará a <strong>chave PIX e ou QR Code</strong> para confirmação e liberação imediata na cozinha!
                </p>
              </div>
            )}

            {/* Se Cartão: Débito ou Crédito */}
            {checkout.payment.method === 'card_on_delivery' && (
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 animate-in fade-in duration-150">
                <span className="block text-[11px] font-bold text-zinc-400 uppercase">
                  Qual o tipo do seu cartão?
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updatePayment({ cardType: 'credit' })}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${checkout.payment.cardType === 'credit'
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                  >
                    💳 Cartão de Crédito
                  </button>
                  <button
                    type="button"
                    onClick={() => updatePayment({ cardType: 'debit' })}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${checkout.payment.cardType === 'debit'
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                  >
                    💳 Cartão de Débito
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500">
                  O entregador levará a máquina de cartão sem fio até você.
                </p>
              </div>
            )}

            {/* Se Dinheiro: Campo "Troco para quanto?" */}
            {checkout.payment.method === 'cash' && (
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 animate-in fade-in duration-150">
                <span className="block text-[11px] font-bold text-zinc-400 uppercase">
                  Precisa de troco?
                </span>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exactChange}
                      onChange={(e) => handleExactChangeToggle(e.target.checked)}
                      className="w-4 h-4 rounded text-red-600 accent-red-600 bg-zinc-900 border-zinc-700"
                    />
                    <span>Não preciso de troco (Valor exato)</span>
                  </label>
                </div>

                {!exactChange && (
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase">
                      Troco para quanto? (R$)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">
                        R$
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min={total}
                        value={checkout.payment.changeFor || ''}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          updatePayment({ changeFor: isNaN(val) ? undefined : val });
                          if (errors['payment.changeFor']) {
                            setErrors((prev) => ({ ...prev, ['payment.changeFor']: '' }));
                          }
                        }}
                        placeholder={`Mínimo: ${total.toFixed(2)}`}
                        className={`w-full bg-zinc-900 border rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-600 ${errors['payment.changeFor']
                            ? 'border-red-500 ring-1 ring-red-500'
                            : 'border-zinc-800'
                          }`}
                      />
                    </div>
                    {errors['payment.changeFor'] && (
                      <span className="text-[10px] text-red-400 mt-1 block">
                        {errors['payment.changeFor']}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 5. RESUMO DE VALORES COM ETIQUETA BRANCA */}
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 space-y-2">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
              <span className="font-bold text-zinc-200">
                {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>

            <div className="flex justify-between text-xs text-zinc-400">
              <span>Taxa de Entrega</span>
              <span className={deliveryFee > 0 ? 'font-bold text-zinc-200' : 'font-bold text-emerald-400'}>
                {deliveryFee > 0
                  ? deliveryFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                  : 'Grátis (Retirada)'}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
              <span className="text-sm font-black text-white uppercase tracking-wider">
                Total do Pedido
              </span>

              {/* Etiqueta de Preço em Fundo Branco (Design System) */}
              <div className="inline-flex items-center gap-1.5 bg-white text-zinc-900 font-extrabold px-3 py-1 rounded shadow-md">
                <span className="text-xs font-black uppercase text-zinc-600">Total</span>
                <span className="text-base sm:text-lg font-black tracking-tight">
                  {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BARRA INFERIOR FIXA (Thumb-Friendly Mobile-First) */}
        <div className=" bottom-0 left-0 right-0 bg-[#111111]/95 backdrop-blur-md border-t border-zinc-800 p-3 sm:p-4 flex items-center gap-3 z-30">
          <button
            type="button"
            onClick={handleFinalize}
            className="w-full flex items-center justify-between bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-black px-4 py-3 sm:py-3.5 rounded-xl shadow-lg shadow-red-600/40 transition-all group"
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="text-xs sm:text-sm uppercase tracking-wide">
                Finalizar e Enviar via WhatsApp
              </span>
            </div>

            <span className="bg-white/20 px-2.5 py-1 rounded-lg text-xs sm:text-sm font-mono tracking-tight font-black">
              {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
