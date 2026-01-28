import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Mail, ChevronLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "https://evoprimal-api.onrender.com/api";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // CORREÇÃO: Só lemos o 'data' se der erro, para não gerar variável inútil
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "Erro ao enviar e-mail.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#090909] flex flex-col items-center justify-center p-4 font-sans text-white">
        <div className="bg-[#111] border border-white/5 p-8 rounded-2xl shadow-2xl max-w-md text-center animate-in zoom-in">
            <CheckCircle2 className="text-green-500 w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-black uppercase mb-2">E-mail Enviado!</h2>
            <p className="text-zinc-400 mb-6 text-sm">
                Se o e-mail <strong>{email}</strong> estiver cadastrado, você receberá um link para redefinir sua senha em instantes.
            </p>
            <Link to="/login" className="block w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase py-3 rounded-xl transition-colors">
                Voltar para Login
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090909] flex flex-col items-center justify-center p-4 font-sans selection:bg-red-600 selection:text-white">
      
      <div className="absolute top-10 left-6 md:left-10">
         <Link to="/login" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
            <ChevronLeft size={16} /> Voltar
         </Link>
      </div>

      <div className="w-full max-w-md bg-[#111] border border-white/5 p-8 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Recuperar Senha</h2>
            <p className="text-zinc-500 text-sm">Digite seu e-mail para receber o link de redefinição.</p>
        </div>

        {error && (
          <div className="bg-red-900/10 border border-red-600/20 text-red-500 p-4 rounded-lg mb-6 text-xs font-bold flex items-center gap-3">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">E-mail</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
              <input 
                type="email" 
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-red-600 focus:outline-none transition-all placeholder:text-zinc-700"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button 
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-[0.2em] py-4 rounded-xl transition-all mt-6 flex items-center justify-center gap-2 hover:-translate-y-1 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Enviar Link"}
          </button>
        </form>
      </div>
    </div>
  );
}