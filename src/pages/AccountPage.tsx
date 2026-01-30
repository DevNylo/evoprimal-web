import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom"; // Link agora será usado
import { User, LogOut, MapPin, Phone, Mail, ShieldAlert, Package, ExternalLink, Loader2 } from "lucide-react"; // Todos os ícones usados

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // URL da API
  const API_URL = import.meta.env.VITE_API_URL || "https://evoprimal-api.onrender.com";
  const STRAPI_URL = API_URL.endsWith("/api") ? API_URL : `${API_URL}/api`;

  useEffect(() => {
    if (!user) { navigate("/login"); return; }

    async function fetchMyOrders() {
      if (!user) return; 
      try {
        const token = localStorage.getItem("evo_token") || localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${STRAPI_URL}/orders?filters[user][id][$eq]=${user.id}&sort=createdAt:desc`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        
        // Lógica para aceitar tanto Array quanto Objeto .data
        let listaPedidos = [];
        if (Array.isArray(data)) {
            listaPedidos = data;
        } else if (data.data && Array.isArray(data.data)) {
            listaPedidos = data.data;
        }
        
        setOrders(listaPedidos);

      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      } finally {
        setLoadingOrders(false);
      }
    }

    fetchMyOrders();
  }, [user, navigate, STRAPI_URL]);

  if (!user) return null;

  const fullAddress = user.street
    ? `${user.street}, ${user.number || 'S/N'} - ${user.neighborhood}, ${user.city}/${user.state}`
    : "Endereço não cadastrado";

  const getStatusLabel = (status: string) => {
    const map: Record<string, any> = {
        pending: { text: "Pendente", color: "text-yellow-500", bg: "bg-yellow-500/10" },
        paid: { text: "Pago", color: "text-green-500", bg: "bg-green-500/10" },
        canceled: { text: "Cancelado", color: "text-red-500", bg: "bg-red-500/10" }
    };
    return map[status] || { text: status || "Info", color: "text-zinc-500", bg: "bg-zinc-800" };
  };

  return (
    <div className="min-h-screen bg-[#090909] pt-32 pb-20 px-4 font-sans text-white">
      <div className="max-w-4xl mx-auto">
        
        {/* CABEÇALHO */}
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Minha Conta</h1>
            <p className="text-zinc-500 text-sm mt-1">Olá, {user.full_name || user.username}</p>
          </div>
          <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-2 text-red-600 hover:text-red-500 font-bold uppercase text-xs border border-red-900/30 px-4 py-2 rounded-lg transition-colors cursor-pointer">
            <LogOut size={16} /> Sair
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUNA ESQUERDA - DADOS DO USUÁRIO */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-[#111] border border-white/5 p-6 rounded-2xl">
              <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2 text-red-600"><User size={20} /> Meus Dados</h2>
              
              <div className="space-y-4">
                  {/* Nome e CPF */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                        <label className="text-[10px] uppercase font-black text-zinc-500">Nome</label>
                        <p className="font-bold text-white">{user.full_name || user.username}</p>
                      </div>
                      <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                        <label className="text-[10px] uppercase font-black text-zinc-500">CPF</label>
                        <p className="font-bold text-white">{user.cpf || "---"}</p>
                      </div>
                  </div>

                  {/* E-mail (Usa o ícone Mail) */}
                  <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                          <Mail size={14} className="text-zinc-500" />
                          <label className="text-[10px] uppercase font-black text-zinc-500">E-mail</label>
                      </div>
                      <p className="font-bold text-white">{user.email}</p>
                  </div>

                  {/* Telefone (Usa o ícone Phone) */}
                  <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                          <Phone size={14} className="text-zinc-500" />
                          <label className="text-[10px] uppercase font-black text-zinc-500">Telefone</label>
                      </div>
                      <p className="font-bold text-white">{user.phone || "Não informado"}</p>
                  </div>
              </div>

              {/* Endereço */}
              <div className="bg-black/40 p-4 rounded-xl border border-white/5 mt-4">
                 <p className="text-zinc-300"><MapPin className="inline mr-2 text-red-600" size={16}/> {fullAddress}</p>
              </div>
            </div>

            {/* Bloco de Suporte (Usa ShieldAlert e Link) */}
            <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-xl flex items-start gap-4">
               <ShieldAlert className="text-blue-500 shrink-0 mt-1" size={24} />
               <div>
                 <h3 className="font-bold text-blue-400 uppercase text-sm mb-1">Precisa alterar seus dados?</h3>
                 <p className="text-zinc-400 text-xs leading-relaxed">
                   Por questões de segurança, contate nosso suporte para alterar CPF ou E-mail.
                 </p>
                 {/* Link usado aqui */}
                 <Link to="/contato" className="inline-block mt-3 text-white bg-blue-600/20 hover:bg-blue-600 text-xs font-bold uppercase py-2 px-4 rounded transition-all">
                   Falar com Suporte
                 </Link>
               </div>
            </div>

          </div>

          {/* COLUNA DIREITA - HISTÓRICO */}
          <div className="bg-[#111] border border-white/5 p-6 rounded-2xl h-full flex flex-col">
             <h3 className="text-sm font-black uppercase text-zinc-500 mb-6 tracking-widest flex items-center gap-2">
                <Package size={16} /> Histórico de Pedidos
             </h3>
             
             {loadingOrders ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-red-600" /></div>
             ) : orders.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-zinc-600 text-sm italic mb-4">Nenhum pedido encontrado.</p>
                </div>
             ) : (
                <div className="space-y-4 flex-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                    {orders.map((order: any) => {
                        const statusInfo = getStatusLabel(order.status_payment);
                        const date = new Date(order.createdAt).toLocaleDateString('pt-BR');
                        const displayCode = order.order_code || `PEDIDO #${order.id}`;
                        
                        return (
                            <div key={order.id} className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs text-zinc-400 font-black uppercase">{displayCode}</span>
                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${statusInfo.color} ${statusInfo.bg}`}>
                                        {statusInfo.text}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-xs text-zinc-500">{date}</span>
                                    <span className="text-white font-bold">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                                    </span>
                                </div>
                                {order.asaas_link && order.status_payment === 'pending' && (
                                    <a href={order.asaas_link} target="_blank" rel="noopener noreferrer"
                                        className="block text-center w-full mt-3 bg-green-600 hover:bg-green-500 text-white text-xs font-bold uppercase py-2 rounded transition-colors">
                                        <ExternalLink size={12} className="inline mr-1" /> Pagar Agora
                                    </a>
                                )}
                            </div>
                        );
                    })}
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}