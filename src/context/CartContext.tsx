import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  CartItem,
  ItemCardapio,
  CheckoutData,
  DeliveryMethod,
  PaymentDetails,
  CustomerData,
  DeliveryAddress,
  OrderState,
  validateCheckoutData,
  formatOrderToWhatsAppMessage,
  generateWhatsAppOrderLink,
} from '../types';


interface SubmitOrderResult {
  isValid: boolean;
  errors: Record<string, string>;
  order?: OrderState;
  whatsappUrl?: string;
}

interface CartContextData {
  items: CartItem[];
  addToCart: (item: ItemCardapio, quantity: number, selectedOption?: string, notes?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
  totalItemsCount: number;

  // Feedback do último item adicionado (Toast)
  lastAddedItemName: string | null;
  clearLastAddedNotification: () => void;

  // Controle de gaveta/modal
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;

  // Checkout State & Actions
  checkout: CheckoutData;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  updateCustomer: (customer: Partial<CustomerData>) => void;
  updateAddress: (address: Partial<DeliveryAddress>) => void;
  updatePayment: (payment: Partial<PaymentDetails>) => void;
  submitOrder: (whatsappNumber?: string) => SubmitOrderResult;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

const CART_STORAGE_KEY = 'dquebrada_cart_v2';
const CHECKOUT_STORAGE_KEY = 'dquebrada_checkout_v2';

const DEFAULT_CHECKOUT: CheckoutData = {
  customer: {
    name: '',
    phone: '',
  },
  deliveryMethod: 'delivery',
  address: {
    street: '',
    number: '',
    neighborhood: '',
    complement: '',
    referencePoint: '',
    zipCode: '',
  },
  payment: {
    method: 'pix',
    cardType: 'credit',
  },
};

const DEFAULT_DELIVERY_FEE = 5.0; // R$ 5,00 para entrega

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Itens do carrinho
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  // Dados do checkout
  const [checkout, setCheckout] = useState<CheckoutData>(() => {
    try {
      const stored = localStorage.getItem(CHECKOUT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_CHECKOUT,
          ...parsed,
          customer: { ...DEFAULT_CHECKOUT.customer, ...(parsed.customer || {}) },
          address: { ...DEFAULT_CHECKOUT.address, ...(parsed.address || {}) },
          payment: { ...DEFAULT_CHECKOUT.payment, ...(parsed.payment || {}) },
        };
      }
    } catch { }
    return DEFAULT_CHECKOUT;
  });

  // Modais
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastAddedItemName, setLastAddedItemName] = useState<string | null>(null);

  // Persistência
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Falha ao salvar carrinho no storage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(checkout));
    } catch (e) {
      console.error('Falha ao salvar dados de checkout no storage', e);
    }
  }, [checkout]);

  // Limpa toast após 3.5 segundos
  useEffect(() => {
    if (lastAddedItemName) {
      const timer = setTimeout(() => {
        setLastAddedItemName(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [lastAddedItemName]);

  // Ações do Carrinho
  const addToCart = (
    item: ItemCardapio,
    quantity: number,
    selectedOption?: string,
    notes?: string
  ) => {
    const qty = Math.max(1, quantity);
    const subtotal = item.preco * qty;

    setItems((prevItems) => {
      const safePrev = Array.isArray(prevItems) ? prevItems : [];
      const existingIndex = safePrev.findIndex(
        (ci) =>
          ci.item.id === item.id &&
          (ci.selectedOption || '') === (selectedOption || '') &&
          (ci.notes || '').trim() === (notes || '').trim()
      );

      if (existingIndex > -1) {
        const next = [...safePrev];
        const existing = next[existingIndex];
        const newQty = existing.quantity + qty;
        next[existingIndex] = {
          ...existing,
          quantity: newQty,
          subtotal: existing.item.preco * newQty,
        };
        return next;
      }

      const newCartItem: CartItem = {
        cartItemId: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        item,
        quantity: qty,
        selectedOption: selectedOption || undefined,
        notes: notes?.trim() || undefined,
        subtotal,
      };

      return [...safePrev, newCartItem];
    });

    // Feedback visual e abertura do carrinho para confirmação imediata
    setLastAddedItemName(item.nome);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => (Array.isArray(prev) ? prev.filter((i) => i.cartItemId !== cartItemId) : []));
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      Array.isArray(prev)
        ? prev.map((item) => {
          if (item.cartItemId === cartItemId) {
            return {
              ...item,
              quantity: newQuantity,
              subtotal: item.item.preco * newQuantity,
            };
          }
          return item;
        })
        : []
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const clearLastAddedNotification = () => {
    setLastAddedItemName(null);
  };

  // Cálculos de Valores
  const subtotal = useMemo(() => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  }, [items]);

  const deliveryFee = useMemo(() => {
    if (checkout.deliveryMethod === 'pickup' || items.length === 0) return 0;
    return DEFAULT_DELIVERY_FEE;
  }, [checkout.deliveryMethod, items.length]);

  const total = useMemo(() => {
    return subtotal + deliveryFee;
  }, [subtotal, deliveryFee]);

  const totalItemsCount = useMemo(() => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((count, item) => count + (item.quantity || 0), 0);
  }, [items]);

  // Ações de Navegação dos Modais
  const openCart = () => {
    setIsCheckoutOpen(false);
    setIsCartOpen(true);
  };
  const closeCart = () => setIsCartOpen(false);

  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  // Ações do Checkout
  const setDeliveryMethod = (method: DeliveryMethod) => {
    setCheckout((prev) => ({
      ...prev,
      deliveryMethod: method,
    }));
  };

  const updateCustomer = (customer: Partial<CustomerData>) => {
    setCheckout((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        ...customer,
      },
    }));
  };

  const updateAddress = (address: Partial<DeliveryAddress>) => {
    setCheckout((prev) => ({
      ...prev,
      address: {
        ...(prev.address || DEFAULT_CHECKOUT.address!),
        ...address,
      },
    }));
  };

  const updatePayment = (payment: Partial<PaymentDetails>) => {
    setCheckout((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        ...payment,
      },
    }));
  };

  // Finalizar e Validar Pedido
  const submitOrder = (whatsappNumber = '+5511957807527'): SubmitOrderResult => {
    if (items.length === 0) {
      return {
        isValid: false,
        errors: { items: 'Sua sacola está vazia. Adicione itens antes de finalizar.' },
      };
    }

    const validation = validateCheckoutData(checkout, total);
    if (!validation.isValid) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    const orderPayload: OrderState = {
      id: `#DQ-${Math.floor(1000 + Math.random() * 9000)}`,
      items,
      checkout,
      subtotal,
      deliveryFee,
      total,
      status: 'pending',
      createdAt: new Date(),
    };

    const whatsappUrl = generateWhatsAppOrderLink(orderPayload, whatsappNumber);

    return {
      isValid: true,
      errors: {},
      order: orderPayload,
      whatsappUrl,
    };
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        deliveryFee,
        total,
        totalItemsCount,
        lastAddedItemName,
        clearLastAddedNotification,
        isCartOpen,
        openCart,
        closeCart,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        checkout,
        setDeliveryMethod,
        updateCustomer,
        updateAddress,
        updatePayment,
        submitOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
