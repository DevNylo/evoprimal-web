import { X, Trash2, ShoppingBag, CreditCard, Plus, LogIn } from "lucide-react"; // Removi Loader2 e useState
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; 
import { useNavigate } from "react-router-dom";   

export default function CartSidebar() {
  const { cart, isCartOpen, closeCart, removeFromCart, addToCart } = useCart();
  const { isAuthenticated } = useAuth(); 
  const navigate = useNavigate(); 
  
  // Removi o useState de loading que estava sobrando

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  function handleCheckout() {
    if (cart.length === 0) return;

    closeCart(); // Fecha o sidebar

    if (!isAuthenticated) {
        navigate("/login"); 
        return; 
    }

    // AQUI ESTÁ A MÁGICA: Leva para a página que faz a integração real
    navigate("/checkout");
  }

  return (
    <>
      <div 
        className={`fixed inset-0 top-24 bg-black/80 backdrop-blur-sm z-[40] transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={closeCart}
      />

      <div 
        className={`
          fixed top-24 right-0 
          h-[calc(100vh-6rem)] w-full sm:w-[450px] 
          bg-[#090909] border-l border-white/10 border-t 
          z-[50] 
          transform transition-transform duration-300 ease-out shadow-2xl flex flex-col
          ${isCartOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
          {/* HEADER */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#050505] shrink-0">
            <h2 className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
              <ShoppingBag size={20} className="text-red-600" />
              Carrinho <span className="text-zinc-600 text-sm font-bold">({cart.length})</span>
            </h2>
            <button 
              onClick={closeCart} 
              className="p-2 bg-zinc-900/50 rounded-full text-zinc-500 hover:text-white hover:bg-red-600/20 hover:text-red-500 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* LISTA */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-600/20 blur-xl rounded-full"></div>
                  <ShoppingBag size={64} className="relative text-zinc-700" />
                </div>
                <div className="text-center">
                   <p className="text-lg font-black uppercase tracking-tight text-white">Seu carrinho está vazio</p>
                   <p className="text-xs text-zinc-500 mt-1">Adicione suplementos para começar.</p>
                </div>
                <button 
                  onClick={closeCart} 
                  className="px-6 py-3 bg-zinc-800 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded transition-all"
                >
                  Ver Produtos
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="group flex gap-4 bg-[#111] p-3 rounded-xl border border-white/5 hover:border-red-600/30 transition-colors animate-in slide-in-from-right duration-500">
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
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-red-600 text-xs font-bold uppercase mt-1">Em Estoque</p>
                    </div>
                    <div className="flex items-end justify-between mt-2">
                      <div className="flex items-center gap-3 bg-[#050505] rounded-lg p-1 border border-white/5">
                          <span className="text-xs font-bold text-white px-2">Qtd: {item.quantity}</span>
                          <button 
                            onClick={() => addToCart(item)} 
                            className="w-6 h-6 flex items-center justify-center bg-zinc-800 hover:bg-red-600 text-white rounded transition-colors"
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

          {/* FOOTER */}
          <div className="p-6 bg-[#050505] border-t border-white/5 space-y-4 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-10">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-zinc-400 text-xs uppercase font-bold tracking-wider">
                  <span>Subtotal</span>
                  <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
                </div>
                {cart.length > 0 && (
                  <div className="flex items-center justify-between text-zinc-400 text-xs uppercase font-bold tracking-wider">
                    <span>Frete</span>
                    <span className="text-red-600">Grátis</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-white font-black text-xl uppercase tracking-tight pt-2 border-t border-white/5 mt-2">
                  <span>Total</span>
                  <span className="text-red-600 text-2xl">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0} 
                className="w-full group bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-white py-4 rounded-lg font-black uppercase tracking-[0.2em] transition-all hover:-translate-y-1 active:translate-y-0 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] flex items-center justify-center gap-3 relative overflow-hidden"
              >
                  {isAuthenticated ? (
                      <>
                         <CreditCard size={20} className="group-hover:scale-110 transition-transform" /> 
                         Finalizar Compra
                      </>
                  ) : (
                      <>
                         <LogIn size={20} className="group-hover:translate-x-1 transition-transform" /> 
                         Entrar para Comprar
                      </>
                  )}
              </button>
              
              <div className="flex flex-col items-center gap-2 pt-2">
                <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_5px_#dc2626]"></span> 
                    Ambiente 100% Seguro
                </p>
              </div>
          </div>
      </div>
    </>
  );
}