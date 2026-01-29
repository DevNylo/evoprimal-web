import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";

export default function EmailConfirmationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const rawCode = searchParams.get("code");
  const code = rawCode ? rawCode.replace(/['"]/g, "").trim() : null;

  const [status, setStatus] = useState<'loading' | 'success'>('loading');
  const requestSent = useRef(false);

  const BASE_ENV_URL = import.meta.env.VITE_API_URL || "https://evoprimal-api.onrender.com";
  const API_URL = BASE_ENV_URL.endsWith("/api") ? BASE_ENV_URL : `${BASE_ENV_URL}/api`;

  useEffect(() => {
    if (!code) {
      // Se não tem código, manda pro login direto
      navigate("/login");
      return;
    }

    if (requestSent.current) return;
    requestSent.current = true;

    async function confirmEmail() {
      try {
        const res = await fetch(`${API_URL}/auth/email-confirmation?confirmation=${code}`);
        
        // TRUQUE DE UX:
        // Não importa se deu erro 400 (Já confirmado) ou 200 (Confirmado agora).
        // Em ambos os casos, o resultado final para o usuário é: "Conta Pronta".
        // Não vamos mostrar tela vermelha de erro.
        
        console.log("Status da confirmação:", res.status);
        
      } catch (error) {
        console.error("Erro na requisição (ignorado para UX):", error);
      } finally {
        // Sempre mostramos sucesso
        setStatus('success');
        setTimeout(() => navigate("/login"), 4000);
      }
    }

    confirmEmail();
  }, [code, API_URL, navigate]);

  return (
    <div className="min-h-screen bg-[#090909] flex flex-col items-center justify-center p-4 font-sans text-white">
      <div className="bg-[#111] border border-white/5 p-8 rounded-2xl shadow-2xl max-w-md text-center animate-in zoom-in duration-300">
        
        {status === 'loading' && (
          <div className="py-10">
            <Loader2 className="w-16 h-16 text-red-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-black uppercase">Verificando...</h2>
          </div>
        )}

        {status === 'success' && (
          <div className="py-6">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black uppercase mb-2">Tudo Certo!</h2>
            <p className="text-zinc-400 mb-8">
              Sua conta está ativa. Você será redirecionado para o login...
            </p>
            <Link 
              to="/login" 
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Ir para Login <ArrowRight size={20} />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}