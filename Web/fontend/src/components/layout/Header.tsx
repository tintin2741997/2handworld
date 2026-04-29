import React, { useEffect, useState, Component } from 'react';
import logo2HandWorld from '../../assets/logo-2handworld.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCartIcon,
  SearchIcon,
  MenuIcon,
  XIcon,
  PhoneIcon,
  MailIcon,
  LeafIcon,
  UserIcon,
  LogOutIcon,
  SettingsIcon,
  PackageIcon } from
'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { itemCount } = useCart();
  const { isLoggedIn, user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/san-pham?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };
  const navLinks = [
  {
    name: 'Trang chủ',
    path: '/'
  },
  {
    name: 'Sản phẩm',
    path: '/san-pham'
  },
  {
    name: 'Cửa hàng',
    path: '/cua-hang'
  },
  {
    name: 'Tin tức',
    path: '/tin-tuc'
  },
  {
    name: 'Giới thiệu',
    path: '/gioi-thieu'
  },
  {
    name: 'Liên hệ',
    path: '/lien-he'
  }];

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-warm py-2' : 'bg-background py-3'}`}>
      
      {/* Top Bar - Hidden on mobile */}
      {!isScrolled &&
      <div className="hidden md:flex justify-between items-center max-w-7xl mx-auto px-4 lg:px-8 pb-3 border-b border-border mb-3 text-sm text-muted">
          <div className="flex items-center space-x-6">
            <span className="flex items-center">
              <PhoneIcon className="w-4 h-4 mr-2" /> 090 123 4567
            </span>
            <span className="flex items-center">
              <MailIcon className="w-4 h-4 mr-2" /> hello@2handstore.vn
            </span>
          </div>
          <div>Thời trang bền vững - Giao hàng toàn quốc</div>
        </div>
      }

      <div className="max-w-[1440px] mx-auto px-4 xl:px-8">
        <div className="flex items-center gap-4 lg:gap-5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0 mr-2 lg:mr-4">
            <img src={logo2HandWorld} alt="2HANDWORLD Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
            <span className="font-serif text-lg lg:text-xl font-bold text-heading tracking-tight whitespace-nowrap">
              2HAND WORLD
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-4 lg:gap-5 xl:gap-6 min-w-0">
            {navLinks.map((link) =>
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm lg:text-base font-medium whitespace-nowrap transition-colors hover:text-primary ${location.pathname === link.path ? 'text-primary' : 'text-body'}`}>
              
                {link.name}
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex items-center relative">
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm sản phẩm"
                className="pl-10 pr-4 py-2 rounded-full border border-border bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-40 xl:w-52 2xl:w-56 transition-all" />
              
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2">
                
                <SearchIcon className="w-5 h-5 text-muted hover:text-primary transition-colors" />
              </button>
            </form>

            <button className="lg:hidden text-heading hover:text-primary transition-colors">
              <SearchIcon className="w-6 h-6" />
            </button>

            {/* User Menu */}
            <div className="relative">
              {!isLoggedIn ?
              <Link
                to="/dang-nhap"
                className="text-heading hover:text-primary transition-colors flex items-center">
                
                  <UserIcon className="w-6 h-6" />
                  <span className="hidden md:inline ml-2 text-sm font-medium">
                    Đăng nhập
                  </span>
                </Link> :

              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-heading hover:text-primary transition-colors">
                
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold font-serif">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden 2xl:inline text-sm font-medium truncate max-w-[90px]">
                    {user?.name}
                  </span>
                </button>
              }

              {/* User Dropdown */}
              <AnimatePresence>
                {isUserMenuOpen && isLoggedIn &&
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  exit={{
                    opacity: 0,
                    y: 10
                  }}
                  className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-warm-lg border border-border py-2 z-50">
                  
                    {isAdmin ?
                  <Link
                    to="/admin"
                    className="flex items-center px-4 py-2 text-sm text-body hover:bg-background hover:text-primary">
                    
                        <SettingsIcon className="w-4 h-4 mr-3" /> Quản trị Admin
                      </Link> :

                  <>
                        <Link
                      to="/ho-so"
                      className="flex items-center px-4 py-2 text-sm text-body hover:bg-background hover:text-primary">
                      
                          <UserIcon className="w-4 h-4 mr-3" /> Hồ sơ cá nhân
                        </Link>
                        <Link
                      to="/don-hang"
                      className="flex items-center px-4 py-2 text-sm text-body hover:bg-background hover:text-primary">
                      
                          <PackageIcon className="w-4 h-4 mr-3" /> Đơn hàng của
                          tôi
                        </Link>
                      </>
                  }
                    <div className="border-t border-border my-1"></div>
                    <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-sale hover:bg-background">
                    
                      <LogOutIcon className="w-4 h-4 mr-3" /> Đăng xuất
                    </button>
                  </motion.div>
                }
              </AnimatePresence>
            </div>

            <Link
              to="/gio-hang"
              className="relative text-heading hover:text-primary transition-colors group">
              
              <ShoppingCartIcon className="w-6 h-6" />
              {itemCount > 0 &&
              <span className="absolute -top-2 -right-2 bg-sale text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  {itemCount}
                </span>
              }
            </Link>

            <button
              className="md:hidden text-heading hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              
              {isMobileMenuOpen ?
              <XIcon className="w-6 h-6" /> :

              <MenuIcon className="w-6 h-6" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen &&
        <motion.div
          initial={{
            opacity: 0,
            height: 0
          }}
          animate={{
            opacity: 1,
            height: 'auto'
          }}
          exit={{
            opacity: 0,
            height: 0
          }}
          className="md:hidden bg-white border-t border-border overflow-hidden">
          
            <div className="px-4 py-6 space-y-4">
              <form onSubmit={handleSearch} className="relative mb-6">
                <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              
                <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2">
                
                  <SearchIcon className="w-5 h-5 text-muted" />
                </button>
              </form>
              {navLinks.map((link) =>
            <Link
              key={link.name}
              to={link.path}
              className="block text-lg font-medium text-heading hover:text-primary">
              
                  {link.name}
                </Link>
            )}
              {!isLoggedIn &&
            <Link
              to="/dang-nhap"
              className="block text-lg font-medium text-primary pt-4 border-t border-border">
              
                  Đăng nhập / Đăng ký
                </Link>
            }
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}
