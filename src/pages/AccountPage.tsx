import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Package, User as UserIcon, LogOut, MapPin, Truck, ChevronLeft, Phone } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function AccountPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // MOCK DE PEDIDOS
  const [orders] = useState([
    { id: "EVO-9921", date: "26/01/2026", status: "Em Trânsito", total: 249.90, tracking: "BR123456789" },
    { id: "EVO-8810", date: "10/12/2025", status: "Entregue", total: 129.90, tracking: "BR987654321" },
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    // CORREÇÃO: Aumentei o padding-top para 'pt-36' para garantir que nada fique escondido
    <div className="min-h-screen bg-[#090909] font-sans selection:bg-red-600 selection:text-white pt-36">
      
      {/* HEADER DA CONTA */}
      <div className="max-w-[1280px] mx-auto px-6 mb-8 relative z-10">
         <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest mb-6">
            <ChevronLeft size={16} /> Voltar para a Loja
         </Link>
         <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">Minha Conta</h1>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        
        {/* COLUNA ESQUERDA: PERFIL */}
        <div className="space-y-6">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-xl sticky top-32">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center text-red-600 border border-white/5">
                   <UserIcon size={32} />
                </div>
                <div>
                   <h2 className="text-white font-bold text-lg leading-tight">{user.username}</h2>
                   <p className="text-zinc-500 text-xs truncate max-w-[180px]" title={user.email}>{user.email}</p>
                </div>
             </div>
             
             <div className="space-y-4 border-t border-white/5 pt-4">
                <div>
                   <label className="text-[10px] font-black text-zinc-600 uppercase flex items-center gap-2 mb-2 tracking-widest">
                      <MapPin size={12} /> Endereço Principal
                   </label>
                   {user.address ? (
                       <p className="text-zinc-300 text-sm leading-relaxed">{user.address}</p>
                   ) : (
                       <p className="text-zinc-500 text-xs italic">Nenhum endereço cadastrado.</p>
                   )}
                </div>

                <div>
                   <label className="text-[10px] font-black text-zinc-600 uppercase flex items-center gap-2 mb-2 tracking-widest mt-4">
                      <Phone size={12} /> Contato / WhatsApp
                   </label>
                   {user.phone ? (
                       <p className="text-zinc-300 text-sm">{user.phone}</p>
                   ) : (
                       <p className="text-zinc-500 text-xs italic">Nenhum telefone cadastrado.</p>
                   )}
                </div>
             </div>

             <button 
               onClick={logout}
               className="w-full mt-8 border border-zinc-800 text-zinc-400 hover:text-white hover:border-red-600 hover:bg-red-600/10 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 group"
             >
                <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                Sair da Conta
             </button>
          </div>
        </div>

        {/* COLUNA DIREITA: PEDIDOS */}
        <div className="md:col-span-2 space-y-6">
           {/* ... (Conteúdo dos pedidos mantido igual) ... */}
           <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Package className="text-red-600" size={24} /> 
                    Últimos Pedidos
                </h2>
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{orders.length} Pedidos</span>
           </div>

           <div className="space-y-4">
              {orders.map(order => (
                 <div key={order.id} className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-red-600/30 transition-all group">
                    <div>
                       <div className="flex items-center gap-3 mb-2">
                          <span className="text-white font-black text-lg tracking-tight">{order.id}</span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded tracking-wider ${
                             order.status === "Entregue" ? "bg-green-900/20 text-green-500 border border-green-900/30" : "bg-blue-900/20 text-blue-500 border border-blue-900/30"
                          }`}>
                             {order.status}
                          </span>
                       </div>
                       <p className="text-zinc-500 text-xs font-medium">
                          Realizado em {order.date}
                       </p>
                    </div>

                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                             <span className="block text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Total</span>
                             <span className="text-white font-bold text-lg">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                             </span>
                        </div>

                        {order.tracking && (
                        <a 
                            href={`https://rastreamento.correios.com.br/app/index.php?objeto=${order.tracking}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-zinc-900 hover:bg-red-600 text-white px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 border border-white/5 hover:border-red-500 shadow-lg"
                        >
                            <Truck size={14} /> Rastrear
                        </a>
                        )}
                    </div>
                 </div>
              ))}
           </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}