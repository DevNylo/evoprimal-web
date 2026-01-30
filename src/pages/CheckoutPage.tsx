import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, DollarSign, MapPin, Package, CheckCircle, CreditCard, QrCode } from "lucide-react";

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  
  // 1. ESTADO DA ESCOLHA (Padrão: Pix/Boleto)
  const [paymentMethod, setPaymentMethod] = useState<'PIX_BOLETO' | 'CREDIT_CARD'>('PIX_BOLETO');

  // URL da API
  const API_URL = import.meta.env.VITE_API_URL || "https://evoprimal-api.onrender.com";
  const STRAPI_URL = API_URL.endsWith("/api") ? API_URL : `${API_URL}/api`;

  // Cálculos Visuais (Apenas para exibir na tela, o backend recalcula pra garantir segurança)
  const discount = total * 0.05;
  const totalPix = total - discount;
  const currentTotalDisplay = paymentMethod === 'PIX_BOLETO' ? totalPix : total;

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
        body: JSON.stringify({ 
            cart: cart, 
            userId: user.id,
            paymentMethod: paymentMethod // <--- 2. ENVIA A ESCOLHA PARA O BACKEND
        })
      });

      const data = await res.json();

      if (res.ok && data.paymentUrl) {
        // Abre nova aba
        window.open(data.paymentUrl, '_blank');

        // Limpa e redireciona
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
            
            {/* COLUNA ESQUERDA: ENDEREÇO + SELETOR DE PAGAMENTO */}
            <div className="space-y-6">
                <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5">
                    <h3 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">Entrega para</h3>
                    <p className="font-bold text-lg mb-1">{user?.full_name || user?.username}</p>
                    <div className="flex items-start gap-2 text-zinc-300 text-sm mt-2 bg-black/40 p-3 rounded border border-white/5">
                        <MapPin size={16} className="mt-1 text-red-600 shrink-0" />
                        <p>{address}</p>
                    </div>
                </div>

                {/* --- 3. SELETOR VISUAL --- */}
                <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5">
                    <h3 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">Forma de Pagamento</h3>
                    <div className="space-y-3">
                        {/* OPÇÃO PIX/BOLETO */}
                        <div 
                            onClick={() => setPaymentMethod('PIX_BOLETO')}
                            className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                                paymentMethod === 'PIX_BOLETO' 
                                ? 'bg-green-600/10 border-green-600' 
                                : 'bg-black/40 border-white/5 hover:border-white/20'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <QrCode className={paymentMethod === 'PIX_BOLETO' ? "text-green-500" : "text-zinc-500"} />
                                <div>
                                    <p className="font-bold text-sm">Pix ou Boleto</p>
                                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">5% OFF Aplicado</p>
                                </div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'PIX_BOLETO' ? 'border-green-500' : 'border-zinc-600'}`}>
                                {paymentMethod === 'PIX_BOLETO' && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                            </div>
                        </div>

                        {/* OPÇÃO CARTÃO */}
                        <div 
                            onClick={() => setPaymentMethod('CREDIT_CARD')}
                            className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                                paymentMethod === 'CREDIT_CARD' 
                                ? 'bg-red-600/10 border-red-600' 
                                : 'bg-black/40 border-white/5 hover:border-white/20'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <CreditCard className={paymentMethod === 'CREDIT_CARD' ? "text-red-500" : "text-zinc-500"} />
                                <div>
                                    <p className="font-bold text-sm">Cartão de Crédito</p>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Até 12x</p>
                                </div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'CREDIT_CARD' ? 'border-red-500' : 'border-zinc-600'}`}>
                                {paymentMethod === 'CREDIT_CARD' && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* COLUNA DIREITA: RESUMO DE VALORES */}
            <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5 flex flex-col justify-center h-fit">
                <h3 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-6">Resumo da Compra</h3>
                
                <div className="space-y-3 mb-6 border-b border-white/10 pb-6">
                    <div className="flex justify-between text-zinc-400 text-sm">
                        <span>Subtotal</span>
                        <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400 text-sm">
                        <span>Frete</span>
                        <span className="text-green-500">Grátis</span>
                    </div>
                    
                    {/* Exibe desconto se Pix for selecionado */}
                    {paymentMethod === 'PIX_BOLETO' && (
                        <div className="flex justify-between text-green-500 text-sm font-bold animate-in slide-in-from-left">
                            <span>Desconto Pix/Boleto (5%)</span>
                            <span>- {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(discount)}</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-between text-3xl font-black items-center">
                    <span className="text-zinc-600 text-lg">TOTAL</span>
                    <span className={paymentMethod === 'PIX_BOLETO' ? "text-green-500" : "text-white"}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentTotalDisplay)}
                    </span>
                </div>
                
                <p className="text-xs text-zinc-500 mt-2 text-right">
                    {paymentMethod === 'PIX_BOLETO' ? 'Pagamento à vista' : 'Em até 12x no cartão'}
                </p>
            </div>
        </div>
        
        {/* LISTA DE ITENS */}
        <div className="mb-8">
            <h3 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                <Package size={16} /> Itens ({cart.length})
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                    <div key={item.id} className="flex gap-4 bg-black/40 p-3 rounded-lg border border-white/5 items-center">
                        <div className="w-12 h-12 bg-white rounded flex items-center justify-center overflow-hidden shrink-0 border border-zinc-700">
                             {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                            ) : (
                                <Package className="text-black" size={20} />
                            )}
                        </div>
                        <div className="flex-1">
                            <span className="block font-bold text-sm text-white line-clamp-1">{item.name}</span>
                            <span className="text-xs text-zinc-500">{item.quantity}un</span>
                        </div>
                        <span className="font-bold text-zinc-300 text-sm">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                        </span>
                    </div>
                ))}
            </div>
        </div>

        <button 
          onClick={handleFinalizeOrder}
          disabled={loading}
          className={`w-full text-white font-black uppercase py-5 rounded-xl transition-all flex items-center justify-center gap-3 text-lg shadow-lg cursor-pointer ${
              paymentMethod === 'PIX_BOLETO' 
              ? 'bg-green-600 hover:bg-green-500 shadow-[0_0_30px_rgba(22,163,74,0.3)]' 
              : 'bg-red-600 hover:bg-red-500 shadow-[0_0_30px_rgba(220,38,38,0.3)]'
          }`}
        >
          {loading ? <Loader2 className="animate-spin" /> : (
              <>
                <DollarSign /> 
                {paymentMethod === 'PIX_BOLETO' ? 'Gerar Pix/Boleto com Desconto' : 'Ir para Pagamento com Cartão'}
              </>
          )}
        </button>
        <p className="text-center text-xs text-zinc-500 mt-4">Ambiente 100% Seguro. Seus dados estão protegidos.</p>
      </div>
    </div>
  );
}