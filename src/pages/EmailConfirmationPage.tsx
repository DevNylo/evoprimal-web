import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";

export default function EmailConfirmationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Pega o código da URL e limpa aspas extras se houver (segurança)
  const rawCode = searchParams.get("code");
  const code = rawCode ? rawCode.replace(/['"]/g, "").trim() : null;

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  
  // Ref para impedir que o React execute a validação duas vezes (comum no modo Dev)
  const requestSent = useRef(false);

  // --- BLINDAGEM DE URL ---
  // Garante que a requisição vá para /api/auth/... e não para /auth/...
  const BASE_ENV_URL = import.meta.env.VITE_API_URL || "https://evoprimal-api.onrender.com";
  const API_URL = BASE_ENV_URL.endsWith("/api") ? BASE_ENV_URL : `${BASE_ENV_URL}/api`;

  useEffect(() => {
    // Se não tiver código na URL, já dá erro direto
    if (!code) {
      console.error("Código de confirmação não encontrado na URL.");
      setStatus('error');
      return;
    }

    // Trava de segurança para não rodar duas vezes
    if (requestSent.current) return;
    requestSent.current = true;

    async function confirmEmail() {
      try {
        console.log(`Iniciando validação do código: ${code}`);
        console.log(`Endpoint: ${API_URL}/auth/email-confirmation`);

        const res = await fetch(`${API_URL}/auth/email-confirmation?confirmation=${code}`);
        const data = await res.json();

        // LÓGICA DE TRATAMENTO DE ERRO "INTELIGENTE"
        if (!res.ok) {
          const errorMessage = data.error?.message || "";
          console.warn("Strapi retornou erro:", errorMessage);

          // Se o erro for "já confirmado", tratamos como SUCESSO!
          // O Strapi costuma retornar 400 se já foi usado.
          if (errorMessage.includes("already confirmed") || res.status === 400) {
             console.log("Conta já estava ativa. Redirecionando como sucesso.");
             setStatus('success');
             setTimeout(() => navigate("/login"), 5000);
             return;
          }

          throw new Error(errorMessage || 'Link inválido ou expirado');
        }

        // Se deu tudo certo (200 OK)
        console.log("Conta confirmada com sucesso!");
        setStatus('success');
        
        // Redireciona para login após 5 segundos
        setTimeout(() => {
            navigate("/login");
        }, 5000);

      } catch (error) {
        console.error("Erro fatal na confirmação:", error);
        setStatus('error');
      }
    }

    confirmEmail();
  }, [code, API_URL, navigate]);

  return (
    <div className="min-h-screen bg-[#090909] flex flex-col items-center justify-center p-4 font-sans text-white">
      <div className="bg-[#111] border border-white/5 p-8 rounded-2xl shadow-2xl max-w-md text-center animate-in zoom-in duration-300">
        
        {/* ESTADO CARREGANDO */}
        {status === 'loading' && (
          <div className="py-10">
            <Loader2 className="w-16 h-16 text-red-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-black uppercase">Validando...</h2>
            <p className="text-zinc-500 text-sm mt-2">Estamos ativando sua conta na Evo Primal.</p>
          </div>
        )}

        {/* ESTADO SUCESSO (Ou Já Ativo) */}
        {status === 'success' && (
          <div className="py-6">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black uppercase mb-2">Conta Ativa!</h2>
            <p className="text-zinc-400 mb-8">
              Tudo pronto. Você será redirecionado para o login em alguns segundos...
            </p>
            <Link 
              to="/login" 
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Ir para Login <ArrowRight size={20} />
            </Link>
          </div>
        )}

        {/* ESTADO ERRO REAL */}
        {status === 'error' && (
          <div className="py-6">
            <XCircle className="w-20 h-20 text-red-600 mx-auto mb-6" />
            <h2 className="text-2xl font-black uppercase mb-2">Link Inválido</h2>
            <p className="text-zinc-400 mb-8 text-sm">
              Não foi possível validar este link. Ele pode estar expirado ou incorreto.
              <br/><br/>
              Tente fazer login. Se sua conta não estiver ativa, você poderá pedir um novo e-mail lá.
            </p>
            <Link 
              to="/login" 
              className="text-zinc-500 hover:text-white underline text-sm uppercase font-bold tracking-wider"
            >
              Voltar ao Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}