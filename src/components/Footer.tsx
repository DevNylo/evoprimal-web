import { Link } from "react-router-dom";
import {Instagram, /*MapPin,*/ Mail, Phone, ShieldCheck, Lock, Barcode } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-8 text-sm font-sans">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        
        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* COLUNA 1: SOBRE */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">
              EVO<span className="text-red-600">PRIMAL</span>
            </h2>
            <p className="text-zinc-400 leading-relaxed max-w-xs">
              Sua fonte definitiva de suplementação de alta performance. 
              Qualidade garantida para levar seu treino ao próximo nível.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={<Instagram size={20} />} href="https://www.instagram.com/evoprimal_suplementos/" />
              
            </div>
          </div>

          {/* COLUNA 2: INSTITUCIONAL */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest mb-6 border-l-4 border-red-600 pl-3">Institucional</h3>
            <ul className="space-y-4 text-zinc-400">
              <li><Link to="/" className="hover:text-red-500 transition-colors">Início</Link></li>
              <li><Link to="/ofertas" className="hover:text-red-500 transition-colors">Ofertas</Link></li>
              <li><Link to="/minha-conta" className="hover:text-red-500 transition-colors">Minha Conta</Link></li>
              <li><Link to="/contato" className="hover:text-red-500 transition-colors">Fale Conosco</Link></li>
              <li><Link to="/politica-privacidade" className="hover:text-red-500 transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>

          {/* COLUNA 3: CONTATO */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest mb-6 border-l-4 border-red-600 pl-3">Atendimento</h3>
            <ul className="space-y-4 text-zinc-400">
              {/*<li className="flex items-start gap-3">
                <MapPin className="text-red-600 shrink-0" size={18} />
                <span>Av. Paulista, 1000<br/>São Paulo - SP</span>
              </li>*/}
              <li className="flex items-center gap-3">
                <Mail className="text-red-600 shrink-0" size={18} />
                <span>evoprimesuporte@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-red-600 shrink-0" size={18} />
                <span>(11) 99999-9999 (Em breve)</span>
              </li>
              <li className="text-xs text-zinc-500 mt-4">
                Segunda a Sexta: 09h às 18h
              </li>
            </ul>
          </div>

          {/* COLUNA 4: PAGAMENTO E SEGURANÇA */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest mb-6 border-l-4 border-red-600 pl-3">Pagamento Seguro</h3>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                
                {/* SELOS DE SEGURANÇA */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                    <div className="flex flex-col items-center gap-1">
                        <ShieldCheck className="text-green-500" size={32} />
                        <span className="text-[10px] font-bold uppercase text-zinc-400">Site Seguro</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Lock className="text-zinc-300" size={32} />
                        <span className="text-[10px] font-bold uppercase text-zinc-400">SSL Encrypt</span>
                    </div>
                </div>

                {/* PROCESSADOR ASAAS (LOCAL) */}
                <p className="text-xs text-zinc-500 mb-3 uppercase font-bold tracking-wider">Processado por</p>
                <div className="mb-6">
                   <div className="bg-blue-900/20 border border-blue-500/30 rounded py-2 px-4 flex items-center justify-center gap-2">
                      <div className="w-24">
                         {/* Certifique-se que asaas.png está na pasta public/icons */}
                         <img 
                            src="/icons/asaas.png" 
                            alt="Asaas" 
                            className="w-full object-contain hover:opacity-80 transition-opacity" 
                            onError={(e) => {
                                // Fallback apenas visual para não quebrar o layout se a imagem faltar
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                         />
                      </div>
                   </div>
                </div>

                {/* BANDEIRAS */}
                <p className="text-xs text-zinc-500 mb-3 uppercase font-bold tracking-wider">Aceitamos</p>
                <div className="grid grid-cols-4 gap-2">
                    
                    {/* 1. Pix (LINK) */}
                    <div className="bg-white rounded h-8 flex items-center justify-center overflow-hidden" title="Pix">
                         <img src="https://logospng.org/download/pix/logo-pix-icone-512.png" className="h-5 object-contain" alt="Pix" />
                    </div>

                    {/* 2. Boleto (ÍCONE) */}
                    <div className="bg-white rounded h-8 flex items-center justify-center overflow-hidden" title="Boleto">
                         <Barcode className="text-zinc-800" size={20} />
                    </div>

                    {/* 3. Visa (LINK) */}
                    <div className="bg-white rounded h-8 flex items-center justify-center overflow-hidden" title="Visa">
                         <img src="https://logodownload.org/wp-content/uploads/2016/10/visa-logo-1.png" className="h-3 object-contain" alt="Visa" />
                    </div>

                    {/* 4. Mastercard (LINK) */}
                    <div className="bg-white rounded h-8 flex items-center justify-center overflow-hidden" title="Mastercard">
                         <img src="https://logodownload.org/wp-content/uploads/2014/07/mastercard-logo.png" className="h-5 object-contain" alt="Mastercard" />
                    </div>

                    {/* 5. Elo (LINK) */}
                    <div className="bg-white rounded h-8 flex items-center justify-center overflow-hidden" title="Elo">
                         <img src="https://logodownload.org/wp-content/uploads/2017/04/elo-logo-1.png" className="h-4 object-contain" alt="Elo" />
                    </div>

                    {/* 6. Hipercard (LOCAL) - Requer arquivo em /public/icons/hipercard.png */}
                    <div className="bg-white rounded h-8 flex items-center justify-center overflow-hidden" title="Hipercard">
                         <img 
                            src="/icons/hipercard.png" 
                            className="h-4 object-contain" 
                            alt="Hipercard"
                            onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} 
                         />
                    </div>

                    {/* 7. Amex (LOCAL) - Requer arquivo em /public/icons/amex.png */}
                    <div className="bg-white rounded h-8 flex items-center justify-center overflow-hidden" title="Amex">
                         <img 
                            src="/icons/amex.png" 
                            className="h-3 object-contain" 
                            alt="Amex" 
                            onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                         />
                    </div>
                    
                    {/* Contador */}
                    <div className="bg-zinc-800 rounded h-8 flex items-center justify-center overflow-hidden text-zinc-500 text-[10px] font-bold border border-white/5">
                        +1
                    </div>
                </div>
            </div>

          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-xs">
            © {new Date().getFullYear()} EvoPrimal Suplementos. Todos os direitos reservados. CNPJ: 64.654.375/0001-58
          </p>
          <div className="flex gap-4 text-xs text-zinc-600">
             <span className="hover:text-zinc-400 cursor-pointer">Termos de Uso</span>
             <span className="hover:text-zinc-400 cursor-pointer">Políticas de Troca</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

// Componente auxiliar para ícones sociais
function SocialLink({ icon, href }: { icon: React.ReactNode, href: string }) {
    return (
        <a 
            href={href} 
            className="w-10 h-10 rounded-lg bg-white/5 hover:bg-red-600 text-zinc-400 hover:text-white flex items-center justify-center transition-all duration-300 border border-white/5"
        >
            {icon}
        </a>
    )
}