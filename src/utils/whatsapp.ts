import { OrderState } from '../types';

/**
 * Formata um valor numérico para o padrão de moeda brasileiro (R$ 0,00)
 */
export const formatCurrency = (val: number): string => {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

/**
 * Gera o texto do pedido formatado exclusivamente para leitura rápida no WhatsApp
 */
export function formatOrderToWhatsAppMessage(order: OrderState): string {
  const isDelivery = order.checkout.deliveryMethod === 'delivery';

  // 1. Cabeçalho e Dados do Cliente
  const orderId = order.id ? order.id.replace(/^#/, '') : Date.now().toString().slice(-4);
  const tipo = isDelivery ? 'Entrega' : 'Retirada';

  let text = `🍔 *NOVO PEDIDO #${orderId}*\n`;
  text += `----------------------------------\n`;
  text += `*Cliente:* ${order.checkout.customer.name}\n`;
  text += `*Telefone:* ${order.checkout.customer.phone}\n`;
  text += `*Tipo:* ${tipo}\n\n`;

  // 2. Endereço de Entrega (se for entrega) ou Ponto de Retirada
  if (isDelivery && order.checkout.address) {
    const { street, number, neighborhood, complement, referencePoint } = order.checkout.address;
    text += `📍 *Endereço de Entrega:*\n`;
    text += `*Rua:* _${street}_\n`;
    text += `*Nº:* _${number}_\n`;
    text += `*Bairro:* _${neighborhood}_\n`;
    if (complement?.trim()) {
      text += `*Complemento:* _${complement.trim()}_
`;
    }
    if (referencePoint?.trim()) {
      text += `*Ref:* _${referencePoint.trim()}_
`;
    }
    text += `\n`;
  } else {
    text += `📍 *Retirada no Balcão:*\n`;
    text += `Av. Principal da Quebrada, 1000\n\n`;
  }

  // 3. Itens do Pedido
  text += `📝 *ITENS DO PEDIDO:*\n`;
  const itemsText = order.items
    .map((cartItem) => {
      let itemLine = `*• ${cartItem.quantity}x ${cartItem.item.nome}* (${formatCurrency(cartItem.subtotal)})`;

      if (cartItem.selectedOption) {
        itemLine += `\n *Opção:* _${cartItem.selectedOption}_`;
      }

      if (cartItem.notes?.trim()) {
        itemLine += `\n *Obs:* _${cartItem.notes.trim()}_`;
      }

      return itemLine;
    })
    .join('\n');
  text += `${itemsText}\n\n`;

  // 4. Totais e Taxas
  text += `----------------------------------\n`;
  text += `*Subtotal:* ${formatCurrency(order.subtotal)}\n`;
  text += `*Taxa de Entrega:* ${isDelivery ? formatCurrency(order.deliveryFee) : 'Grátis'}\n`;
  if (order.discount && order.discount > 0) {
    text += `*Desconto:* -${formatCurrency(order.discount)}\n`;
  }
  text += `*TOTAL:* *${formatCurrency(order.total)}*\n`;
  text += `----------------------------------\n`;

  // 5. Forma de Pagamento
  let paymentInfo = '';
  switch (order.checkout.payment.method) {
    case 'pix':
      paymentInfo = 'PIX (Chave/QR Code a enviar)';
      break;
    case 'card_on_delivery': {
      const tipoCartao = order.checkout.payment.cardType === 'debit' ? 'Débito' : 'Crédito';
      paymentInfo = `Cartão na Entrega (${tipoCartao})`;
      break;
    }
    case 'cash':
      if (order.checkout.payment.changeFor && order.checkout.payment.changeFor > 0) {
        paymentInfo = `Dinheiro (Troco para ${formatCurrency(order.checkout.payment.changeFor)})`;
      } else {
        paymentInfo = 'Dinheiro (Não precisa de troco)';
      }
      break;
    default:
      paymentInfo = 'A combinar';
  }
  text += `💳 *Pagamento:* ${paymentInfo}\n`;

  return text;
}

/**
 * Cria o link direto do WhatsApp (wa.me) pronto para envio, usando encodeURIComponent
 *
 * @param order Objeto completo do pedido
 * @param phoneNumber Número do WhatsApp do estabelecimento (ex: "+5511957807527" ou "5511957807527")
 * @returns URL completa com o texto encodado: https://wa.me/PHONE_NUMBER?text=MENSAGEM_ENCODADA
 */
export function generateWhatsAppOrderLink(
  order: OrderState,
  phoneNumber: string = '5511957807527'
): string {
  // Limpa o número para deixar apenas dígitos
  const cleanPhone = phoneNumber.replace(/\D/g, '');

  // Gera a mensagem formatada para WhatsApp
  const message = formatOrderToWhatsAppMessage(order);

  // Encodifica para evitar quebras em navegadores/mobile
  const encodedText = encodeURIComponent(message);

  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
