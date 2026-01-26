import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingCart, ArrowRight, Loader2 } from "lucide-react";
import Footer from "../components/Footer";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";

export default function Home() {
  const { products, banners, loading } = useStore(); 
  const { addToCart } = useCart();
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const featuredProducts = products.filter(p => p.isFeatured);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

  const [currentSlide, setCurrentSlide] = useState(0);

  // Slides de fallback caso a API não retorne nada
  const localSlides = [
    {
      id: 999,
      title: "POTÊNCIA PURA",
      highlight: "PARA SEU TREINO",
      sub: "RESULTADOS REAIS",
      desc: "Cadastre seus banners no painel do Strapi para que eles apareçam aqui.",
      image: "/placeholder.png" 
    }
  ];

  const slides = banners.length > 0 ? banners : localSlides;

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const scrollLeft = () => carouselRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => carouselRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  const categories = [
    { title: "WHEY PROTEIN", slug: "whey-protein", subtitle: "Ganho de Massa", img: "/products/whey-dux.png" },
    { title: "CREATINA", slug: "creatina", subtitle: "Força Pura", img: "/products/creatina-max.png" },
    { title: "PRÉ-TREINO", slug: "pre-treino", subtitle: "Energia", img: "/products/pre-insane.png" },
    { title: "VITAMINAS", slug: "vitaminas", subtitle: "Saúde", img: "/products/multi-evo.png" },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white font-sans selection:bg-red-600 selection:text-white">
      
      {/* HERO SECTION */}
      <section className="pt-40 pb-20 px-6 max-w-[1280px] mx-auto border-b border-white/5">
        {loading && banners.length === 0 ? (
           <div className="h-[600px] flex items-center justify-center border border-white/5 rounded-2xl bg-white/5 animate-pulse">
              <Loader2 className="animate-spin text-red-600" size={40} />
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-[600px]">
            {/* AJUSTE 1: Adicionado 'max-w-2xl lg:max-w-none' para limitar a largura do texto em telas médias.
               AJUSTE 3: Mudado 'z-10' para 'z-20' para garantir que o texto fique sobre a imagem.
            */}
            <div className="space-y-6 animate-fade-in-right flex flex-col justify-center h-full relative z-20 max-w-2xl lg:max-w-none mx-auto lg:mx-0">
               <div className="flex flex-col justify-end pb-4">
                 {/* AJUSTE 2: Reduzido o tamanho da fonte de 'md:text-7xl' para 'md:text-6xl' 
                    e adicionado 'xl:text-7xl' para telas muito grandes.
                 */}
                 <h1 className="text-5xl md:text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-zinc-100">
                   {slides[currentSlide].title} <br />
                   <span className="text-red-600 transition-all duration-500">{slides[currentSlide].highlight}</span> <br />
                   {slides[currentSlide].sub}
                 </h1>
               </div>
               
               <div className="flex items-start">
                 <p className="text-zinc-400 text-lg border-l-4 border-red-600 pl-4 max-w-md line-clamp-3">
                   {slides[currentSlide].desc}
                 </p>
               </div>
               
               <div className="flex gap-4 pt-4 items-start">
                  <Link to="/ofertas" className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded font-black uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all hover:-translate-y-1">
                    Ver Ofertas
                  </Link>
                  
                  {slides.length > 1 && (
                    <div className="flex gap-2 items-center ml-4 mt-4">
                       {slides.map((_, idx) => (
                         <div 
                           key={idx} 
                           onClick={() => setCurrentSlide(idx)}
                           className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === currentSlide ? "w-8 bg-red-600" : "w-2 bg-zinc-700"}`}
                         ></div>
                       ))}
                    </div>
                  )}
               </div>
            </div>
            
            <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
                <div className="absolute w-[60%] h-[60%] bg-red-600/20 blur-[100px] rounded-full animate-pulse"></div>
                <img 
                  key={currentSlide} 
                  src={slides[currentSlide].image} 
                  alt="Hero Banner" 
                  className="absolute inset-0 m-auto w-full h-[90%] object-contain drop-shadow-2xl animate-in fade-in zoom-in duration-700 z-10"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
                />
            </div>
          </div>
        )}
      </section>

      {/* CATEGORIAS */}
      <section className="py-20 border-b border-white/5 bg-black/20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
             <h2 className="text-xl font-black uppercase tracking-widest text-white border-l-4 border-red-600 pl-4">Categorias</h2>
             <div className="flex gap-2">
                <button onClick={scrollLeft} className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-red-600 rounded transition-colors"><ChevronLeft size={20}/></button>
                <button onClick={scrollRight} className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-red-600 rounded transition-colors"><ChevronRight size={20}/></button>
             </div>
          </div>
          <div ref={carouselRef} className="flex gap-6 overflow-x-auto scrollbar-hide snap-x pb-4" style={{ scrollbarWidth: 'none' }}>
            {categories.map((cat, i) => (
              <Link key={i} to={`/categoria/${cat.slug}`} className="min-w-[260px] snap-start bg-[#0a0a0a]/50 border border-white/10 hover:border-red-600/50 p-8 rounded-xl flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-2 cursor-pointer backdrop-blur-sm !no-underline">
                 <div className="relative w-32 h-32 mb-6 rounded-full bg-[#111] group-hover:bg-[#1a1a1a] flex items-center justify-center shadow-inner">
                    <img src={cat.img} alt={cat.title} className="object-contain h-24 w-24 group-hover:scale-110 transition-transform duration-300" />
                 </div>
                 <h3 className="text-white font-black uppercase text-lg mb-1">{cat.title}</h3>
                 <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-6 font-bold">{cat.subtitle}</p>
                 <span className="w-full mt-auto border border-zinc-800 text-zinc-400 text-[10px] font-bold uppercase py-3 rounded group-hover:bg-red-700 group-hover:text-white group-hover:border-red-700 transition-all block">Ver Opções</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* VITRINE */}
      <section className="py-24 px-6 max-w-[1280px] mx-auto">
         <div className="mb-12 border-b border-white/5 pb-6 flex justify-between items-end">
            <div>
               <p className="text-red-600 font-bold uppercase tracking-widest text-xs mb-2">Loja Oficial</p>
               <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Destaques</h2>
            </div>
            <Link to="/ofertas" className="text-zinc-500 font-bold uppercase text-xs tracking-widest flex items-center gap-2 group cursor-pointer hover:text-white transition-colors !no-underline">
               Ver Ofertas <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
         </div>

         {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-zinc-500">
               <Loader2 size={40} className="animate-spin text-red-600" />
               <p className="text-xs uppercase font-bold tracking-widest">Carregando Estoque...</p>
            </div>
         ) : displayProducts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl">
               <p className="text-zinc-500">Nenhum produto em destaque encontrado.</p>
            </div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {displayProducts.map((product) => (
                  <Link 
                    key={product.id} 
                    to={`/produto/${product.id}`} 
                    className="bg-[#0a0a0a]/80 border border-white/5 hover:border-red-600/50 rounded-xl overflow-hidden group transition-all duration-300 flex flex-col hover:shadow-lg hover:shadow-red-900/10 backdrop-blur-sm cursor-pointer !no-underline"
                  >
                     <div className="h-64 relative bg-[#0e0e0e]/50 flex items-center justify-center p-6 transition-colors">
                        {product.oldPrice && <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider z-20">Oferta</span>}
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="object-contain h-full w-full p-4 group-hover:scale-110 transition-transform duration-500" 
                            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
                        />
                     </div>
                     
                     <div className="p-6 flex flex-col flex-1">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase mb-2 tracking-wider border border-zinc-800 w-fit px-2 py-1 rounded">
                            {product.brand}
                        </p>
                        
                        <h3 className="text-white font-bold text-sm uppercase leading-relaxed mb-2 line-clamp-2 min-h-[2.5rem] group-hover:underline decoration-white underline-offset-4 decoration-1">
                            {product.name}
                        </h3>
                        
                        <div className="mt-auto pt-4 flex justify-between items-center border-none !no-underline">
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
                             title="Adicionar ao Carrinho"
                           >
                             <ShoppingCart size={18} />
                           </button>
                        </div>
                     </div>
                  </Link>
               ))}
            </div>
         )}
      </section>

      <Footer />
    </div>
  );
}