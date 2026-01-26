import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// --- CORREÇÃO 1: Usar Variável de Ambiente ---
// Se existir a variável da Vercel (Render), usa ela. Se não, usa localhost.
const STRAPI_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:1337";

// --- TIPAGENS ---
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
  isFeatured: boolean;
}

export interface HeroBanner {
  id: number;
  title: string;
  highlight: string;
  sub: string;
  desc: string;
  image: string;
}

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

  // Helper para corrigir URLs de imagem (Cloudinary vs Local)
  const getImageUrl = (url: string) => {
    if (!url) return "/placeholder.png";
    // CORREÇÃO 2: Se já for um link completo (Cloudinary), não mexe.
    if (url.startsWith("http")) return url;
    // Se for relativo (Upload Local), adiciona a URL da API.
    return `${STRAPI_URL}${url}`;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        console.log("Buscando dados em:", STRAPI_URL); // Debug para você ver no console

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
            name: item.nome || "Produto Sem Nome",
            price: Number(item.preco) || 0,
            oldPrice: item.preco_antigo ? Number(item.preco_antigo) : null,
            description: item.descricao || "",
            category: item.categoria || "outros",
            brand: item.marca || "EVO PRIMAL",
            isFeatured: item.em_destaque || false,
            // Usa o Helper de imagem corrigido
            image: getImageUrl(item.imagem?.url)
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
            // Usa o Helper de imagem corrigido
            image: getImageUrl(item.imagem?.url)
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