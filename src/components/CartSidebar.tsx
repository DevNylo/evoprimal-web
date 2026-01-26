import { useState } from "react";
import { X, Trash2, ShoppingBag, CreditCard, Loader2, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartSidebar() {
  const { cart, isCartOpen, closeCart, removeFromCart, addToCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  async function handleCheckout() {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Redirecionando para o Gateway de Pagamento...");
    } catch (error) {
      console.error("Erro no checkout:", error);
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <>
      {/* OVERLAY (Fundo escuro) */}
      {/* Ajustado para top-20 para não escurecer a Navbar */}
      <div 
        className={`fixed inset-0 top-20 bg-black/80 backdrop-blur-sm z-[40] transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* SIDEBAR */}
      {/* Ajustado: top-20 (altura da navbar) e h-[calc(100vh-5rem)] (altura total - navbar) */}
      {/* Z-Index baixado para 45 para ficar abaixo de alertas, mas acima do conteúdo, se a navbar for z-50 */}
      <div 
        className={`
          fixed top-20 right-0 
          h-[calc(100vh-5rem)] w-full sm:w-[450px] 
          bg-[#090909] border-l border-white/10 border-t 
          z-[50] 
          transform transition-transform duration-300 ease-out shadow-2xl flex flex-col
          ${isCartOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
          {/* 1. CABEÇALHO (Fixo) */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#050505] shrink-0">
            <h2 className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
              <ShoppingBag size={20} className="text-green-500" />
              Carrinho <span className="text-zinc-600 text-sm font-bold">({cart.length})</span>
            </h2>
            <button 
              onClick={closeCart} 
              className="p-2 bg-zinc-900/50 rounded-full text-zinc-500 hover:text-white hover:bg-red-500/20 hover:text-red-500 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* 2. LISTA DE PRODUTOS (Scrollável) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
                  <ShoppingBag size={64} className="relative text-zinc-700" />
                </div>
                <div className="text-center">
                   <p className="text-lg font-black uppercase tracking-tight text-white">Seu carrinho está vazio</p>
                   <p className="text-xs text-zinc-500 mt-1">Adicione suplementos para começar.</p>
                </div>
                <button 
                  onClick={closeCart} 
                  className="px-6 py-3 bg-zinc-800 hover:bg-green-600 text-white text-xs font-bold uppercase tracking-widest rounded transition-all"
                >
                  Ver Produtos
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="group flex gap-4 bg-[#111] p-3 rounded-xl border border-white/5 hover:border-green-500/30 transition-colors animate-in slide-in-from-right duration-500">
                  <div className="w-24 h-24 bg-[#050505] rounded-lg flex items-center justify-center border border-white/5 shrink-0 overflow-hidden relative">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-white font-bold text-sm uppercase line-clamp-2 leading-tight">
                          {item.name}
                        </h3>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-600 hover:text-red-500 transition-colors -mt-1 -mr-1 p-1"
                          title="Remover item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-green-500 text-xs font-bold uppercase mt-1">Em Estoque</p>
                    </div>
                    <div className="flex items-end justify-between mt-2">
                      <div className="flex items-center gap-3 bg-[#050505] rounded-lg p-1 border border-white/5">
                         <span className="text-xs font-bold text-white px-2">Qtd: {item.quantity}</span>
                         <button 
                           onClick={() => addToCart(item)} 
                           className="w-6 h-6 flex items-center justify-center bg-zinc-800 hover:bg-green-600 text-white rounded transition-colors"
                         >
                           <Plus size={12} />
                         </button>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-zinc-500 uppercase font-bold">Total Item</span>
                        <span className="text-white font-black text-sm">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 3. CHECKOUT FOOTER (Fixo no fundo) */}
          <div className="p-6 bg-[#050505] border-t border-white/5 space-y-4 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-10">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-zinc-400 text-xs uppercase font-bold tracking-wider">
                  <span>Subtotal</span>
                  <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
                </div>
                {cart.length > 0 && (
                  <div className="flex items-center justify-between text-zinc-400 text-xs uppercase font-bold tracking-wider">
                    <span>Frete</span>
                    <span className="text-green-500">Grátis</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-white font-black text-xl uppercase tracking-tight pt-2 border-t border-white/5 mt-2">
                  <span>Total</span>
                  <span className="text-green-500 text-2xl">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                disabled={isCheckingOut || cart.length === 0} 
                className="w-full group bg-green-600 hover:bg-green-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-white py-4 rounded-lg font-black uppercase tracking-[0.2em] transition-all hover:-translate-y-1 active:translate-y-0 shadow-[0_0_20px_rgba(22,163,74,0.3)] hover:shadow-[0_0_30px_rgba(22,163,74,0.5)] flex items-center justify-center gap-3 relative overflow-hidden"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Processando...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} className="group-hover:scale-110 transition-transform" /> 
                    Finalizar Compra
                  </>
                )}
              </button>
              
              <div className="flex flex-col items-center gap-2 pt-2">
                <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-wider flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></span> 
                   Ambiente 100% Seguro
                </p>
              </div>
          </div>
      </div>
    </>
  );
}