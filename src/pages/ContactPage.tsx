import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from "lucide-react";
import Footer from "../components/Footer";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulação de envio
    setTimeout(() => {
        setLoading(false);
        setSent(true);
    }, 2000);
  };

  return (
    <div className={styles.pageWrapper} style={{ backgroundImage: styles.backgroundImageUrl }}>
      <div className={styles.pageOverlay}></div>

      <div className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
            
            {/* Cabeçalho */}
            <div className="text-center mb-16 animate-fade-in-up">
                <p className="text-red-600 font-bold uppercase tracking-widest text-xs mb-2">Fale Conosco</p>
                <h1 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tighter">
                    Entre em <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Contato</span>
                </h1>
                <p className="text-zinc-400 mt-4 max-w-xl mx-auto">
                    Tem alguma dúvida sobre suplementação ou sobre seu pedido? Nossa equipe de especialistas está pronta para te atender.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* LADO ESQUERDO: FORMULÁRIO */}
                <div className={styles.card}>
                    {sent ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-20">
                            <CheckCircle className="text-green-500 mb-4" size={64} />
                            <h3 className="text-2xl font-black text-white uppercase">Mensagem Enviada!</h3>
                            <p className="text-zinc-400 mt-2">Em breve nossa equipe entrará em contato.</p>
                            <button onClick={() => setSent(false)} className="mt-8 text-red-500 font-bold uppercase text-xs hover:text-white transition-colors">
                                Enviar outra mensagem
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-zinc-500 ml-1">Nome</label>
                                    <input required type="text" placeholder="Seu nome" className={styles.input} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-zinc-500 ml-1">E-mail</label>
                                    <input required type="email" placeholder="seu@email.com" className={styles.input} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-zinc-500 ml-1">Assunto</label>
                                <select className={styles.input}>
                                    <option>Dúvida sobre Pedido</option>
                                    <option>Suporte Técnico</option>
                                    <option>Parcerias</option>
                                    <option>Outros</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-zinc-500 ml-1">Mensagem</label>
                                <textarea required rows={5} placeholder="Como podemos te ajudar?" className={styles.input}></textarea>
                            </div>

                            <button disabled={loading} className={styles.button}>
                                {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Enviar Mensagem</>}
                            </button>
                        </form>
                    )}
                </div>

                {/* LADO DIREITO: INFORMAÇÕES */}
                <div className="space-y-6">
                    {/* Card Info 1 */}
                    <div className={styles.infoCard}>
                        <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center text-red-600 border border-red-600/30">
                            <Phone size={20} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold uppercase">WhatsApp / Telefone</h3>
                            <p className="text-zinc-400 text-sm mt-1">Em breve</p>
                            <p className="text-zinc-500 text-xs mt-1">Seg a Sex das 09h às 18h</p>
                        </div>
                    </div>

                    {/* Card Info 2 */}
                    <div className={styles.infoCard}>
                        <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center text-red-600 border border-red-600/30">
                            <Mail size={20} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold uppercase">E-mail</h3>
                            <p className="text-zinc-400 text-sm mt-1">evoprimesuporte@gmail.com</p>
                            <p className="text-zinc-500 text-xs mt-1">Respondemos em até 24h</p>
                        </div>
                    </div>

                    {/* Card Info 3 */}
                    <div className={styles.infoCard}>
                        <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center text-red-600 border border-red-600/30">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold uppercase">Escritório</h3>
                            <p className="text-zinc-400 text-sm mt-1">Em breve</p>
                            <p className="text-zinc-500 text-xs mt-1">Apenas administrativo</p>
                        </div>
                    </div>

                    {/* FAQ Rápido */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mt-8">
                        <h4 className="text-white font-black uppercase mb-4 text-sm tracking-widest border-l-4 border-red-600 pl-3">Dúvidas Frequentes</h4>
                        <ul className="space-y-3 text-sm text-zinc-400">
                            <li className="hover:text-white cursor-pointer transition-colors">• Onde está meu pedido?</li>
                            <li className="hover:text-white cursor-pointer transition-colors">• Como funciona o desconto no Pix?</li>
                            <li className="hover:text-white cursor-pointer transition-colors">• Política de Devolução</li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

// --- ESTILOS ---
const styles = {
    backgroundImageUrl: `url('/background-texture.jpg')`, // Mesma imagem da Home
    
    pageWrapper: `min-h-screen font-sans selection:bg-red-600 selection:text-white bg-fixed bg-cover bg-center bg-no-repeat relative`,
    
    pageOverlay: "fixed inset-0 bg-black/40 z-0 pointer-events-none",

    card: "bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-xl",
    
    input: "w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-red-600 transition-colors text-sm",
    
    button: "w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] flex items-center justify-center gap-2 mt-4",

    infoCard: "bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl flex items-center gap-6 hover:bg-white/10 transition-colors cursor-default"
};