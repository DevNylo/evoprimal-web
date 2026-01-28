import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";

export default function EmailConfirmationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get("code");

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  // Ajuste se sua variável de ambiente tiver outro nome
  const API_URL = import.meta.env.VITE_API_URL || "https://evoprimal-api.onrender.com/api";

  useEffect(() => {
    if (!code) {
      setStatus('error');
      return;
    }

    // Função que chama o Strapi para validar o código
    async function confirmEmail() {
      try {
        const res = await fetch(`${API_URL}/auth/email-confirmation?confirmation=${code}`);
        
        if (!res.ok) {
          throw new Error('Código inválido ou expirado');
        }

        setStatus('success');
        
        // Opcional: Redirecionar automaticamente após 5 segundos
        setTimeout(() => navigate("/login"), 5000);

      } catch (error) {
        console.error(error);
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
            <p className="text-zinc-500 text-sm mt-2">Aguarde um momento.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-6">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black uppercase mb-2">Conta Confirmada!</h2>
            <p className="text-zinc-400 mb-8">
              Seu e-mail foi validado com sucesso. Agora você pode fazer login e acessar a loja.
            </p>
            <Link 
              to="/login" 
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Ir para Login <ArrowRight size={20} />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="py-6">
            <XCircle className="w-20 h-20 text-red-600 mx-auto mb-6" />
            <h2 className="text-2xl font-black uppercase mb-2">Falha na Confirmação</h2>
            <p className="text-zinc-400 mb-8">
              O link é inválido ou já foi utilizado. Tente fazer login ou solicite um novo e-mail.
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