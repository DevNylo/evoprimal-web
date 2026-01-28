import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2, Lock, User, Mail, ChevronLeft, AlertCircle, MapPin, Phone, Home, Hash, Map } from "lucide-react";

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({ 
    username: "", 
    email: "", 
    password: "",
    phone: "",
    street: "",
    number: "",
    complement: "",
    city: "",
    state: ""
  });

  const [cities, setCities] = useState<{ nome: string }[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const API_URL = "https://evoprimal-api.onrender.com/api"; 
  
  const ufs = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  useEffect(() => {
    if (formData.state) {
        setLoadingCities(true);
        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.state}/municipios`)
            .then(res => res.json())
            .then(data => {
                setCities(data);
                setLoadingCities(false);
            })
            .catch(() => setLoadingCities(false));
    } else {
        setCities([]);
    }
  }, [formData.state]);

  // --- FUNÇÃO DE TRADUÇÃO DE ERROS ---
  function translateError(errorMessage: string) {
    if (errorMessage.includes("Email is already taken")) return "Este e-mail já está cadastrado.";
    if (errorMessage.includes("Username is already taken")) return "Este nome de usuário já está em uso.";
    if (errorMessage.includes("Invalid identifier or password")) return "E-mail ou senha incorretos.";
    if (errorMessage.includes("password must be at least")) return "A senha deve ter no mínimo 6 caracteres.";
    if (errorMessage.includes("Invalid parameters")) return "Erro de sistema: Campos inválidos no servidor (Aguarde o Deploy).";
    return "Ocorreu um erro. Verifique seus dados e tente novamente.";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const endpoint = isRegistering ? "/auth/local/register" : "/auth/local";
      
      let payload;

      if (isRegistering) {
        const fullAddress = `${formData.street}, ${formData.number}${formData.complement ? ' - ' + formData.complement : ''} - ${formData.city}/${formData.state}`;

        payload = { 
            username: formData.username, 
            email: formData.email, 
            password: formData.password,
            phone: formData.phone,
            address: fullAddress
        };
      } else {
        payload = { identifier: formData.email, password: formData.password };
      }

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // Usa a nossa função de tradução aqui
        const originalError = data.error?.message || "";
        throw new Error(translateError(originalError));
      }

      login(data.jwt, data.user);
      navigate("/minha-conta");

    } catch (err: any) {
      console.error("Erro Login:", err);
      // Exibe o erro já traduzido
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#090909] flex flex-col items-center justify-start pt-32 pb-10 px-4 font-sans selection:bg-red-600 selection:text-white">
      
      <div className="absolute top-24 left-6 md:top-28 md:left-10 z-0">
         <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
            <ChevronLeft size={16} /> Voltar
         </Link>
      </div>

      <div className="w-full max-w-lg bg-[#111] border border-white/5 p-8 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300 relative z-10">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
            {isRegistering ? "Criar Conta" : "Acessar Conta"}
            </h2>
            <p className="text-zinc-500 text-sm">
            {isRegistering ? "Junte-se à Evo" : "Seja bem vindo a Evo"}
            </p>
        </div>

        {error && (
          <div className="bg-red-900/10 border border-red-600/20 text-red-500 p-4 rounded-lg mb-6 text-xs font-bold flex items-center gap-3 animate-pulse">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegistering && (
            <>
              {/* DADOS PESSOAIS */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nome de Usuário</label>
                <div className="relative group">
                  <User className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                  <input 
                    type="text" 
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-red-600 focus:outline-none transition-all placeholder:text-zinc-700"
                    placeholder="Seu nome"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Celular / WhatsApp</label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                  <input 
                    type="tel" 
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-red-600 focus:outline-none transition-all placeholder:text-zinc-700"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              {/* ENDEREÇO */}
              <div className="pt-4 border-t border-white/5">
                 <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-4">Endereço de Entrega</p>
                 
                 {/* RUA */}
                 <div className="space-y-1 mb-3">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Rua / Logradouro</label>
                    <div className="relative group">
                      <MapPin className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                      <input 
                        type="text" 
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-red-600 focus:outline-none transition-all placeholder:text-zinc-700"
                        placeholder="Ex: Av. Paulista"
                        value={formData.street}
                        onChange={e => setFormData({...formData, street: e.target.value})}
                      />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-3 mb-3">
                    {/* NÚMERO */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Número</label>
                        <div className="relative group">
                        <Hash className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                        <input 
                            type="text" 
                            required
                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-red-600 focus:outline-none transition-all placeholder:text-zinc-700"
                            placeholder="123"
                            value={formData.number}
                            onChange={e => setFormData({...formData, number: e.target.value})}
                        />
                        </div>
                    </div>
                    {/* COMPLEMENTO */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Comp. (Opcional)</label>
                        <div className="relative group">
                        <Home className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                        <input 
                            type="text" 
                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-red-600 focus:outline-none transition-all placeholder:text-zinc-700"
                            placeholder="Apto 10"
                            value={formData.complement}
                            onChange={e => setFormData({...formData, complement: e.target.value})}
                        />
                        </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-3">
                    
                    {/* DROPDOWN ESTADO (UF) */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">UF</label>
                        <div className="relative group">
                            <select 
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-red-600 focus:outline-none transition-all appearance-none cursor-pointer"
                                value={formData.state}
                                onChange={e => setFormData({...formData, state: e.target.value, city: ""})}
                            >
                                <option value="" disabled>UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf} className="bg-zinc-900 text-white">{uf}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* DROPDOWN CIDADE */}
                    <div className="col-span-2 space-y-1">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Cidade</label>
                        <div className="relative group">
                            <Map className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                            
                            {loadingCities && <Loader2 className="absolute right-3 top-3.5 animate-spin text-red-600" size={18} />}
                            
                            <select 
                                required
                                disabled={!formData.state || loadingCities}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-red-600 focus:outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                value={formData.city}
                                onChange={e => setFormData({...formData, city: e.target.value})}
                            >
                                <option value="" disabled>
                                    {loadingCities ? "Carregando..." : (formData.state ? "Selecione..." : "Escolha a UF primeiro")}
                                </option>
                                {cities.map((city: any) => (
                                    <option key={city.id} value={city.nome} className="bg-zinc-900 text-white">
                                        {city.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                 </div>
              </div>
            </>
          )}

          {/* LOGIN CREDENTIALS */}
          <div className="space-y-1 pt-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">E-mail</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
              <input 
                type="email" 
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-red-600 focus:outline-none transition-all placeholder:text-zinc-700"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Senha</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
              <input 
                type="password" 
                required
                minLength={6}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-red-600 focus:outline-none transition-all placeholder:text-zinc-700"
                placeholder="******"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-[0.2em] py-4 rounded-xl transition-all mt-6 flex items-center justify-center gap-2 hover:-translate-y-1 shadow-[0_0_20px_rgba(220,38,38,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isRegistering ? "Cadastrar" : "Entrar")}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-white/5">
          <button 
            onClick={() => {
                setError("");
                setIsRegistering(!isRegistering);
            }}
            className="text-zinc-500 text-xs hover:text-white transition-colors hover:underline uppercase tracking-wide font-bold"
          >
            {isRegistering ? "Já tem conta? Faça login" : "Não tem conta? Crie agora"}
          </button>
        </div>
      </div>
    </div>
  );
}