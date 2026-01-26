import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Star, Truck, ShoppingBag, Loader2 } from "lucide-react";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext"; // <--- CORREÇÃO AQUI

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { products, loading } = useStore(); // <--- CORREÇÃO AQUI

  // Busca o produto na lista que veio do Strapi
  const product = products.find((p) => p.id === Number(id));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white gap-4">
        <Loader2 size={40} className="animate-spin text-green-600" />
        <p className="uppercase font-bold tracking-widest text-xs">Carregando detalhes...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-black uppercase mb-4">Produto não encontrado</h1>
        <Link to="/" className="text-green-500 hover:underline">Voltar para a loja</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      {/* Navbar removida pois está no App.tsx */}

      <main className="pt-32 pb-20 px-6 max-w-[1280px] mx-auto">
        
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-green-500 mb-12 transition-colors text-[10px] font-bold uppercase tracking-[0.2em] group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Voltar para a Loja
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* IMAGEM */}
          <div className="relative aspect-square bg-[#0a0a0a] border border-white/10 rounded-2xl flex items-center justify-center p-12 group overflow-hidden">
            <div className="absolute inset-0 bg-green-900/10 blur-[50px] rounded-full group-hover:bg-green-900/20 transition-colors duration-500"></div>
            <img 
              src={product.image} 
              alt={product.name}
              className="relative z-10 object-contain w-full h-full drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
            />
            {/* Exibe tag se for destaque ou oferta */}
            {(product.oldPrice || product.isFeatured) && (
                <div className="absolute top-6 left-6 bg-green-600 text-white text-[10px] font-black px-3 py-1.5 rounded uppercase tracking-wider z-20 shadow-lg shadow-green-900/20">
                  {product.oldPrice ? "Oferta" : "Destaque"}
                </div>
            )}
          </div>

          {/* DETALHES */}
          <div className="flex flex-col h-full animate-fade-in-right">
            <div className="mb-6">
              <span className="text-green-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block border border-green-900/30 bg-green-900/10 w-fit px-2 py-1 rounded">
                {product.brand}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase leading-[0.95] tracking-tighter mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-6">
                <div className="flex text-green-500">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-wide">(Novo)</span>
              </div>
            </div>

            <div className="mb-8">
              {product.oldPrice && (
                <span className="text-zinc-600 line-through text-sm font-bold block mb-1">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.oldPrice)}
                </span>
              )}
              <div className="flex items-end gap-3">
                <span className="text-5xl font-black text-white tracking-tighter">
                   {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </span>
                <div className="flex flex-col mb-1.5">
                   <span className="text-green-500 font-bold text-xs uppercase tracking-wider">À vista no PIX</span>
                   <span className="text-zinc-500 text-[10px] uppercase">ou 12x no cartão</span>
                </div>
              </div>
            </div>

            <p className="text-zinc-400 leading-relaxed mb-8 text-sm border-l-2 border-zinc-800 pl-4 whitespace-pre-wrap">
              {product.description}
            </p>

            <button 
              className="w-full group bg-green-600 hover:bg-green-500 text-white py-5 rounded-lg font-black uppercase tracking-[0.2em] text-sm shadow-[0_0_20px_rgba(22,163,74,0.3)] hover:shadow-[0_0_30px_rgba(22,163,74,0.6)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] mt-auto cursor-pointer"
              onClick={() => addToCart(product)}
            >
              <ShoppingBag size={20} className="group-hover:-translate-y-1 transition-transform" />
              Adicionar ao Carrinho
            </button>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="bg-zinc-900 p-2 rounded text-green-500"><Truck size={20} /></div>
                <div className="flex flex-col">
                   <span className="text-white text-[10px] font-black uppercase">Frete Grátis</span>
                   <span className="text-zinc-500 text-[10px]">Para todo o Brasil</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-zinc-900 p-2 rounded text-green-500"><ShieldCheck size={20} /></div>
                <div className="flex flex-col">
                   <span className="text-white text-[10px] font-black uppercase">Garantia Total</span>
                   <span className="text-zinc-500 text-[10px]">30 dias para troca</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}