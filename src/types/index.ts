/**
 * Modelos de dados e tipos TypeScript para o Cardápio Online da Hamburgueria "D' Quebrada Foods"
 */

// ==========================================
// 1. ESTRUTURA DO CARDÁPIO (ItemCardapio & CategoriaCardapio)
// ==========================================

export interface ItemCardapio {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  opcoesExtras?: string[]; // Útil para categorias como espetos ou variações
}

export interface CategoriaCardapio {
  id: string;
  titulo: string;
  subtitulo?: string;
  itens: ItemCardapio[];
}

// Aliases para máxima compatibilidade sem quebrar imports
export type MenuItem = ItemCardapio;
export type Category = CategoriaCardapio;

// ==========================================
// 2. ITEM DO CARRINHO
// ==========================================

export interface CartItem {
  /** ID único gerado para esta linha do carrinho */
  cartItemId: string;
  /** Referência ao item original do cardápio */
  item: ItemCardapio;
  /** Quantidade selecionada do item (mínimo: 1) */
  quantity: number;
  /** Opção extra escolhida pelo cliente (ex: Sabor do espeto ou refrigerante da lata) */
  selectedOption?: string;
  /** Observações específicas para este item (ex: "Sem cebola", "Ponto bem passado") */
  notes?: string;
  /** Preço total desta linha (item.preco * quantity) */
  subtotal: number;
}

// ==========================================
// 3. CLIENTE, ENTREGA E PAGAMENTO (CHECKOUT)
// ==========================================

export type DeliveryMethod = 'delivery' | 'pickup';

export type PaymentMethod = 
  | 'pix' 
  | 'card_on_delivery' // Cartão de crédito/débito na entrega
  | 'cash';            // Dinheiro físico

export interface DeliveryAddress {
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  referencePoint?: string;
  zipCode?: string;
}

export interface CustomerData {
  name: string;
  phone: string;
}

export interface PaymentDetails {
  method: PaymentMethod;
  changeFor?: number;
  cardType?: 'credit' | 'debit' | 'voucher';
}

export interface CheckoutData {
  customer: CustomerData;
  deliveryMethod: DeliveryMethod;
  address?: DeliveryAddress;
  payment: PaymentDetails;
}

// ==========================================
// 4. ESTADO GERAL DO PEDIDO
// ==========================================

export type OrderStatus = 
  | 'draft'
  | 'pending'
  | 'sent'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';

export interface OrderState {
  id?: string;
  items: CartItem[];
  checkout: CheckoutData;
  subtotal: number;
  deliveryFee: number;
  discount?: number;
  total: number;
  status: OrderStatus;
  createdAt: Date | string;
}

// ==========================================
// 5. VALIDAÇÃO E FORMATAÇÃO DE WHATSAPP
// ==========================================

export interface OrderValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateCheckoutData(
  checkout: CheckoutData,
  totalOrderAmount: number
): OrderValidationResult {
  const errors: Record<string, string> = {};

  if (!checkout.customer.name?.trim()) {
    errors['customer.name'] = 'O nome do cliente é obrigatório.';
  }

  const cleanPhone = checkout.customer.phone?.replace(/\D/g, '') || '';
  if (cleanPhone.length < 10 || cleanPhone.length > 11) {
    errors['customer.phone'] = 'Informe um telefone/WhatsApp válido com DDD (10 ou 11 dígitos).';
  }

  if (checkout.deliveryMethod === 'delivery') {
    if (!checkout.address?.street?.trim()) {
      errors['address.street'] = 'O logradouro/rua é obrigatório para entrega.';
    }
    if (!checkout.address?.number?.trim()) {
      errors['address.number'] = 'O número é obrigatório para entrega.';
    }
    if (!checkout.address?.neighborhood?.trim()) {
      errors['address.neighborhood'] = 'O bairro é obrigatório para entrega.';
    }
  }

  if (checkout.payment.method === 'cash') {
    if (checkout.payment.changeFor !== undefined && checkout.payment.changeFor < totalOrderAmount) {
      errors['payment.changeFor'] = `O troco para R$ ${checkout.payment.changeFor.toFixed(2)} deve ser maior ou igual ao total do pedido (R$ ${totalOrderAmount.toFixed(2)}).`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export {
  formatOrderToWhatsAppMessage,
  generateWhatsAppOrderLink,
  formatCurrency,
} from '../utils/whatsapp';

