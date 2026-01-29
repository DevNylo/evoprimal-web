import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";

export default function EmailConfirmationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Limpeza de segurança no código que vem do e-mail
  const rawCode = searchParams.get("code");
  const code = rawCode ? rawCode.replace(/['"]/g, "").trim() : null;

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const requestSent = useRef(false);

  // --- BLINDAGEM DE URL (Igual ao Login) ---
  const BASE_ENV_URL = import.meta.env.VITE_API_URL || "https://evoprimal-api.onrender.com";
  // Garante que sempre termina com /api
  const API_URL = BASE_ENV_URL.endsWith("/api") ? BASE_ENV_URL : `${BASE_ENV_URL}/api`;

  useEffect(() => {
    if (!code) {
      console.error("Código não encontrado na URL");
      setStatus('error');
      return;
    }

    if (requestSent.current) return;
    requestSent.current = true;

    async function confirmEmail() {
      try {
        console.log(`Tentando validar código: ${code}`);
        console.log(`URL usada: ${API_URL}/auth/email-confirmation?confirmation=${code}`);

        const res = await fetch(`${API_URL}/auth/email-confirmation?confirmation=${code}`);
        const data = await res.json();

        if (!res.ok) {
          console.error("Erro Strapi:", data);
          // Se o erro for 404 aqui, é porque o código está errado ou a URL base ainda está ruim
          throw new Error(data.error?.message || 'Código inválido');
        }

        setStatus('success');
        
        // Redireciona para login após 5 segundos
        setTimeout(() => {
            navigate("/login");
        }, 5000);

      } catch (error) {
        console.error("Erro capturado:", error);
        setStatus('error');
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
            <h2 className="text-xl font-black uppercase">Validando...</h2>
            <p className="text-zinc-500 text-sm mt-2">Estamos ativando sua conta.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-6">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black uppercase mb-2">Conta Confirmada!</h2>
            <p className="text-zinc-400 mb-8">
              Sua conta está ativa. Você será redirecionado para o login em instantes...
            </p>
            <Link 
              to="/login" 
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Ir para Login Agora <ArrowRight size={20} />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="py-6">
            <XCircle className="w-20 h-20 text-red-600 mx-auto mb-6" />
            <h2 className="text-2xl font-black uppercase mb-2">Erro na Validação</h2>
            <p className="text-zinc-400 mb-8 text-sm">
              Não foi possível confirmar. O link pode ter expirado ou sua conta já foi ativada.
              <br/><br/>
              Tente fazer login direto.
            </p>
            <Link 
              to="/login" 
              className="text-zinc-500 hover:text-white underline text-sm uppercase font-bold tracking-wider"
            >
              Tentar Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}