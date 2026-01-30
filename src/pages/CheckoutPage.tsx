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

  // URL Fixa do Backend no Render
  const API_URL = "https://evoprimal-api.onrender.com/api";

  async function handleFinalizeOrder() {
    if (!user) return navigate("/login");
    
    setLoading(true);
    console.log("🚀 [FRONT] Iniciando checkout real...");

    try {
      // Pega o token de qualquer um dos possíveis nomes
      const token = localStorage.getItem("evo_token") || localStorage.getItem("token");
      
      if (!token) {
        alert("Sessão expirada. Faça login novamente.");
        navigate("/login");
        return;
      }

      // Envia para o Backend
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

      // Lê a resposta (mesmo se for erro)
      const data = await res.json();
      console.log("📦 [FRONT] Resposta do servidor:", data);

      if (res.ok && data.paymentUrl) {
        // SUCESSO! Redireciona para o Asaas
        console.log("✅ Redirecionando para:", data.paymentUrl);
        window.location.href = data.paymentUrl;
      } else {
        // ERRO DO BACKEND
        throw new Error(data.error?.message || "Erro desconhecido ao gerar pagamento.");
      }

    } catch (error: any) {
      console.error("❌ [FRONT] Erro:", error);
      alert("Erro ao processar: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  // Se o usuário acessar direto pela URL com carrinho vazio
  if (cart.length === 0) {
    return (
        <div className="min-h-screen bg-[#090909] pt-32 text-white flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio.</h1>
            <button onClick={() => navigate("/")} className="text-red-500 hover:underline">Voltar para a loja</button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090909] pt-32 px-4 text-white flex flex-col items-center">
      <div className="max-w-2xl w-full bg-[#111] border border-white/5 p-8 rounded-2xl">
        <h1 className="text-3xl font-black uppercase mb-6 text-red-600">Resumo do Pedido</h1>
        
        {/* Lista de Itens */}
        <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between border-b border-white/5 pb-2">
              <div className="flex gap-3">
                  <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center text-xs">IMG</div>
                  <div>
                      <span className="block font-bold text-sm">{item.name}</span>
                      <span className="text-xs text-zinc-500">Qtd: {item.quantity}</span>
                  </div>
              </div>
              <span className="font-bold">R$ {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-xl font-black mb-8 border-t border-white/10 pt-4">
          <span>TOTAL</span>
          <span className="text-green-500">R$ {total.toFixed(2)}</span>
        </div>

        {/* Dados do Cliente */}
        <div className="bg-zinc-900 p-4 rounded-lg mb-8 text-sm text-zinc-400">
            <p><strong className="text-white">Cliente:</strong> {user?.username || user?.email}</p>
            <p><strong className="text-white">CPF:</strong> {user?.cpf || <span className="text-red-500">Não informado (Necessário atualizar perfil)</span>}</p>
        </div>

        <button 
          onClick={handleFinalizeOrder}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-black uppercase py-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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