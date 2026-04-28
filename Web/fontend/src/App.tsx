import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { OrderProvider } from './contexts/OrderContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/layout/ScrollToTop';
// Pages
import { HomePage } from './pages/HomePage';
import { ProductListPage } from './pages/ProductListPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginRegisterPage } from './pages/auth/LoginRegisterPage';
import { ProfilePage } from './pages/account/ProfilePage';
import { MyOrdersPage } from './pages/account/MyOrdersPage';
import { StoresPage } from './pages/StoresPage';
import { NewsPage } from './pages/NewsPage';
import { ContentPage } from './pages/ContentPage';
import { SitemapPage } from './pages/SitemapPage';
// Admin Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ProductManagementPage } from './pages/admin/ProductManagementPage';
import { CategoryManagementPage } from './pages/admin/CategoryManagementPage';
import { StoreManagementPage } from './pages/admin/StoreManagementPage';
import { ContentManagementPage } from './pages/admin/ContentManagementPage';
import { OrderManagementPage } from './pages/admin/OrderManagementPage';
import { RevenueReportPage } from './pages/admin/RevenueReportPage';
import { ReviewManagementPage } from './pages/admin/ReviewManagementPage';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { InventoryManagementPage } from './pages/admin/InventoryManagementPage';
// Layout wrapper for buyer pages
const BuyerLayout = ({ children }: {children: React.ReactNode;}) =>
<div className="flex flex-col min-h-screen">
    <Header />
    <div className="flex-grow">{children}</div>
    <Footer />
  </div>;

export function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Buyer Routes */}
              <Route
                path="/"
                element={
                <BuyerLayout>
                    <HomePage />
                  </BuyerLayout>
                } />
              
              <Route
                path="/san-pham"
                element={
                <BuyerLayout>
                    <ProductListPage />
                  </BuyerLayout>
                } />
              
              <Route
                path="/san-pham/:id"
                element={
                <BuyerLayout>
                    <ProductDetailPage />
                  </BuyerLayout>
                } />
              
              <Route
                path="/gio-hang"
                element={
                <BuyerLayout>
                    <CartPage />
                  </BuyerLayout>
                } />
              
              <Route
                path="/thanh-toan"
                element={
                <BuyerLayout>
                    <CheckoutPage />
                  </BuyerLayout>
                } />
              
              {/* Auth & Account Routes */}
              <Route
                path="/dang-nhap"
                element={
                <BuyerLayout>
                    <LoginRegisterPage />
                  </BuyerLayout>
                } />
              
              <Route
                path="/ho-so"
                element={
                <BuyerLayout>
                    <ProfilePage />
                  </BuyerLayout>
                } />
              
              <Route
                path="/don-hang"
                element={
                <BuyerLayout>
                    <MyOrdersPage />
                  </BuyerLayout>
                } />
              
              {/* Content Routes */}
              <Route
                path="/cua-hang"
                element={
                <BuyerLayout>
                    <StoresPage />
                  </BuyerLayout>
                } />
              
              <Route
                path="/tin-tuc"
                element={
                <BuyerLayout>
                    <NewsPage />
                  </BuyerLayout>
                } />
              
              <Route
                path="/tin-tuc/:slug"
                element={
                <BuyerLayout>
                    <NewsPage />
                  </BuyerLayout>
                } />
              {' '}
              {/* Simplified for demo */}
              <Route
                path="/gioi-thieu"
                element={
                <BuyerLayout>
                    <ContentPage />
                  </BuyerLayout>
                } />
              
              <Route
                path="/chinh-sach"
                element={
                <BuyerLayout>
                    <ContentPage />
                  </BuyerLayout>
                } />
              
              <Route
                path="/lien-he"
                element={
                <BuyerLayout>
                    <ContentPage />
                  </BuyerLayout>
                } />
              
              <Route
                path="/sitemap"
                element={
                <BuyerLayout>
                    <SitemapPage />
                  </BuyerLayout>
                } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="san-pham" element={<ProductManagementPage />} />
                <Route path="danh-muc" element={<CategoryManagementPage />} />
                <Route path="cua-hang" element={<StoreManagementPage />} />
                <Route path="noi-dung" element={<ContentManagementPage />} />
                <Route path="don-hang" element={<OrderManagementPage />} />
                <Route path="doanh-thu" element={<RevenueReportPage />} />
                <Route path="danh-gia" element={<ReviewManagementPage />} />
                <Route path="nguoi-dung" element={<UserManagementPage />} />
                <Route path="ton-kho" element={<InventoryManagementPage />} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </OrderProvider>
    </AuthProvider>);

}
