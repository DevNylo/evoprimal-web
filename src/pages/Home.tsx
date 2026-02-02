import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingCart, ArrowRight, Loader2 } from "lucide-react";
import Footer from "../components/Footer";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";

export default function Home() {
  // --- LÓGICA DO COMPONENTE ---
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

  // Pré-carregar imagens dos banners
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, [slides]);

  // Rotação automática do slider
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const scrollLeft = () => carouselRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => carouselRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  // --- CATEGORIAS ATUALIZADAS (Caminhos corretos da pasta public) ---
  const categories = [
    { title: "WHEY PROTEIN", slug: "whey-protein", subtitle: "Ganho de Massa", img: "/categories/whey-protein-icon.png" },
    { title: "CREATINA", slug: "creatina", subtitle: "Força Pura", img: "/categories/creatina-icon.png" },
    { title: "PRÉ-TREINO", slug: "pre-treino", subtitle: "Energia", img: "/categories/pre-treino-icon.png" },
    { title: "VITAMINAS", slug: "vitaminas", subtitle: "Saúde", img: "/categories/multivitaminico-icon.png" },
    { title: "BETA-ALANINA", slug: "beta-alanina", subtitle: "Resistência", img: "/categories/beta-alanina-icon.png" },
  ];

  // --- RENDERIZAÇÃO (JSX) ---
  return (
    // 1. O Wrapper recebe a imagem de fundo via estilo inline
    <div className={styles.pageWrapper} style={{ backgroundImage: styles.backgroundImageUrl }}>
      
      {/* 2. Overlay ajustado para ser mais claro e mostrar o fundo */}
      <div className={styles.pageOverlay}></div>

      {/* Conteúdo da Página */}
      <div className="relative z-10">
        
        {/* HERO SECTION */}
        <section className={styles.hero.container}>
            {/* Camada Imagem Hero */}
            <div className={styles.hero.imageLayer}>
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
                        className={styles.hero.image}
                        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
                    />
                    <div className={styles.hero.gradientOverlay}></div>
                    </>
                )}
            </div>

            {/* Camada Texto Hero */}
            <div className={styles.hero.contentLayer}>
                <div className="animate-fade-in-up space-y-6 max-w-3xl pointer-events-auto">
                    <div className="space-y-2">
                        <h1 className={styles.hero.title}>
                        {slides[currentSlide].title} <br />
                        <span className={styles.hero.highlight}>
                            {slides[currentSlide].highlight}
                        </span>
                        </h1>
                        <p className={styles.hero.subtitle}>
                            {slides[currentSlide].sub}
                        </p>
                    </div>
                    
                    <p className={styles.hero.description}>
                        {slides[currentSlide].desc}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <Link to="/ofertas" className={styles.hero.ctaButton}>
                            Ver Ofertas
                        </Link>
                        
                        {slides.length > 1 && (
                            <div className={styles.hero.dotsContainer}>
                            {slides.map((_, idx) => (
                                <div 
                                key={idx} 
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${idx === currentSlide ? "w-8 bg-red-600 shadow-[0_0_10px_#dc2626]" : "w-2.5 bg-zinc-500 hover:bg-zinc-300"}`}
                                ></div>
                            ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>

        {/* CATEGORIAS */}
        <section className="py-12">
            <div className="max-w-[1600px] mx-auto">
            <div className={styles.category.header}>
                <h2 className={styles.category.title}>Categorias</h2>
                <div className="flex gap-2">
                    <button onClick={scrollLeft} className={styles.category.navButton}><ChevronLeft size={20}/></button>
                    <button onClick={scrollRight} className={styles.category.navButton}><ChevronRight size={20}/></button>
                </div>
            </div>
            <div ref={carouselRef} className={styles.category.carousel}>
                {categories.map((cat, i) => (
                <Link key={i} to={`/categoria/${cat.slug}`} className={styles.category.card}>
                    <div className={styles.category.imageContainer}>
                        <img src={cat.img} alt={cat.title} className={styles.category.image} />
                    </div>
                    <h3 className="text-white font-black uppercase text-lg mb-1">{cat.title}</h3>
                    <p className="text-zinc-300 text-[10px] uppercase tracking-widest mb-6 font-bold">{cat.subtitle}</p>
                    <span className={styles.category.button}>Ver Opções</span>
                </Link>
                ))}
            </div>
            </div>
        </section>

        {/* VITRINE */}
        <section className="py-10 md:py-16 max-w-[1600px] mx-auto">
            <div className={styles.showcase.header}>
                <div>
                <p className="text-red-500 font-bold uppercase tracking-widest text-xs mb-2">Loja Oficial</p>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">Destaques</h2>
                </div>
                <Link to="/ofertas" className={styles.showcase.viewAll}>
                Ver Tudo <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-zinc-400">
                <Loader2 size={40} className="animate-spin text-red-600" />
                <p className="text-xs uppercase font-bold tracking-widest">Carregando Estoque...</p>
                </div>
            ) : displayProducts.length === 0 ? (
                <div className={styles.showcase.emptyState}>
                <p className="text-zinc-400">Nenhum produto em destaque encontrado.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {displayProducts.map((product) => (
                    <Link key={product.id} to={`/produto/${product.id}`} className={styles.productCard.container}>
                        <div className={styles.productCard.imageArea}>
                            {product.oldPrice && <span className={styles.productCard.badge}>Oferta</span>}
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className={styles.productCard.image}
                                onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
                            />
                        </div>
                        
                        <div className="p-5 flex flex-col flex-1">
                            <p className={styles.productCard.brand}>
                                {product.brand}
                            </p>
                            
                            <h3 className={styles.productCard.name}>
                                {product.name}
                            </h3>
                            
                            <div className={styles.productCard.footer}>
                                <div>
                                {product.oldPrice && <span className="text-xs text-zinc-400 line-through block">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.oldPrice)}</span>}
                                <span className="text-lg md:text-xl font-black text-white">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</span>
                                </div>
                                
                                <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    addToCart(product);
                                }}
                                className={styles.productCard.cartButton}
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
    </div>
  );
}

// --- CONFIGURAÇÃO DE ESTILOS (SEPARADA) ---
const styles = {
    // 1. IMAGEM DE FUNDO
    backgroundImageUrl: `url('/background-texture.jpg')`, 

    // 2. CONFIGURAÇÃO GERAL DA PÁGINA
    pageWrapper: `
        min-h-screen 
        font-sans selection:bg-red-600 selection:text-white p-4 md:p-8
        bg-fixed bg-cover bg-center bg-no-repeat
        relative
    `,
    
    // 3. OVERLAY (AJUSTADO PARA VISIBILIDADE)
    // bg-black/30 permite ver a imagem de fundo
    pageOverlay: "fixed inset-0 bg-black/30 z-0 pointer-events-none", 

    // --- HERO SECTION (VIDRO) ---
    hero: {
        container: "relative w-full h-[650px] lg:h-[800px] rounded-3xl overflow-hidden shadow-2xl group border border-white/10 bg-white/5 backdrop-blur-sm",
        imageLayer: "absolute inset-0 w-full h-full flex items-center justify-center md:justify-end",
        image: "w-full h-full object-contain object-bottom md:object-right transition-transform duration-[2000ms] ease-out group-hover:scale-105 relative z-0 opacity-90",
        
        gradientOverlay: "absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10 pointer-events-none",
        
        contentLayer: "relative z-20 h-full flex flex-col justify-end md:justify-center px-6 md:px-20 pb-12 md:pb-0 max-w-[1600px] mx-auto pointer-events-none",
        
        title: "text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white drop-shadow-2xl",
        highlight: "text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600",
        subtitle: "text-xl md:text-3xl font-black text-zinc-300 uppercase tracking-widest drop-shadow-md",
        
        description: "text-zinc-200 text-sm md:text-lg border-l-4 border-red-600 pl-4 max-w-lg line-clamp-3 md:line-clamp-none bg-black/30 backdrop-blur-md p-4 rounded-r-xl shadow-lg border-y border-r border-white/5",
        
        ctaButton: "bg-red-600 hover:bg-red-500 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all hover:-translate-y-1 w-full sm:w-auto text-center border border-red-500/50 cursor-pointer shadow-red-900/20",
        
        dotsContainer: "flex gap-2 items-center justify-center sm:justify-start mt-4 sm:mt-0 sm:ml-6 bg-black/30 p-2 px-4 rounded-full backdrop-blur-md border border-white/10 w-fit mx-auto sm:mx-0"
    },

    // --- CATEGORIAS (VIDRO + ROLAGEM INVISÍVEL) ---
    category: {
        header: "flex items-center justify-between mb-8 px-2",
        title: "text-xl font-black uppercase tracking-widest text-white border-l-4 border-red-600 pl-4 drop-shadow-md",
        navButton: "p-3 bg-white/5 border border-white/10 backdrop-blur-md text-zinc-300 hover:text-white hover:border-red-600 rounded-xl transition-colors shadow-lg cursor-pointer",
        
        // Classes para esconder a barra de rolagem (Chrome/Safari/Firefox/IE)
        carousel: "flex gap-4 md:gap-6 overflow-x-auto snap-x pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        
        card: "min-w-[240px] md:min-w-[280px] snap-start bg-white/5 backdrop-blur-md border border-white/10 hover:border-red-600/50 p-6 md:p-8 rounded-2xl flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-2 cursor-pointer !no-underline shadow-lg hover:bg-white/10",
        
        imageContainer: "relative w-28 h-28 md:w-32 md:h-32 mb-6 rounded-full bg-black/20 group-hover:bg-black/40 flex items-center justify-center shadow-inner border border-white/5",
        image: "object-contain h-20 w-20 md:h-24 md:w-24 group-hover:scale-110 transition-transform duration-300 opacity-90 group-hover:opacity-100",
        button: "w-full mt-auto border border-white/20 text-zinc-300 text-[10px] font-bold uppercase py-3 rounded-lg group-hover:bg-red-700 group-hover:text-white group-hover:border-red-700 transition-all block"
    },

    // --- VITRINE ---
    showcase: {
        header: "mb-8 md:mb-12 border-b border-white/10 pb-6 flex justify-between items-end px-2",
        viewAll: "text-zinc-400 font-bold uppercase text-xs tracking-widest flex items-center gap-2 group cursor-pointer hover:text-white transition-colors !no-underline",
        emptyState: "text-center py-20 border border-dashed border-white/10 rounded-xl bg-white/5 backdrop-blur-sm"
    },

    // --- CARD DE PRODUTO (VIDRO) ---
    productCard: {
        container: "bg-white/5 backdrop-blur-md border border-white/10 hover:border-red-600/50 rounded-2xl overflow-hidden group transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-red-900/20 cursor-pointer !no-underline hover:bg-white/10",
        
        imageArea: "h-56 md:h-64 relative bg-black/20 flex items-center justify-center p-6 transition-colors group-hover:bg-black/30",
        image: "object-contain h-full w-full p-2 group-hover:scale-110 transition-transform duration-500",
        badge: "absolute top-4 left-4 bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider z-20 shadow-lg",
        
        brand: "text-[10px] text-zinc-400 font-bold uppercase mb-2 tracking-wider border border-white/10 w-fit px-2 py-1 rounded bg-black/20",
        name: "text-white font-bold text-sm uppercase leading-relaxed mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-red-500 transition-colors drop-shadow-sm",
        
        footer: "mt-auto pt-4 flex justify-between items-center border-none !no-underline",
        cartButton: "w-10 h-10 bg-white/10 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-all shadow-lg hover:shadow-red-500/20 z-20 backdrop-blur-md border border-white/10"
    }
};