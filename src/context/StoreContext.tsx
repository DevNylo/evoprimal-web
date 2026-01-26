import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// --- URL BASE DO STRAPI (Usando IP para evitar conflitos de localhost) ---
const STRAPI_URL = "http://127.0.0.1:1337";

// --- TIPAGENS ---

// Tipo para os Produtos (Vendáveis)
export interface Product {
  id: number;
  documentId: string;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  category: string;
  brand: string;
  image: string;
  isFeatured: boolean; // Mapeado de 'em_destaque'
}

// Tipo para os Banners (Marketing)
export interface HeroBanner {
  id: number;
  title: string;
  highlight: string; // A parte verde do texto
  sub: string;
  desc: string;
  image: string;
}

// O que o contexto vai entregar para o site
interface StoreContextType {
  products: Product[];
  banners: HeroBanner[];
  loading: boolean;
}

const StoreContext = createContext({} as StoreContextType);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Dispara as duas buscas ao mesmo tempo (Paralelismo = Performance)
        // Usando 127.0.0.1 para estabilidade de conexão
        const [productRes, bannerRes] = await Promise.all([
          fetch(`${STRAPI_URL}/api/produtos?populate=*`), 
          fetch(`${STRAPI_URL}/api/hero-banners?populate=*`)
        ]);

        const productData = await productRes.json();
        const bannerData = await bannerRes.json();

        // 1. TRATAMENTO DOS PRODUTOS
        if (productData.data) {
          const formattedProducts = productData.data.map((item: any) => ({
            id: item.id,
            documentId: item.documentId,
            name: item.nome || "Produto Sem Nome", // Strapi: nome
            price: Number(item.preco) || 0,        // Strapi: preco
            oldPrice: item.preco_antigo ? Number(item.preco_antigo) : null, // Strapi: preco_antigo
            description: item.descricao || "",     // Strapi: descricao
            category: item.categoria || "outros",  // Strapi: categoria
            brand: item.marca || "EVO PRIMAL",     // Strapi: marca
            isFeatured: item.em_destaque || false, // Strapi: em_destaque (Boolean)
            
            // Tratamento da imagem
            image: item.imagem?.url 
              ? `${STRAPI_URL}${item.imagem.url}` 
              : "/placeholder.png"
          }));
          setProducts(formattedProducts);
        }

        // 2. TRATAMENTO DOS BANNERS
        if (bannerData.data) {
          const formattedBanners = bannerData.data.map((item: any) => ({
            id: item.id,
            title: item.titulo || "TÍTULO PADRÃO",
            highlight: item.destaque_verde || "",
            sub: item.subtitulo || "",
            desc: item.descricao || "",
            
            // Tratamento da imagem do banner
            image: item.imagem?.url 
              ? `${STRAPI_URL}${item.imagem.url}` 
              : "/banner-placeholder.png"
          }));
          setBanners(formattedBanners);
        }

      } catch (error) {
        console.error("❌ Erro ao conectar com o Strapi:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <StoreContext.Provider value={{ products, banners, loading }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);