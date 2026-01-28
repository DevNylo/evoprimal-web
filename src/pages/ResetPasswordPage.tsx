import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"; // CORREÇÃO: Removido 'Link'
import { Loader2, Lock, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const API_URL = "https://evoprimal-api.onrender.com/api";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (!code) {
      setError("Código de redefinição inválido ou ausente.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          password,
          passwordConfirmation: confirmPassword,
        }),
      });

      // CORREÇÃO: Só cria a variável data se tiver erro para ler
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "Erro ao redefinir senha.");
      }

      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);

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
            <h2 className="text-2xl font-black uppercase mb-2">Senha Redefinida!</h2>
            <p className="text-zinc-400 mb-6 text-sm">
                Sua senha foi alterada com sucesso. Você será redirecionado para o login...
            </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090909] flex flex-col items-center justify-center p-4 font-sans selection:bg-red-600 selection:text-white">
      <div className="w-full max-w-md bg-[#111] border border-white/5 p-8 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Nova Senha</h2>
            <p className="text-zinc-500 text-sm">Crie uma nova senha segura para sua conta.</p>
        </div>

        {error && (
          <div className="bg-red-900/10 border border-red-600/20 text-red-500 p-4 rounded-lg mb-6 text-xs font-bold flex items-center gap-3">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {!code ? (
           <div className="text-center text-red-500 font-bold p-4">
              Código inválido. Verifique o link do seu e-mail.
           </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nova Senha</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  minLength={6}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-red-600 focus:outline-none transition-all placeholder:text-zinc-700"
                  placeholder="******"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Confirmar Senha</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-red-600 focus:outline-none transition-all placeholder:text-zinc-700"
                  placeholder="******"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-[0.2em] py-4 rounded-xl transition-all mt-6 flex items-center justify-center gap-2 hover:-translate-y-1 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Alterar Senha"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}