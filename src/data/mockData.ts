import { CategoriaCardapio, ItemCardapio } from '../types';

export const cardapioDQuebrada: CategoriaCardapio[] = [
  {
    id: "artesanais",
    titulo: "Artesanais",
    subtitulo: "Quebra e Manda!",
    itens: [
      {
        id: 1,
        nome: "Parça",
        preco: 18.00,
        descricao: "Pão francês, hambúrguer artesanal, queijo cheddar, maionese da casa, barbecue e vinagrete."
      },
      {
        id: 2,
        nome: "Pod Pá",
        preco: 25.00,
        descricao: "Pão francês, maionese da casa, hambúrguer artesanal, queijo cheddar, barbecue e bacon."
      },
      {
        id: 3,
        nome: "D 'quebrada",
        preco: 35.00,
        descricao: "Pão francês, maionese da casa, 2 hambúrgueres artesanais , creme de cheddar, cebola caramelizada, barbecue e farofa de bacon."
      }
    ]
  },
  {
    id: "acompanhamentos",
    titulo: "Acompanhamentos",
    subtitulo: "Quebra e Manda!",
    itens: [
      {
        id: 4,
        nome: "Fritas",
        preco: 20.00,
        descricao: "Porção de batata frita, crocante e sequinha."
      },
      {
        id: 5,
        nome: "Fritas especial",
        preco: 25.00,
        descricao: "Porção de batata frita crocante e sequinha, cheddar e bacon triturado."
      },
      {
        id: 6,
        nome: "Onion rings",
        preco: 20.00,
        descricao: "Anéis de cebola fritos, crocantes e sequinhos."
      },
      {
        id: 7,
        nome: "Nuggets Supreme",
        preco: 20.00,
        descricao: "Nuggets de frango fritos, crocantes e sequinhos."
      }
    ]
  },
  {
    id: "churras-jantinha",
    titulo: "Vai um Churras?",
    subtitulo: "Quebra e Manda!",
    itens: [
      {
        id: 8,
        nome: "Espetos (Unidade)",
        preco: 10.00,
        descricao: "Escolha o sabor do espeto no pedido.",
        opcoesExtras: [
          "Carne",
          "Frango",
          "Queijo coalho",
          "Linguiça toscana",
          "Linguiça apimentada",
          "Coração de galinha",
          "Medalhão de frango",
          "Medalhão de codorna"
        ]
      },
      {
        id: 9,
        nome: "Jantinha",
        preco: 20.00,
        descricao: "Baião de dois, Vinagrete, 1 espeto de sua escolha.",
        opcoesExtras: [
          "Carne",
          "Frango",
          "Queijo coalho",
          "Linguiça toscana",
          "Linguiça apimentada",
          "Coração de galinha",
          "Medalhão de frango",
          "Medalhão de codorna"
        ]
      }
    ]
  },
  {
    id: "bebidas",
    titulo: "Bebidas",
    subtitulo: "Geladadas",
    itens: [
      {
        id: 10,
        nome: "Lata (350ml / Del Valle 290ml)",
        preco: 7.00,
        descricao: "Opções disponíveis: Coca-cola Zero, Coca-cola Original, Guaraná, Sprite, Suco Del Valle.",
        opcoesExtras: [
          "Coca-cola Zero (350ml)",
          "Coca-cola Original (350ml)",
          "Guaraná (350ml)",
          "Sprite (350ml)",
          "Suco Del Valle (290ml)"
        ]
      },
      {
        id: 11,
        nome: "Caçulinha (200ml)",
        preco: 4.00,
        descricao: "Opções disponíveis: Coca-cola Zero, Coca-cola Original, Guaraná, Sprite.",
        opcoesExtras: [
          "Coca-cola Zero (200ml)",
          "Coca-cola Original (200ml)",
          "Guaraná (200ml)",
          "Sprite (200ml)"
        ]
      }
    ]
  }
];

// Metadados visuais para manter 100% o UX/UI (fotos de alta qualidade, tipo de pão e badges)
export interface ItemVisualMeta {
  imageUrl: string;
  badge?: string;
  breadType?: string;
  ingredients?: string[];
}

export const ITEM_VISUAL_METADATA: Record<number, ItemVisualMeta> = {
  1: {
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    badge: "Favorito",
    breadType: "Pão Francês Crocante",
    ingredients: ["Hambúrguer artesanal", "Queijo cheddar", "Maionese da casa", "Barbecue", "Vinagrete"],
  },
  2: {
    imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    badge: "Clássico",
    breadType: "Pão Francês Crocante",
    ingredients: ["Hambúrguer artesanal", "Queijo cheddar", "Bacon crocante", "Maionese da casa", "Barbecue"],
  },
  3: {
    imageUrl: "https://images.unsplash.com/photo-1582196016295-f8c8bd4b3e99?auto=format&fit=crop&w=800&q=80",
    badge: "Mais Pedido",
    breadType: "Pão Francês Crocante",
    ingredients: ["2x Hambúrgueres artesanais", "Creme de cheddar", "Cebola caramelizada", "Farofa de bacon", "Barbecue"],
  },
  4: {
    imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    badge: "Crocante",
  },
  5: {
    imageUrl: "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80",
    badge: "Top Vendas",
  },
  6: {
    imageUrl: "https://images.unsplash.com/photo-1639024471287-035186f5552d?auto=format&fit=crop&w=800&q=80",
  },
  7: {
    imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",
    badge: "Supreme",
  },
  8: {
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    badge: "Na Brasa",
  },
  9: {
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    badge: "Completaço",
  },
  10: {
    imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80",
    badge: "Geladinha",
  },
  11: {
    imageUrl: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=800&q=80",
    badge: "200ml",
  },
};

export const getItemVisualMeta = (itemId: number): ItemVisualMeta => {
  return (
    ITEM_VISUAL_METADATA[itemId] || {
      imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    }
  );
};
