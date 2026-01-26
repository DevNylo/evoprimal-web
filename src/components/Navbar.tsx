import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, X, ChevronDown } from "lucide-react"; 
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cartCount, openCart } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const productCategories = [
    { name: "Whey Protein", slug: "whey-protein" },
    { name: "Creatina", slug: "creatina" },
    { name: "Pré-Treino", slug: "pre-treino" },
    { name: "Vitaminas", slug: "vitaminas" },
  ];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/categoria/busca?q=${query}`);
      setIsSearchOpen(false);
    }
  }

  return (
    <nav
      className="
        fixed top-0 left-0 w-full z-50
        h-24
        bg-[#050505]/90 backdrop-blur-md
        border-b border-white/5
        shadow-lg shadow-black/50
      "
    >
      <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between gap-4">

        {/* LOGO */}
        <Link to="/" className="relative flex items-center shrink-0 z-20 group cursor-pointer">
          <img
            src="/logo.png"
            alt="EVOPRIMAL Logo"
            className="h-12 md:h-20 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(220,38,38,0.2)] group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.4)] transition-all duration-500"
          />
        </Link>

        {/* MENU */}
        {!isSearchOpen && (
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 h-full">
            <Link 
              to="/" 
              className="text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-colors"
            >
              Início
            </Link>

            <div className="relative group h-full flex items-center">
              <button className="flex items-center gap-1 text-sm font-black uppercase tracking-widest text-zinc-400 group-hover:text-red-600 transition-colors py-8 cursor-default">
                Produtos <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>

              <div className="absolute top-[calc(100%-1px)] left-1/2 -translate-x-1/2 w-56 bg-[#0a0a0a] border border-white/10 rounded-b-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex flex-col overflow-hidden">
                 {productCategories.map((cat) => (
                   <Link 
                     key={cat.slug} 
                     to={`/categoria/${cat.slug}`}
                     className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-red-600/10 hover:border-l-4 border-red-600 transition-all block border-l-4 border-transparent"
                   >
                     {cat.name}
                   </Link>
                 ))}
              </div>
            </div>

            <Link to="/ofertas" className="text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-colors">
              Ofertas
            </Link>
            
            <Link to="/contato" className="text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-colors">
              Contato
            </Link>
          </div>
        )}

        {/* AÇÕES */}
        <div className="flex items-center gap-4 md:gap-6 justify-end flex-1">
          <div
            className={`
              flex items-center rounded-full transition-all duration-300 border
              ${isSearchOpen
                ? "w-full md:w-64 px-4 py-2 bg-zinc-900/50 border-white/10"
                : "w-12 h-12 justify-center border-transparent"}
            `}
          >
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center w-full">
                <input
                  autoFocus
                  type="text"
                  placeholder="BUSCAR..."
                  className="
                    bg-transparent border-none outline-none
                    text-white text-sm w-full
                    placeholder:text-zinc-600 uppercase font-bold tracking-wide
                  "
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={() => !query && setIsSearchOpen(false)}
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-zinc-500 hover:text-white ml-2"
                >
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <Search size={24} />
              </button>
            )}
          </div>

          <div onClick={openCart} className="relative cursor-pointer group">
            <div className="
              p-3 rounded-full
              bg-zinc-900/50 border border-white/5
              group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-300
            ">
              <ShoppingBag size={24} className="text-zinc-400 group-hover:text-white transition-colors" />
            </div>

            {cartCount > 0 && (
              <span className="
                absolute -top-1 -right-1
                bg-red-600 text-white
                text-[10px] font-black
                w-5 h-5 flex items-center justify-center
                rounded-full
                border-2 border-[#050505] shadow-lg
              ">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}