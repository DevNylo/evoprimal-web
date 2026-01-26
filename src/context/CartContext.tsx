import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
// Importamos o tipo Product do outro contexto para garantir compatibilidade
import { type Product } from "./StoreContext";

// Definimos que um CartItem é um Produto + a quantidade
export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  // A MUDANÇA ESTÁ AQUI: Agora aceitamos 'Product' na entrada
  addToCart: (product: Product) => void; 
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, type: 'increment' | 'decrement') => void;
  cartCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
  // Inicializa lendo do localStorage para não perder o carrinho ao atualizar
  const [cart, setCart] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem("@evoprimal:cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Salva no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("@evoprimal:cart", JSON.stringify(cart));
  }, [cart]);

  // FUNÇÃO CORRIGIDA
  function addToCart(product: Product) {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      if (existingItem) {
        // Se já existe, apenas aumenta a quantidade
        return prev.map((item) =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // SE É NOVO: Cria o CartItem adicionando quantity: 1
        // O 'as CartItem' garante ao TypeScript que agora está tudo certo
        const newItem: CartItem = { ...product, quantity: 1 };
        
        setIsCartOpen(true); // Abre o carrinho para dar feedback
        return [...prev, newItem];
      }
    });
  }

  function removeFromCart(id: number) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function updateQuantity(id: number, type: 'increment' | 'decrement') {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = type === 'increment' ? item.quantity + 1 : item.quantity - 1;
        return { ...item, quantity: newQuantity < 1 ? 1 : newQuantity };
      }
      return item;
    }));
  }

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);