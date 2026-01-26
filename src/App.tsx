import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Contextos
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';

// Páginas
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import OfferPage from './pages/OfferPage'; // <--- IMPORTANTE: Importe a nova página

// Componentes UI
import CartSidebar from './components/CartSidebar';
import Navbar from './components/Navbar';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Navbar />
          <CartSidebar />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produto/:id" element={<ProductPage />} />
            <Route path="/categoria/:slug" element={<CategoryPage />} />
            
            {/* ROTA DE OFERTAS ADICIONADA AQUI */}
            <Route path="/ofertas" element={<OfferPage />} />
            
          </Routes>
        </Router>
      </CartProvider>
    </StoreProvider>
  );
}

export default App;