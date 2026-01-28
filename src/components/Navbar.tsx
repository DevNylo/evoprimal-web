import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, ChevronDown, User, LogIn } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // Importar Auth

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { cart, openCart } = useCart();
  const { isAuthenticated, user } = useAuth(); // Pegar estado do usuário
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/categoria/busca?q=${searchTerm}`);
      setShowSearch(false);
      setSearchTerm("");
    }
  };

  const getLinkClass = (path: string, isDropdown = false) => {
    const isActive = location.pathname === path;
    if (isDropdown) {
      return isActive 
        ? "block px-4 py-2 text-xs font-bold text-red-600 bg-white/5 rounded uppercase" 
        : "block px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded uppercase";
    }
    return isActive
      ? "text-xs font-bold uppercase tracking-widest text-red-600 transition-all"
      : "text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white hover:text-shadow-glow transition-all";
  };

  const isProductSectionActive = location.pathname.includes("/categoria");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Função para navegar para login ou conta
  const handleAccountClick = () => {
    setIsMobileMenuOpen(false); // Fecha menu mobile se aberto
    navigate(isAuthenticated ? "/minha-conta" : "/login");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-white/5
        ${
          isScrolled
            ? "bg-black/80 backdrop-blur-md py-3 shadow-lg"
            : "bg-black/20 backdrop-blur-sm py-5"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="relative z-50 flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="EVOPRIMAL" 
              className="h-14 md:h-16 object-contain hover:opacity-80 transition-opacity drop-shadow-lg" 
            />
          </Link>

          {/* DESKTOP MENU */}
          <nav className="hidden lg:flex items-center gap-8 relative z-50">
            <Link to="/" className={getLinkClass("/")}>Início</Link>
            
            <div className="group relative h-full flex items-center">
                <button className={`flex items-center gap-1 text-xs font-bold uppercase tracking-widest transition-all group-hover:text-red-600 ${isProductSectionActive ? "text-red-600" : "text-zinc-300 hover:text-white"}`}>
                  Produtos <ChevronDown size={14} />
                </button>
                <div className="absolute top-full left-0 mt-0 pt-4 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform group-hover:translate-y-0 translate-y-2 flex flex-col">
                   <div className="bg-zinc-900/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl p-2 flex flex-col gap-1">
                     <Link to="/categoria/whey-protein" className={getLinkClass("/categoria/whey-protein", true)}>Whey Protein</Link>
                     <Link to="/categoria/creatina" className={getLinkClass("/categoria/creatina", true)}>Creatina</Link>
                     <Link to="/categoria/pre-treino" className={getLinkClass("/categoria/pre-treino", true)}>Pré-Treino</Link>
                     <Link to="/categoria/beta-alanina" className={getLinkClass("/categoria/beta-alanina", true)}>Beta-Alanina</Link>
                     <Link to="/categoria/vitaminas" className={getLinkClass("/categoria/vitaminas", true)}>Vitaminas</Link>
                   </div>
                </div>
            </div>

            <Link to="/ofertas" className={getLinkClass("/ofertas")}>Ofertas</Link>
            <Link to="/contato" className={getLinkClass("/contato")}>Contato</Link>
          </nav>

          {/* ICONS & BOTOES */}
          <div className="flex items-center gap-3 relative z-50">
            {showSearch ? (
              <form onSubmit={handleSearchSubmit} className="relative animate-in fade-in slide-in-from-right-4 duration-300">
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Buscar..." 
                  className="bg-black/60 backdrop-blur-md text-white text-sm border border-white/20 rounded-full pl-4 pr-8 py-2 w-40 md:w-60 focus:outline-none focus:border-red-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onBlur={() => !searchTerm && setShowSearch(false)}
                />
                <button type="button" onClick={() => setShowSearch(false)} className="absolute right-2 top-2 text-zinc-400 hover:text-white">
                  <X size={14} />
                </button>
              </form>
            ) : (
              <button onClick={() => setShowSearch(true)} className="text-zinc-300 hover:text-white p-2 transition-colors drop-shadow-md">
                 <Search size={22} />
              </button>
            )}

            {/* BOTÃO DA CONTA (O NOVO BOTÃO VERMELHO) */}
            <button 
              onClick={handleAccountClick}
              className={`
                 hidden md:flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-bold uppercase text-[10px] tracking-widest shadow-lg
                 ${isAuthenticated 
                    ? "bg-zinc-800 text-white hover:bg-zinc-700 border border-white/10" // Logado: Discreto
                    : "bg-red-600 text-white hover:bg-red-500 hover:-translate-y-0.5 shadow-red-900/20" // Não logado: Vermelho Chamativo
                 }
              `}
            >
              {isAuthenticated ? (
                 <>
                   <User size={14} /> {user?.username?.split(" ")[0]}
                 </>
              ) : (
                 <>
                   <LogIn size={14} /> Minhas Compras
                 </>
              )}
            </button>
            
            {/* ÍCONE MOBILE DA CONTA */}
            <button 
               onClick={handleAccountClick}
               className="md:hidden text-white hover:text-red-500 p-2"
            >
               <User size={22} />
            </button>

            <button onClick={openCart} className="relative group transition-colors p-2 text-zinc-300 hover:text-white drop-shadow-md">
              <ShoppingCart size={22} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce-short">
                  {cart.length}
                </span>
              )}
            </button>

            <button className="lg:hidden text-zinc-300 hover:text-white p-2 drop-shadow-md" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 transition-all duration-500 lg:hidden ${isMobileMenuOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"}`}>
         <Link to="/" className="text-2xl font-black uppercase text-white" onClick={() => setIsMobileMenuOpen(false)}>Início</Link>
         <Link to="/categoria/whey-protein" className="text-xl font-bold uppercase text-zinc-400" onClick={() => setIsMobileMenuOpen(false)}>Whey Protein</Link>
         <Link to="/categoria/creatina" className="text-xl font-bold uppercase text-zinc-400" onClick={() => setIsMobileMenuOpen(false)}>Creatina</Link>
         
         {/* BOTÃO MOBILE ESPECÍFICO */}
         <button onClick={handleAccountClick} className="text-2xl font-black uppercase text-red-600 border border-red-600/50 px-8 py-3 rounded-xl bg-red-600/10">
            {isAuthenticated ? "Minha Conta" : "Entrar / Cadastrar"}
         </button>

         <Link to="/ofertas" className="text-xl font-bold uppercase text-zinc-400" onClick={() => setIsMobileMenuOpen(false)}>Ofertas</Link>
      </div>
    </>
  );
}