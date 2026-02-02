import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Contextos
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Páginas Principais
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import OfferPage from './pages/OfferPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage'; // <--- NOVO IMPORT

// Páginas de Usuário e Autenticação
import LoginPage from './pages/LoginPage';
import AccountPage from './pages/AccountPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import EmailConfirmationPage from './pages/EmailConfirmationPage';

// Componentes UI
import CartSidebar from './components/CartSidebar';
import Navbar from './components/Navbar';

// Componente para rolar para o topo ao mudar de rota
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <Navbar />
            <CartSidebar />
            
            <Routes>
              {/* Rotas da Loja */}
              <Route path="/" element={<Home />} />
              <Route path="/produto/:id" element={<ProductPage />} />
              <Route path="/categoria/:slug" element={<CategoryPage />} />
              <Route path="/ofertas" element={<OfferPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              
              {/* <--- NOVA ROTA DE CONTATO */}
              <Route path="/contato" element={<ContactPage />} />

              {/* Rotas de Autenticação */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/minha-conta" element={<AccountPage />} />
              <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
              <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
              <Route path="/confirmar-email" element={<EmailConfirmationPage />} />
              
            </Routes>
          </Router>
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;