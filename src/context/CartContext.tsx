import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
// Importamos o tipo Product do outro contexto para garantir compatibilidade
// Certifique-se de que o caminho "./StoreContext" está correto
import { type Product } from "./StoreContext";

// Definimos que um CartItem é um Produto + a quantidade
export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void; 
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, type: 'increment' | 'decrement') => void;
  cartCount: number;
  total: number; // <--- ADICIONADO: O Checkout precisa disso
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void; // Útil para limpar após a compra
}

// Inicializa o contexto com um valor padrão vazio (mas tipado)
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
        const newItem: CartItem = { ...product, quantity: 1 };
        
        setIsCartOpen(true); // Abre o carrinho para dar feedback visual
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
        // Se for decrementar e já for 1, mantém 1 (ou poderia remover, depende da regra)
        if (type === 'decrement' && item.quantity === 1) {
            return item; 
        }
        const newQuantity = type === 'increment' ? item.quantity + 1 : item.quantity - 1;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  }

  function clearCart() {
    setCart([]);
  }

  // CÁLCULOS DERIVADOS (Calculados a cada renderização baseados no estado 'cart')
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  // <--- ADICIONADO: Cálculo do preço total
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        total, // <--- Exportando o total para ser usado no CheckoutPage
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);