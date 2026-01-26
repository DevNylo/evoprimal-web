import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Percent, Loader2, Frown } from "lucide-react";
import Footer from "../components/Footer";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";

export default function OfferPage() {
  const { addToCart } = useCart();
  const { products, loading } = useStore();

  // LÓGICA DE FILTRAGEM:
  // Só mostra produtos que tenham 'oldPrice' definido e maior que o preço atual.
  const offerProducts = products.filter(
    (p) => p.oldPrice && p.oldPrice > p.price
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">
      {/* Navbar já é fixa, então usamos padding-top para não esconder o conteúdo */}
      <main className="flex-1 pt-32 pb-20 px-6 max-w-[1280px] mx-auto w-full">
        
        {/* CABEÇALHO DA PÁGINA */}
        <div className="mb-12 border-b border-white/5 pb-6">
           <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-red-600 mb-6 transition-colors text-[10px] font-bold uppercase tracking-[0.2em] group !no-underline">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
              Voltar
           </Link>
           <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white flex items-center gap-4">
             Ofertas <span className="text-red-600">Relâmpago</span>
             <Percent size={40} className="text-zinc-800 hidden md:block" />
           </h1>
           <p className="text-zinc-400 mt-2 text-sm">
             {loading ? "Buscando descontos..." : `Encontramos ${offerProducts.length} oportunidades de alta performance.`}
           </p>
        </div>

        {/* ESTADOS DE CARREGAMENTO E VAZIO */}
        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 size={40} className="animate-spin text-red-600" />
           </div>
        ) : offerProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center">
            <Frown size={48} className="text-zinc-600 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Sem ofertas no momento</h2>
            <p className="text-zinc-500 text-sm">Nossos estoques promocionais esgotaram. Volte em breve.</p>
            <Link to="/" className="mt-6 px-6 py-3 bg-zinc-800 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded transition-all">
                Ver todos os produtos
            </Link>
          </div>
        ) : (
          /* GRID DE PRODUTOS */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {offerProducts.map((product) => {
               // Cálculo da Porcentagem de Desconto
               const discount = product.oldPrice 
                 ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
                 : 0;

               return (
                 <Link 
                    key={product.id} 
                    to={`/produto/${product.id}`} 
                    className="bg-[#0a0a0a]/80 border border-white/5 hover:border-red-600/50 rounded-xl overflow-hidden group transition-all duration-300 flex flex-col hover:shadow-lg hover:shadow-red-900/10 backdrop-blur-sm cursor-pointer !no-underline relative"
                 >
                    {/* Badge de Desconto (Destaque visual) */}
                    <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider z-20 shadow-lg shadow-red-900/50">
                        {discount}% OFF
                    </div>

                    <div className="h-64 relative bg-[#0e0e0e]/50 flex items-center justify-center p-6 border-b border-white/5 group-hover:border-zinc-800 transition-colors">
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
                             <span className="text-xs text-zinc-600 line-through block !no-underline font-bold">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.oldPrice || 0)}
                             </span>
                             <span className="text-xl font-black text-white !no-underline">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                             </span>
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
               );
             })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}