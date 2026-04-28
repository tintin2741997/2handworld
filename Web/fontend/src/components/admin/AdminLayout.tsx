import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  PackageIcon,
  TagIcon,
  StoreIcon,
  FileTextIcon,
  ShoppingBagIcon,
  BarChart3Icon,
  StarIcon,
  UsersIcon,
  BoxesIcon,
  LeafIcon,
  LogOutIcon,
  HomeIcon,
  MenuIcon,
  XIcon } from
'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
export function AdminLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: LayoutDashboardIcon
  },
  {
    name: 'Sản phẩm',
    path: '/admin/san-pham',
    icon: PackageIcon
  },
  {
    name: 'Danh mục',
    path: '/admin/danh-muc',
    icon: TagIcon
  },
  {
    name: 'Cửa hàng',
    path: '/admin/cua-hang',
    icon: StoreIcon
  },
  {
    name: 'Nội dung',
    path: '/admin/noi-dung',
    icon: FileTextIcon
  },
  {
    name: 'Đơn hàng',
    path: '/admin/don-hang',
    icon: ShoppingBagIcon
  },
  {
    name: 'Doanh thu',
    path: '/admin/doanh-thu',
    icon: BarChart3Icon
  },
  {
    name: 'Đánh giá',
    path: '/admin/danh-gia',
    icon: StarIcon
  },
  {
    name: 'Người dùng',
    path: '/admin/nguoi-dung',
    icon: UsersIcon
  },
  {
    name: 'Tồn kho',
    path: '/admin/ton-kho',
    icon: BoxesIcon
  }];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen &&
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={() => setIsMobileMenuOpen(false)} />

      }

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#2D1810] text-[#E8DDD0] flex flex-col transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div className="p-6 flex items-center justify-between">
          <Link to="/admin" className="flex items-center space-x-2 group">
            <div className="bg-primary text-white p-1.5 rounded-lg">
              <LeafIcon className="w-6 h-6" />
            </div>
            <span className="font-serif text-2xl font-bold text-white tracking-tight">
              2HAND<span className="text-primary">.</span>
            </span>
            <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold rounded uppercase tracking-wider">
              Admin
            </span>
          </Link>
          <button
            className="lg:hidden text-[#E8DDD0] hover:text-white"
            onClick={toggleMobileMenu}>
            
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto hide-scrollbar py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive =
              location.pathname === item.path ||
              item.path !== '/admin' &&
              location.pathname.startsWith(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-primary/20 text-primary border-l-4 border-primary' : 'text-[#8B7355] hover:text-white hover:bg-white/5 border-l-4 border-transparent'}`}>
                    
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>);

            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center mb-4 px-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-3">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-[#8B7355] truncate">
                {user?.email || 'admin@2hand.vn'}
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <Link
              to="/"
              className="flex items-center px-3 py-2 text-sm text-[#8B7355] hover:text-white transition-colors rounded-lg hover:bg-white/5">
              
              <HomeIcon className="w-4 h-4 mr-3" />
              Về trang chủ
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center px-3 py-2 text-sm text-sale hover:text-red-400 transition-colors rounded-lg hover:bg-white/5">
              
              <LogOutIcon className="w-4 h-4 mr-3" />
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary text-white p-1 rounded-md">
              <LeafIcon className="w-5 h-5" />
            </div>
            <span className="font-serif text-xl font-bold text-heading">
              Admin
            </span>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="text-heading hover:text-primary">
            
            <MenuIcon className="w-6 h-6" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background">
          <Outlet />
        </main>
      </div>
    </div>);

}
