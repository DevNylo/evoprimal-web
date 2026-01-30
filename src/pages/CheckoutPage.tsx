import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, DollarSign } from "lucide-react";

export default function CheckoutPage() {
  const { cart, total } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const BASE_ENV_URL = import.meta.env.VITE_API_URL || "https://evoprimal-api.onrender.com";
  const API_URL = BASE_ENV_URL.endsWith("/api") ? BASE_ENV_URL : `${BASE_ENV_URL}/api`;

  async function handleFinalizeOrder() {
    if (!user) return navigate("/login");
    
    setLoading(true);

    try {
      const token = localStorage.getItem("evo_token");
      
      const res = await fetch(`${API_URL}/orders/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          cart: cart,
          userId: user.id
        })
      });

      const data = await res.json();

      if (res.ok && data.paymentUrl) {
        // Redireciona o usuário para o Asaas para pagar
        window.location.href = data.paymentUrl;
      } else {
        alert("Erro ao criar pagamento: " + (data.error?.message || "Erro desconhecido"));
      }

    } catch (error) {
      console.error(error);
      alert("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return <div className="text-white text-center pt-40">Seu carrinho está vazio.</div>;
  }

  return (
    <div className="min-h-screen bg-[#090909] pt-32 px-4 text-white flex flex-col items-center">
      <div className="max-w-2xl w-full bg-[#111] border border-white/5 p-8 rounded-2xl">
        <h1 className="text-3xl font-black uppercase mb-6 text-red-600">Resumo do Pedido</h1>
        
        {/* Lista de Itens */}
        <div className="space-y-4 mb-8">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between border-b border-white/5 pb-2">
              <span>{item.quantity}x {item.name}</span>
              <span className="font-bold">R$ {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-xl font-black mb-8">
          <span>TOTAL</span>
          <span className="text-green-500">R$ {total.toFixed(2)}</span>
        </div>

        {/* Dados do Cliente */}
        <div className="bg-zinc-900 p-4 rounded-lg mb-8 text-sm text-zinc-400">
            <p><strong className="text-white">Cliente:</strong> {user?.full_name}</p>
            <p><strong className="text-white">CPF:</strong> {user?.cpf}</p>
            <p><strong className="text-white">Endereço:</strong> {user?.street}, {user?.number} - {user?.neighborhood}</p>
        </div>

        <button 
          onClick={handleFinalizeOrder}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-black uppercase py-4 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><DollarSign /> Ir para Pagamento</>}
        </button>
        
        <p className="text-center text-xs text-zinc-500 mt-4">
            Você será redirecionado para o ambiente seguro do Asaas.
        </p>
      </div>
    </div>
  );
}