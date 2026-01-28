import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";
import { ShoppingCart, ChevronLeft, Star, Truck, ShieldCheck, CreditCard, QrCode, Loader2 } from "lucide-react";
import Footer from "../components/Footer";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useStore();
  const { addToCart, openCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  
  // --- CÓDIGO DA GALERIA (Comentado para não travar o Build) ---
  // Quando você for criar a galeria, basta remover as barras '//' abaixo:
  // const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const found = products.find((p) => p.id === Number(id));
    setProduct(found);
    
    // setSelectedImage(0); // Comentado
    
    window.scrollTo(0, 0);
  }, [id, products]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#090909] flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-red-600" />
      </div>
    );
  }

  // --- CÁLCULOS FINANCEIROS ---
  const discountPix = 0.05;
  const pricePix = product.price * (1 - discountPix);
  const maxInstallments = 6;
  const installmentValue = product.price / maxInstallments;
  const freeShippingThreshold = 99.99;

  return (
    <div className="min-h-screen bg-[#090909] font-sans selection:bg-red-600 selection:text-white pt-20 lg:pt-28">
      
      {/* BREADCRUMB / VOLTAR */}
      <div className="max-w-[1280px] mx-auto px-6 py-6">
         <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest bg-transparent border-none cursor-pointer"
         >
            <ChevronLeft size={16} /> Voltar
         </button>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* COLUNA ESQUERDA: IMAGENS */}
          <div className="space-y-6">
             {/* Imagem Principal */}
             <div className="aspect-square bg-[#111] rounded-3xl border border-white/5 flex items-center justify-center p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent)]"></div>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
                {product.oldPrice && (
                    <span className="absolute top-6 left-6 bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded uppercase tracking-wider">
                        -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                    </span>
                )}
             </div>
          </div>

          {/* COLUNA DIREITA: DETALHES */}
          <div className="flex flex-col">
             
             {/* Marca e Avaliação */}
             <div className="flex items-center justify-between mb-4">
                <span className="text-red-600 font-bold uppercase tracking-widest text-xs border border-red-600/30 px-2 py-1 rounded">
                    {product.brand || "Evo Primal"}
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <div className="flex">
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                    </div>
                    <span className="text-zinc-500 ml-2">(4.9/5.0)</span>
                </div>
             </div>

             <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                {product.name}
             </h1>

             <p className="text-zinc-400 text-sm leading-relaxed border-l-2 border-red-600 pl-4 mb-8">
                {product.description || "Qualidade internacional e preço de fábrica. Potencialize seus resultados com a pureza que seu corpo merece."}
             </p>

             {/* BLOCO DE PREÇO E PAGAMENTO */}
             <div className="bg-[#111] border border-white/5 rounded-2xl p-6 mb-8 shadow-xl">
                 
                 <div className="flex items-end gap-3 mb-2">
                    {product.oldPrice && (
                        <span className="text-zinc-500 line-through text-lg decoration-red-600/50">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.oldPrice)}
                        </span>
                    )}
                    <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                    </span>
                 </div>

                 <div className="space-y-3 pt-4 border-t border-white/5">
                    
                    {/* PIX */}
                    <div className="flex items-start gap-3">
                        <QrCode className="text-red-600 mt-1 shrink-0" size={20} />
                        <div>
                            <p className="text-green-500 font-bold text-lg leading-none">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pricePix)}
                                <span className="text-zinc-400 text-xs font-normal ml-2">via Pix ou Boleto</span>
                            </p>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mt-0.5">
                                10% de Desconto Imediato
                            </p>
                        </div>
                    </div>

                    {/* CARTÃO */}
                    <div className="flex items-start gap-3">
                        <CreditCard className="text-zinc-400 mt-1 shrink-0" size={20} />
                        <div>
                            <p className="text-white font-bold text-sm">
                                Até {maxInstallments}x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(installmentValue)}
                            </p>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mt-0.5">
                                Sem Juros no Cartão
                            </p>
                        </div>
                    </div>
                 </div>

                 {/* BOTÃO DE COMPRA */}
                 <button 
                    onClick={() => {
                        addToCart(product);
                        openCart();
                    }}
                    className="w-full mt-8 bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-black uppercase tracking-[0.15em] shadow-[0_0_25px_rgba(220,38,38,0.4)] transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3"
                 >
                    <ShoppingCart size={20} />
                    Adicionar ao Carrinho
                 </button>
             </div>

             {/* INFO BOXES */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#111] border border-white/5 p-4 rounded-xl flex items-center gap-4 group hover:border-white/10 transition-colors">
                    <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center text-red-600 shrink-0 group-hover:scale-110 transition-transform">
                        <Truck size={20} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-xs uppercase tracking-wider">Frete Grátis</h4>
                        <p className="text-zinc-500 text-[10px] mt-0.5 font-medium">
                           Para compras acima de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(freeShippingThreshold)}
                        </p>
                    </div>
                </div>

                <div className="bg-[#111] border border-white/5 p-4 rounded-xl flex items-center gap-4 group hover:border-white/10 transition-colors">
                    <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center text-red-600 shrink-0 group-hover:scale-110 transition-transform">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-xs uppercase tracking-wider">Garantia Total</h4>
                        <p className="text-zinc-500 text-[10px] mt-0.5 font-medium">
                           30 dias para troca ou devolução
                        </p>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}