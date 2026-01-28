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

  // Pré-carregar imagens
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, [slides]);

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
    { title: "WHEY PROTEIN", slug: "whey-protein", subtitle: "Ganho de Massa", img: "/placeholder.png" },
    { title: "CREATINA", slug: "creatina", subtitle: "Força Pura", img: "/placeholder.png" },
    { title: "PRÉ-TREINO", slug: "pre-treino", subtitle: "Energia", img: "/placeholder.png" },
    { title: "VITAMINAS", slug: "vitaminas", subtitle: "Saúde", img: "/placeholder.png" },
    { title: "BETA-ALANINA", slug: "beta-alanina", subtitle: "Resistência", img: "/placeholder.png" },
  ];

  return (
    // WRAPPER "MOLDURA"
    <div className="min-h-screen bg-[#090909] p-4 md:p-8 font-sans selection:bg-red-600 selection:text-white">
      
      {/* HERO SECTION */}
      <section className="relative w-full h-[650px] lg:h-[800px] rounded-3xl overflow-hidden shadow-2xl group border border-white/5 bg-[#111]">
        
        {/* CAMADA 1: IMAGEM E FUNDO */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center md:justify-end">
            {loading && banners.length === 0 ? (
               <div className="w-full h-full flex items-center justify-center animate-pulse">
                  <Loader2 className="animate-spin text-red-600" size={40} />
               </div>
            ) : (
                <>
                  <img 
                    key={currentSlide} 
                    src={slides[currentSlide].image} 
                    alt="Hero Banner" 
                    className="w-full h-full object-contain object-bottom md:object-right transition-transform duration-[2000ms] ease-out group-hover:scale-105 relative z-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
                  />
                  
                  {/* GRADIENTE SUAVE */}
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#111] via-[#111]/50 to-transparent z-10 pointer-events-none"></div>

                  {/* --- CORREÇÃO DE BANDING (RUÍDO) --- */}
                  {/* Esta camada adiciona uma textura sutil para quebrar as listras do degradê */}
                  <div 
                    className="absolute inset-0 z-10 pointer-events-none opacity-[0.04] mix-blend-overlay"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                    }}
                  ></div>
                </>
            )}
        </div>

        {/* CAMADA 2: CONTEÚDO (TEXTO) */}
        <div className="relative z-20 h-full flex flex-col justify-end md:justify-center px-6 md:px-20 pb-12 md:pb-0 max-w-[1600px] mx-auto pointer-events-none">
           <div className="animate-fade-in-up space-y-6 max-w-3xl pointer-events-auto">
               
               <div className="space-y-2">
                 <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white drop-shadow-2xl">
                   {slides[currentSlide].title} <br />
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">
                      {slides[currentSlide].highlight}
                   </span>
                 </h1>
                 <p className="text-xl md:text-3xl font-black text-zinc-300 uppercase tracking-widest drop-shadow-md">
                    {slides[currentSlide].sub}
                 </p>
               </div>
               
               <p className="text-zinc-300 text-sm md:text-lg border-l-4 border-red-600 pl-4 max-w-lg line-clamp-3 md:line-clamp-none bg-black/40 backdrop-blur-md p-4 rounded-r-xl shadow-lg">
                   {slides[currentSlide].desc}
               </p>
               
               <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Link to="/ofertas" className="bg-red-600 hover:bg-red-500 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all hover:-translate-y-1 w-full sm:w-auto text-center border border-red-500/50">
                    Ver Ofertas
                  </Link>
                  
                  {slides.length > 1 && (
                    <div className="flex gap-2 items-center justify-center sm:justify-start mt-4 sm:mt-0 sm:ml-6 bg-black/40 p-2 px-4 rounded-full backdrop-blur-md border border-white/10 w-fit mx-auto sm:mx-0">
                       {slides.map((_, idx) => (
                         <div 
                           key={idx} 
                           onClick={() => setCurrentSlide(idx)}
                           className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${idx === currentSlide ? "w-8 bg-red-600 shadow-[0_0_10px_#dc2626]" : "w-2.5 bg-zinc-600 hover:bg-zinc-400"}`}
                         ></div>
                       ))}
                    </div>
                  )}
               </div>
           </div>
        </div>
      </section>

      {/* CATEGORIAS (MANTIDO) */}
      <section className="py-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-8 px-2">
             <h2 className="text-xl font-black uppercase tracking-widest text-white border-l-4 border-red-600 pl-4">Categorias</h2>
             <div className="flex gap-2">
                <button onClick={scrollLeft} className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-red-600 rounded-xl transition-colors"><ChevronLeft size={20}/></button>
                <button onClick={scrollRight} className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-red-600 rounded-xl transition-colors"><ChevronRight size={20}/></button>
             </div>
          </div>
          <div ref={carouselRef} className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x pb-4" style={{ scrollbarWidth: 'none' }}>
            {categories.map((cat, i) => (
              <Link key={i} to={`/categoria/${cat.slug}`} className="min-w-[240px] md:min-w-[280px] snap-start bg-[#111] border border-white/5 hover:border-red-600/50 p-6 md:p-8 rounded-2xl flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-2 cursor-pointer !no-underline shadow-lg">
                 <div className="relative w-28 h-28 md:w-32 md:h-32 mb-6 rounded-full bg-[#090909] group-hover:bg-[#1a1a1a] flex items-center justify-center shadow-inner border border-white/5">
                    <img src={cat.img} alt={cat.title} className="object-contain h-20 w-20 md:h-24 md:w-24 group-hover:scale-110 transition-transform duration-300 opacity-80 group-hover:opacity-100" />
                 </div>
                 <h3 className="text-white font-black uppercase text-lg mb-1">{cat.title}</h3>
                 <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-6 font-bold">{cat.subtitle}</p>
                 <span className="w-full mt-auto border border-zinc-800 text-zinc-400 text-[10px] font-bold uppercase py-3 rounded-lg group-hover:bg-red-700 group-hover:text-white group-hover:border-red-700 transition-all block">Ver Opções</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* VITRINE (MANTIDO) */}
      <section className="py-10 md:py-16 max-w-[1600px] mx-auto">
         <div className="mb-8 md:mb-12 border-b border-white/5 pb-6 flex justify-between items-end px-2">
            <div>
               <p className="text-red-600 font-bold uppercase tracking-widest text-xs mb-2">Loja Oficial</p>
               <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">Destaques</h2>
            </div>
            <Link to="/ofertas" className="text-zinc-500 font-bold uppercase text-xs tracking-widest flex items-center gap-2 group cursor-pointer hover:text-white transition-colors !no-underline">
               Ver Tudo <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
               {displayProducts.map((product) => (
                  <Link 
                    key={product.id} 
                    to={`/produto/${product.id}`} 
                    className="bg-[#111] border border-white/5 hover:border-red-600/50 rounded-2xl overflow-hidden group transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-red-900/10 cursor-pointer !no-underline"
                  >
                     <div className="h-56 md:h-64 relative bg-[#0e0e0e] flex items-center justify-center p-6 transition-colors">
                        {product.oldPrice && <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider z-20">Oferta</span>}
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="object-contain h-full w-full p-2 group-hover:scale-110 transition-transform duration-500" 
                            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
                        />
                     </div>
                     
                     <div className="p-5 flex flex-col flex-1">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase mb-2 tracking-wider border border-zinc-800 w-fit px-2 py-1 rounded">
                            {product.brand}
                        </p>
                        
                        <h3 className="text-white font-bold text-sm uppercase leading-relaxed mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-red-500 transition-colors">
                            {product.name}
                        </h3>
                        
                        <div className="mt-auto pt-4 flex justify-between items-center border-none !no-underline">
                           <div>
                              {product.oldPrice && <span className="text-xs text-zinc-600 line-through block !no-underline">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.oldPrice)}</span>}
                              <span className="text-lg md:text-xl font-black text-white !no-underline">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</span>
                           </div>
                           
                           <button 
                             onClick={(e) => {
                               e.preventDefault();
                               addToCart(product);
                             }}
                             className="w-10 h-10 bg-zinc-800 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-all shadow-lg hover:shadow-red-500/20 z-20"
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