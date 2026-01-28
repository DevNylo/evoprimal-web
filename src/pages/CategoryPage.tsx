import { useParams, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Loader2, SearchX } from "lucide-react";
import Footer from "../components/Footer";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";

export default function CategoryPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams(); // 1. Hook para ler o ?q=nome-do-produto
  const { addToCart } = useCart();
  const { products, loading } = useStore();

  // 2. Lógica de Identificação: É busca ou categoria?
  const isSearch = slug === "busca";
  const query = searchParams.get("q") || "";

  // 3. Filtragem Inteligente
  const filteredProducts = isSearch
    ? products.filter((p) => 
        // Procura no Nome OU na Descrição (ignorando maiúsculas/minúsculas)
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.description.toLowerCase().includes(query.toLowerCase())
      )
    : products.filter((p) => p.category === slug);

  // Títulos para as categorias normais
  const categoryTitles: Record<string, string> = {
    "whey-protein": "Whey Protein",
    "creatina": "Creatina Pura",
    "pre-treino": "Pré-Treinos",
    "vitaminas": "Multivitamínicos",
    "beta-alanina": "Beta-Alanina",
  };

  // Define o título da página
  const title = isSearch 
    ? `Resultados para "${query}"` 
    : (categoryTitles[slug as string] || "Produtos");

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">
      <main className="flex-1 pt-40 pb-20 px-6 max-w-[1280px] mx-auto w-full">
        
        {/* CABEÇALHO DA PÁGINA */}
        <div className="mb-12 border-b border-white/5 pb-6">
           <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-red-600 mb-6 transition-colors text-[10px] font-bold uppercase tracking-[0.2em] group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
              Voltar
           </Link>
           <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white break-words">
             {title} {!isSearch && <span className="text-red-600">.</span>}
           </h1>
           <p className="text-zinc-400 mt-2 text-sm">
             {isSearch 
               ? `Encontramos ${filteredProducts.length} produto(s).` 
               : "Explorando a categoria de alta performance."}
           </p>
        </div>

        {/* LOADING */}
        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 size={40} className="animate-spin text-red-600" />
           </div>
        ) : filteredProducts.length === 0 ? (
          
          /* ESTADO VAZIO (NENHUM PRODUTO ENCONTRADO) */
          <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <div className="bg-zinc-900 p-6 rounded-full mb-6">
               <SearchX size={48} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">
              {isSearch ? "Nenhum resultado encontrado" : "Categoria Vazia"}
            </h2>
            <p className="text-zinc-500 text-sm max-w-md mx-auto">
              {isSearch 
                ? `Não encontramos nada com o termo "${query}". Tente buscar por palavras mais gerais.` 
                : "Ainda não temos produtos cadastrados nesta seção."}
            </p>
            <Link to="/" className="mt-8 px-8 py-4 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-widest rounded transition-all shadow-lg shadow-red-900/20">
                Voltar para a Loja
            </Link>
          </div>

        ) : (
          
          /* GRID DE PRODUTOS */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {filteredProducts.map((product) => (
               <Link 
                  key={product.id} 
                  to={`/produto/${product.id}`} 
                  className="bg-[#0a0a0a]/80 border border-white/5 hover:border-red-600/50 rounded-xl overflow-hidden group transition-all duration-300 flex flex-col hover:shadow-lg hover:shadow-red-900/10 backdrop-blur-sm cursor-pointer !no-underline"
               >
                  <div className="h-64 relative bg-[#0e0e0e]/50 flex items-center justify-center p-6 border-b border-white/5 group-hover:border-zinc-800 transition-colors">
                     {product.oldPrice && <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider z-20">Oferta</span>}
                     <img 
                          src={product.image} 
                          alt={product.name} 
                          className="object-contain h-full w-full p-4 group-hover:scale-110 transition-transform duration-500" 
                     />
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                     <p className="text-[10px] text-zinc-500 font-bold uppercase mb-2 tracking-wider border border-zinc-800 w-fit px-2 py-1 rounded">{product.brand}</p>
                     
                     <h3 className="text-white font-bold text-sm uppercase leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem] group-hover:underline decoration-white underline-offset-4 decoration-1 transition-colors">
                        {product.name}
                     </h3>

                     <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center group-hover:border-zinc-800 border-none !no-underline">
                        <div>
                           {product.oldPrice && <span className="text-xs text-zinc-600 line-through block !no-underline">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.oldPrice)}</span>}
                           <span className="text-xl font-black text-white !no-underline">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</span>
                        </div>
                        
                        <button 
                          onClick={(e) => {
                             e.preventDefault();
                             addToCart(product);
                          }}
                          className="w-10 h-10 bg-zinc-800 hover:bg-red-600 text-white rounded flex items-center justify-center transition-all shadow-lg hover:shadow-red-500/20 z-20"
                        >
                          <ShoppingCart size={18} />
                        </button>
                     </div>
                  </div>
               </Link>
             ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}