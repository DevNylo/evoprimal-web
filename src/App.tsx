import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Contextos
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; // IMPORTADO

// Páginas
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import OfferPage from './pages/OfferPage';
import LoginPage from './pages/LoginPage';     // IMPORTADO
import AccountPage from './pages/AccountPage'; // IMPORTADO

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
    <AuthProvider> {/* ENVOLVENDO TUDO COM AUTH */}
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
              <Route path="/ofertas" element={<OfferPage />} />
              
              {/* NOVAS ROTAS */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/minha-conta" element={<AccountPage />} />
              
            </Routes>
          </Router>
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;