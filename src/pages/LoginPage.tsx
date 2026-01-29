import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2, Lock, User, Mail, ChevronLeft, AlertCircle, MapPin, Phone, Home, Hash, Map, CheckCircle2, FileText, Search } from "lucide-react";

// --- FUNÇÕES UTILITÁRIAS ---
const maskCPF = (value: string) => value.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})/, "$1-$2").replace(/(-\d{2})\d+?$/, "$1");
const validateCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf === "" || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let add = 0; for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
  let rev = 11 - (add % 11); if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(9))) return false;
  add = 0; for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (add % 11); if (rev === 10 || rev === 11) rev = 0;
  return rev === parseInt(cpf.charAt(10));
};
const maskPhone = (value: string) => value.replace(/\D/g, "").replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d)(\d{4})$/, "$1-$2").slice(0, 15);
const maskCEP = (value: string) => value.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").slice(0, 9);
// Validação de nome simplificada
const validateName = (name: string) => {
  if (name.trim().split(" ").length < 2) return "Por favor, insira nome e sobrenome.";
  return null;
};

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  // full_name substitui username no formulário visual
  const [formData, setFormData] = useState({ 
    full_name: "", email: "", password: "", confirmPassword: "",
    phone: "", cpf: "", cep: "", street: "", number: "", neighborhood: "", complement: "", city: "", state: ""
  });

  const [cities, setCities] = useState<{ nome: string }[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const BASE_ENV_URL = import.meta.env.VITE_API_URL || "https://evoprimal-api.onrender.com";
  const API_URL = BASE_ENV_URL.endsWith("/api") ? BASE_ENV_URL : `${BASE_ENV_URL}/api`;

  const ufs = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

  useEffect(() => {
    if (formData.state) {
        setLoadingCities(true);
        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.state}/municipios`)
            .then(res => res.json()).then(data => { setCities(data); setLoadingCities(false); }).catch(() => setLoadingCities(false));
    } else { setCities([]); }
  }, [formData.state]);

  async function handleCepBlur(e: React.FocusEvent<HTMLInputElement>) {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length !== 8) return;
    setLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) throw new Error("CEP não encontrado.");
      setFormData(prev => ({
        ...prev,
        street: data.logradouro || "",
        neighborhood: data.bairro || "",
        city: data.localidade || "",
        state: data.uf || "",
      }));
      document.getElementById("numberInput")?.focus();
    } catch (error) { console.error(error); } finally { setLoadingCep(false); }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === "cpf") formattedValue = maskCPF(value);
    if (name === "phone") formattedValue = maskPhone(value);
    if (name === "cep") formattedValue = maskCEP(value);
    if (name === "number") formattedValue = value.replace(/\D/g, "");
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  function translateError(errorMessage: string) {
    if (errorMessage.includes("Email is already taken")) return "Este e-mail já está cadastrado.";
    if (errorMessage.includes("Username is already taken")) return "Este nome de usuário já está em uso.";
    if (errorMessage.includes("cpf must be unique")) return "Este CPF já está cadastrado.";
    return errorMessage.length < 100 ? errorMessage : "Erro ao processar. Tente novamente.";
  }

  function isValidEmail(email: string) { return /\S+@\S+\.\S+/.test(email); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (isRegistering) {
        if (!isValidEmail(formData.email)) { setError("Por favor, insira um e-mail válido."); return; }
        const nameError = validateName(formData.full_name); if (nameError) { setError(nameError); return; }
        if (!validateCPF(formData.cpf)) { setError("CPF inválido."); return; }
        if (formData.phone.length < 14) { setError("Telefone incompleto."); return; }
        if (formData.password !== formData.confirmPassword) { setError("As senhas não coincidem."); return; }
    }

    setIsLoading(true);

    try {
      if (isRegistering) {
        // --- CADASTRO (Passo 1) ---
        // TRUQUE: Username = Email (para garantir unicidade e permitir nomes repetidos no full_name)
        const basicRegisterPayload = { 
            username: formData.email, // Usa o email como username
            email: formData.email, 
            password: formData.password 
        };

        const resRegister = await fetch(`${API_URL}/auth/local/register`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(basicRegisterPayload),
        });

        const dataRegister = await resRegister.json();

        if (!resRegister.ok) {
            throw new Error(translateError(dataRegister.error?.message || "Erro ao criar conta básica."));
        }

        // --- ATUALIZAÇÃO (Passo 2) ---
        const jwt = dataRegister.jwt;
        const userId = dataRegister.user.id;

        // Montamos o payload com todos os campos extras
        const extraDataPayload = {
            full_name: formData.full_name, // Nome real vai aqui
            cpf: formData.cpf,
            phone: formData.phone,
            cep: formData.cep,
            street: formData.street,
            number: formData.number,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            complement: formData.complement
        };

        const resUpdate = await fetch(`${API_URL}/users/${userId}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}` 
            },
            body: JSON.stringify(extraDataPayload),
        });

        if (!resUpdate.ok) {
            // Se der erro aqui, geralmente é permissão (Authenticated -> Update)
            console.warn("Erro ao salvar dados extras. Verifique permissões 'update' no Strapi.", await resUpdate.json());
        } else {
            // Atualiza o objeto local para o AuthContext ter os dados completos
            Object.assign(dataRegister.user, extraDataPayload);
        }

        if (dataRegister.user.confirmed === false) { 
            setEmailSent(true); 
        } else { 
            login(dataRegister.jwt, dataRegister.user); 
            navigate("/minha-conta"); 
        }

      } else {
        // --- LOGIN ---
        // Tenta logar com email e senha
        const res = await fetch(`${API_URL}/auth/local`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier: formData.email, password: formData.password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(translateError(data.error?.message || "Erro ao entrar"));
        login(data.jwt, data.user); navigate("/minha-conta");
      }
    } catch (err: any) { console.error("Erro capturado:", err); setError(err.message); } 
    finally { setIsLoading(false); }
  }

  if (emailSent) {
      return (
        <div className="min-h-screen bg-[#090909] flex flex-col items-center justify-center p-4 font-sans text-white pt-20">
            <div className="bg-[#111] border border-white/5 p-8 rounded-2xl shadow-2xl max-w-md text-center animate-in zoom-in">
                <CheckCircle2 className="text-green-500 w-16 h-16 mx-auto mb-4" />
                <h2 className="text-2xl font-black uppercase mb-2">Conta Criada!</h2>
                <p className="text-zinc-400 mb-6 text-sm">Verifique seu e-mail para ativar a conta.</p>
                <button onClick={() => { setEmailSent(false); setIsRegistering(false); }} className="bg-red-600 hover:bg-red-500 text-white font-bold uppercase py-3 px-8 rounded-xl transition-colors w-full">Ir para Login</button>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#090909] flex flex-col items-center justify-start pt-32 pb-10 px-4 font-sans selection:bg-red-600 selection:text-white">
      <div className="absolute top-24 left-6 md:top-28 md:left-10 z-0">
         <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"><ChevronLeft size={16} /> Voltar</Link>
      </div>

      <div className={`w-full ${isRegistering ? 'max-w-2xl' : 'max-w-lg'} bg-[#111] border border-white/5 p-8 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300 relative z-10`}>
        <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">{isRegistering ? "Criar Conta" : "Acessar Conta"}</h2>
            <p className="text-zinc-500 text-sm">{isRegistering ? "Dados completos para entrega" : "Bem-vindo de volta"}</p>
        </div>

        {error && <div className="bg-red-900/10 border border-red-600/20 text-red-500 p-4 rounded-lg mb-6 text-xs font-bold flex items-center gap-3 animate-pulse"><AlertCircle size={16} className="shrink-0" /><span>{error}</span></div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegistering && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nome Completo</label>
                    <div className="relative group"><User className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                      <input type="text" name="full_name" required className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-red-600 focus:outline-none transition-all placeholder:text-zinc-700" placeholder="Nome e Sobrenome" value={formData.full_name} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">CPF</label>
                    <div className="relative group"><FileText className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                      <input type="text" name="cpf" required maxLength={14} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-red-600 focus:outline-none transition-all placeholder:text-zinc-700" placeholder="000.000.000-00" value={formData.cpf} onChange={handleInputChange} />
                    </div>
                  </div>
              </div>
              
              {/* RESTO DO FORMULÁRIO IGUAL... APENAS CERTIFIQUE-SE QUE OS INPUTS ESTÃO LÁ */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Celular / WhatsApp</label>
                <div className="relative group"><Phone className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                  <input type="tel" name="phone" required maxLength={15} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-red-600 focus:outline-none transition-all placeholder:text-zinc-700" placeholder="(00) 90000-0000" value={formData.phone} onChange={handleInputChange} />
                </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                 <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-4">Endereço de Entrega</p>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">CEP</label>
                        <div className="relative group"><Search className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                            <input type="text" name="cep" required maxLength={9} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-red-600 focus:outline-none transition-all placeholder:text-zinc-700" placeholder="00000-000" value={formData.cep} onChange={handleInputChange} onBlur={handleCepBlur}/>
                            {loadingCep && <div className="absolute right-3 top-3.5"><Loader2 size={18} className="animate-spin text-red-600"/></div>}
                        </div>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Rua / Logradouro</label>
                        <div className="relative group"><MapPin className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                            <input type="text" name="street" required className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-red-600 focus:outline-none transition-all placeholder:text-zinc-700" placeholder="Rua..." value={formData.street} onChange={handleInputChange}/>
                        </div>
                    </div>
                 </div>
                 <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="space-y-1 col-span-1">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Número</label>
                        <div className="relative group"><Hash className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                        <input id="numberInput" type="text" name="number" required className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-red-600 focus:outline-none transition-all placeholder:text-zinc-700" placeholder="123" value={formData.number} onChange={handleInputChange}/>
                        </div>
                    </div>
                     <div className="space-y-1 col-span-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Complemento (Opcional)</label>
                        <div className="relative group"><Home className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                        <input type="text" name="complement" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-red-600 focus:outline-none transition-all placeholder:text-zinc-700" placeholder="Apto, Bloco..." value={formData.complement} onChange={handleInputChange}/>
                        </div>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Bairro</label>
                        <div className="relative group"><Map className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                        <input type="text" name="neighborhood" required className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-red-600 focus:outline-none transition-all placeholder:text-zinc-700" placeholder="Bairro" value={formData.neighborhood} onChange={handleInputChange}/>
                        </div>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Cidade</label>
                        <select required name="city" disabled={!formData.state || loadingCities} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-3 text-white focus:border-red-600 focus:outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 text-sm truncate" value={formData.city} onChange={handleInputChange}>
                            <option value="" disabled>{loadingCities ? "..." : (formData.state ? "Selecione..." : "UF")}</option>
                            {cities.map((city: any) => (<option key={city.id} value={city.nome} className="bg-zinc-900 text-white">{city.nome}</option>))}
                        </select>
                    </div>
                    <div className="space-y-1 md:col-span-1">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">UF</label>
                        <select required name="state" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-3 text-white focus:border-red-600 focus:outline-none transition-all appearance-none cursor-pointer text-sm" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value, city: ""})}>
                            <option value="" disabled>UF</option>
                            {ufs.map(uf => (<option key={uf} value={uf} className="bg-zinc-900 text-white">{uf}</option>))}
                        </select>
                    </div>
                 </div>
              </div>
            </>
          )}

          <div className="space-y-1 pt-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">E-mail</label>
            <div className="relative group"><Mail className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
              <input type="email" name="email" required className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-red-600 focus:outline-none transition-all placeholder:text-zinc-700" placeholder="seu@email.com" value={formData.email} onChange={handleInputChange} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Senha</label>
            <div className="relative group"><Lock className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
              <input type="password" name="password" required minLength={6} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-red-600 focus:outline-none transition-all placeholder:text-zinc-700" placeholder="******" value={formData.password} onChange={handleInputChange} />
            </div>
          </div>
          {isRegistering && (
             <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Confirmar Senha</label>
                <div className="relative group"><Lock className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                <input type="password" name="confirmPassword" required className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-red-600 focus:outline-none transition-all placeholder:text-zinc-700" placeholder="Repita a senha" value={formData.confirmPassword} onChange={handleInputChange} />
                </div>
             </div>
          )}
          {!isRegistering && (
            <div className="flex justify-end pt-2"><Link to="/esqueci-senha" className="text-zinc-500 hover:text-red-500 text-[10px] font-bold uppercase tracking-widest transition-colors">Esqueci minha senha</Link></div>
          )}
          <button disabled={isLoading} className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-[0.2em] py-4 rounded-xl transition-all mt-6 flex items-center justify-center gap-2 hover:-translate-y-1 shadow-[0_0_20px_rgba(220,38,38,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isRegistering ? "Cadastrar" : "Entrar")}
          </button>
        </form>
        <div className="mt-8 text-center pt-6 border-t border-white/5">
          <button onClick={() => { setError(""); setIsRegistering(!isRegistering); }} className="text-zinc-500 text-xs hover:text-white transition-colors hover:underline uppercase tracking-wide font-bold">
            {isRegistering ? "Já tem conta? Faça login" : "Não tem conta? Crie agora"}
          </button>
        </div>
      </div>
    </div>
  );
}