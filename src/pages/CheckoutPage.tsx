import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, DollarSign, MapPin, Package, CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "https://evoprimal-api.onrender.com";
  const STRAPI_URL = API_URL.endsWith("/api") ? API_URL : `${API_URL}/api`;

  async function handleFinalizeOrder() {
    if (!user) return navigate("/login");
    setLoading(true);

    try {
      const token = localStorage.getItem("evo_token") || localStorage.getItem("token");
      if (!token) { alert("Sessão expirada."); return navigate("/login"); }

      const res = await fetch(`${STRAPI_URL}/orders/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ cart: cart, userId: user.id })
      });

      const data = await res.json();

      if (res.ok && data.paymentUrl) {
        // --- AQUI ESTÁ A SOLUÇÃO DA NOVA ABA ---
        window.open(data.paymentUrl, '_blank');

        // Limpa o carrinho e manda o usuário para o perfil ver o pedido pendente
        clearCart();
        navigate("/minha-conta");
        
      } else {
        throw new Error(data.error?.message || "Erro desconhecido.");
      }

    } catch (error: any) {
      alert("Erro: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0) return <div className="text-white pt-40 text-center">Carrinho Vazio</div>;

  const address = user?.street 
    ? `${user.street}, ${user.number} - ${user.neighborhood}, ${user.city}/${user.state}`
    : "Endereço não cadastrado.";

  return (
    <div className="min-h-screen bg-[#090909] pt-32 px-4 text-white flex flex-col items-center pb-20">
      <div className="max-w-3xl w-full bg-[#111] border border-white/5 p-8 rounded-2xl">
        
        <h1 className="text-3xl font-black uppercase mb-8 text-red-600 flex items-center gap-2">
            <CheckCircle /> Finalizar Pedido
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5">
                <h3 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">Entrega para</h3>
                <p className="font-bold text-lg mb-1">{user?.full_name || user?.username}</p>
                <div className="flex items-start gap-2 text-zinc-300 text-sm mt-2 bg-black/40 p-3 rounded border border-white/5">
                    <MapPin size={16} className="mt-1 text-red-600 shrink-0" />
                    <p>{address}</p>
                </div>
            </div>

            <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5 flex flex-col justify-center">
                <h3 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">Total a Pagar</h3>
                <div className="flex justify-between text-3xl font-black items-center">
                    <span className="text-zinc-600 text-lg">TOTAL</span>
                    <span className="text-green-500">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
                </div>
                <p className="text-xs text-zinc-500 mt-2 text-right">Via Pix ou Boleto (Asaas)</p>
            </div>
        </div>
        
        <div className="mb-8">
            <h3 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                <Package size={16} /> Itens
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                    <div key={item.id} className="flex gap-4 bg-black/40 p-3 rounded-lg border border-white/5 items-center">
                        <div className="w-16 h-16 bg-white rounded flex items-center justify-center overflow-hidden shrink-0 border border-zinc-700">
                            {/* Verifica se existe imagem, senão põe ícone */}
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                            ) : (
                                <Package className="text-black" />
                            )}
                        </div>
                        <div className="flex-1">
                            <span className="block font-bold text-sm text-white">{item.name}</span>
                            <span className="text-xs text-zinc-500">{item.quantity}x</span>
                        </div>
                        <span className="font-bold text-zinc-300">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                        </span>
                    </div>
                ))}
            </div>
        </div>

        <button 
          onClick={handleFinalizeOrder}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-black uppercase py-5 rounded-xl transition-all flex items-center justify-center gap-3 text-lg shadow-[0_0_30px_rgba(22,163,74,0.3)] hover:shadow-[0_0_40px_rgba(22,163,74,0.5)] cursor-pointer"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><DollarSign /> Pagar Agora</>}
        </button>
        <p className="text-center text-xs text-zinc-500 mt-4">Ao clicar, o pagamento abrirá em uma nova aba.</p>
      </div>
    </div>
  );
}