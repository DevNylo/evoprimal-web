 import { useAuth } from "../context/AuthContext";

import { Link, useNavigate } from "react-router-dom";

import { User, LogOut, MapPin, Phone, Mail, ShieldAlert } from "lucide-react";


// --- AQUI ESTÁ A CORREÇÃO: "export default" ---

export default function AccountPage() {

  const { user, logout } = useAuth();

  const navigate = useNavigate();


  if (!user) {

    navigate("/login");

    return null;

  }


  // Montagem do endereço usando os novos campos

  const fullAddress = user.street

    ? `${user.street}, ${user.number || 'S/N'} ${user.complement ? '- ' + user.complement : ''} - ${user.neighborhood}, ${user.city}/${user.state} - CEP: ${user.cep}`

    : "Endereço não cadastrado";


  return (

    <div className="min-h-screen bg-[#090909] pt-32 pb-20 px-4 font-sans text-white">

      <div className="max-w-4xl mx-auto">

       

        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">

          <div>

            <h1 className="text-3xl font-black uppercase tracking-tighter">Minha Conta</h1>

            <p className="text-zinc-500 text-sm mt-1">Gerencie suas informações</p>

          </div>

          <button

            onClick={() => { logout(); navigate("/"); }}

            className="flex items-center gap-2 text-red-600 hover:text-red-500 font-bold uppercase text-xs tracking-widest border border-red-900/30 px-4 py-2 rounded-lg hover:bg-red-900/10 transition-colors"

          >

            <LogOut size={16} /> Sair

          </button>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

         

          <div className="md:col-span-2 space-y-6">

            <div className="bg-[#111] border border-white/5 p-6 rounded-2xl">

              <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2 text-red-600">

                <User size={20} /> Dados Pessoais

              </h2>

             

              <div className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="bg-black/40 p-4 rounded-xl border border-white/5">

                    <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Nome Completo</label>

                    <p className="text-lg font-bold text-white mt-1">{user.full_name || user.username}</p>

                  </div>

                  <div className="bg-black/40 p-4 rounded-xl border border-white/5">

                    <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">CPF</label>

                    <p className="text-lg font-bold text-white mt-1">{user.cpf || "---"}</p>

                  </div>

                </div>


                <div className="bg-black/40 p-4 rounded-xl border border-white/5">

                  <div className="flex items-center gap-3 mb-1">

                    <Mail size={14} className="text-zinc-500"/>

                    <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">E-mail</label>

                  </div>

                  <p className="text-lg font-bold text-white">{user.email}</p>

                </div>


                <div className="bg-black/40 p-4 rounded-xl border border-white/5">

                   <div className="flex items-center gap-3 mb-1">

                    <Phone size={14} className="text-zinc-500"/>

                    <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Telefone / WhatsApp</label>

                  </div>

                  <p className="text-lg font-bold text-white">{user.phone || "Não informado"}</p>

                </div>

              </div>

            </div>


            <div className="bg-[#111] border border-white/5 p-6 rounded-2xl">

               <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2 text-red-600">

                <MapPin size={20} /> Endereço de Entrega

              </h2>

              <div className="bg-black/40 p-5 rounded-xl border border-white/5">

                 <p className="text-lg font-medium text-zinc-300 leading-relaxed">

                   {fullAddress}

                 </p>

              </div>

            </div>


            <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-xl flex items-start gap-4">

               <ShieldAlert className="text-blue-500 shrink-0 mt-1" size={24} />

               <div>

                 <h3 className="font-bold text-blue-400 uppercase text-sm mb-1">Precisa alterar seus dados?</h3>

                 <p className="text-zinc-400 text-xs leading-relaxed">

                   Por questões de segurança, os dados cadastrais não podem ser alterados automaticamente.

                   <br/>Entre em contato com nosso suporte para atualizações.

                 </p>

                 <Link to="/contato" className="inline-block mt-3 text-white bg-blue-600/20 hover:bg-blue-600 text-xs font-bold uppercase py-2 px-4 rounded transition-all">

                   Falar com Suporte

                 </Link>

               </div>

            </div>

          </div>


          <div className="space-y-4">

             <div className="bg-[#111] border border-white/5 p-6 rounded-2xl">

                <h3 className="text-sm font-black uppercase text-zinc-500 mb-4 tracking-widest">Meus Pedidos</h3>

                <p className="text-zinc-600 text-sm italic">Nenhum pedido recente.</p>

                <Link to="/produtos" className="block mt-4 text-center bg-white text-black font-black uppercase text-sm py-3 rounded-xl hover:bg-zinc-200 transition-colors">

                  Fazer meu 1º Pedido

                </Link>

             </div>

          </div>


        </div>

      </div>

    </div>

  );

} 