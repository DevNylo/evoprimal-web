import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Star, Truck, ShoppingBag, Loader2 } from "lucide-react";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { products, loading } = useStore();

  const product = products.find((p) => p.id === Number(id));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white gap-4">
        <Loader2 size={40} className="animate-spin text-red-600" />
        <p className="uppercase font-bold tracking-widest text-xs">Carregando detalhes...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-black uppercase mb-4">Produto não encontrado</h1>
        <Link to="/" className="text-red-600 hover:underline">Voltar para a loja</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <main className="pt-40 pb-20 px-6 max-w-[1280px] mx-auto">
        
        {/* Breadcrumb */}
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-red-600 mb-8 transition-colors text-[10px] font-bold uppercase tracking-[0.2em] group">
           <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
           Voltar para Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Coluna da Imagem */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl flex items-center justify-center p-8 md:p-16 relative group">
             <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
             <img 
               src={product.image} 
               alt={product.name} 
               className="w-full max-h-[500px] object-contain drop-shadow-2xl z-10 group-hover:scale-105 transition-transform duration-500" 
             />
          </div>

          {/* Coluna de Informações */}
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-red-600/10 text-red-600 border border-red-600/20 px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider">
                {product.brand}
              </span>
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
              </div>
              <span className="text-zinc-500 text-xs">(4.9/5.0)</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[1.1] mb-6">
              {product.name}
            </h1>

            <p className="text-zinc-400 leading-relaxed text-sm mb-8 border-l-2 border-red-600/50 pl-4">
              {product.description}
            </p>

            <div className="mt-auto bg-[#0a0a0a] border border-white/5 rounded-xl p-6 md:p-8">
               <div className="flex items-end gap-4 mb-6">
                  {product.oldPrice && (
                    <span className="text-zinc-500 line-through text-lg font-bold">
                       {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.oldPrice)}
                    </span>
                  )}
                  <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                     {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                  </span>
               </div>

               <button 
                  onClick={() => addToCart(product)}
                  className="w-full bg-red-600 hover:bg-red-500 text-white py-4 md:py-5 rounded-lg font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
               >
                  <ShoppingBag size={20} />
                  Adicionar ao Carrinho
               </button>

               <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="bg-zinc-900 p-2 rounded text-red-600"><Truck size={20} /></div>
                    <div className="flex flex-col">
                       <span className="text-white text-[10px] font-black uppercase">Frete Grátis</span>
                       <span className="text-zinc-500 text-[10px]">Para todo o Brasil</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-zinc-900 p-2 rounded text-red-600"><ShieldCheck size={20} /></div>
                    <div className="flex flex-col">
                       <span className="text-white text-[10px] font-black uppercase">Garantia Total</span>
                       <span className="text-zinc-500 text-[10px]">30 dias para troca</span>
                    </div>
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