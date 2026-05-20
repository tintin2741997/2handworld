import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3Icon,
  BoxesIcon,
  ChevronDownIcon,
  FileTextIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LeafIcon,
  LogOutIcon,
  MenuIcon,
  PackageIcon,
  ShoppingBagIcon,
  StarIcon,
  StoreIcon,
  TagIcon,
  UsersIcon,
  XIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type AdminNavItem = {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
};

type AdminNavGroup = {
  name: string;
  items: AdminNavItem[];
};

const navGroups: AdminNavGroup[] = [
  {
    name: 'Tổng quan',
    items: [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
      { name: 'Doanh thu', path: '/admin/doanh-thu', icon: BarChart3Icon }
    ]
  },
  {
    name: 'Hàng hóa',
    items: [
      { name: 'Sản phẩm', path: '/admin/san-pham', icon: PackageIcon },
      { name: 'Danh mục', path: '/admin/danh-muc', icon: TagIcon },
      { name: 'Tồn kho', path: '/admin/ton-kho', icon: BoxesIcon }
    ]
  },
  {
    name: 'Bán hàng',
    items: [
      { name: 'Đơn hàng', path: '/admin/don-hang', icon: ShoppingBagIcon },
      { name: 'Đánh giá', path: '/admin/danh-gia', icon: StarIcon },
      { name: 'Người dùng', path: '/admin/nguoi-dung', icon: UsersIcon }
    ]
  },
  {
    name: 'Nội dung',
    items: [
      { name: 'Cửa hàng', path: '/admin/cua-hang', icon: StoreIcon },
      { name: 'Nội dung', path: '/admin/noi-dung', icon: FileTextIcon }
    ]
  }
];

const isActivePath = (pathname: string, path: string) =>
  pathname === path || (path !== '/admin' && pathname.startsWith(path));

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeItem = navGroups
    .flatMap((group) => group.items)
    .find((item) => isActivePath(location.pathname, item.path));

  const handleLogout = async () => {
    await logout();
    setOpenGroup(null);
    setIsMobileMenuOpen(false);
    navigate('/dang-nhap');
  };

  const closeMenus = () => {
    setOpenGroup(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-white shadow-sm">
        <div className="px-4 md:px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link to="/admin" className="flex min-w-0 items-center gap-2" onClick={closeMenus}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-white">
                <LeafIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="truncate font-serif text-lg font-bold leading-tight text-heading">
                  2HAND WORLD
                </div>
                <div className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Admin
                </div>
              </div>
            </Link>

            <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
              {navGroups.map((group) => {
                const groupActive = group.items.some((item) =>
                  isActivePath(location.pathname, item.path)
                );

                return (
                  <div
                    key={group.name}
                    className="relative"
                    onMouseEnter={() => setOpenGroup(group.name)}
                    onMouseLeave={() => setOpenGroup(null)}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenGroup(openGroup === group.name ? null : group.name)}
                      className={`flex h-10 items-center gap-1 rounded-md px-3 text-sm font-semibold transition-colors ${
                        groupActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-body hover:bg-background hover:text-heading'
                      }`}
                    >
                      {group.name}
                      <ChevronDownIcon
                        className={`h-4 w-4 transition-transform ${
                          openGroup === group.name ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {openGroup === group.name && (
                      <div className="absolute left-0 top-full w-60 pt-2">
                        <div className="rounded-md border border-border bg-white p-2 shadow-lg">
                          {group.items.map((item) => (
                            <NavLink
                              key={item.path}
                              to={item.path}
                              end={item.path === '/admin'}
                              onClick={closeMenus}
                              className={({ isActive }) =>
                                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                                  isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-body hover:bg-background hover:text-heading'
                                }`
                              }
                            >
                              <item.icon className="h-4 w-4 shrink-0" />
                              {item.name}
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <Link
                to="/"
                className="flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold text-body transition-colors hover:bg-background hover:text-heading"
              >
                <HomeIcon className="h-4 w-4" />
                Trang chủ
              </Link>
              <div className="flex items-center gap-2 border-l border-border pl-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="max-w-36">
                  <p className="truncate text-sm font-semibold text-heading">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {user?.email || 'admin@2hand.vn'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex h-10 w-10 items-center justify-center rounded-md text-sale transition-colors hover:bg-sale/10"
                  aria-label="Đăng xuất"
                  title="Đăng xuất"
                >
                  <LogOutIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-heading lg:hidden"
              aria-label="Mở menu quản trị"
            >
              {isMobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>

          <div className="hidden border-t border-border py-2 text-sm text-muted lg:block">
            Đang xem: <span className="font-semibold text-heading">{activeItem?.name || 'Dashboard'}</span>
          </div>

          {isMobileMenuOpen && (
            <nav className="border-t border-border py-3 lg:hidden">
              <div className="space-y-3">
                {navGroups.map((group) => {
                  const groupActive = group.items.some((item) =>
                    isActivePath(location.pathname, item.path)
                  );
                  const isOpen = openGroup === group.name || groupActive;

                  return (
                    <div key={group.name}>
                      <button
                        type="button"
                        onClick={() => setOpenGroup(isOpen ? null : group.name)}
                        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-semibold ${
                          groupActive ? 'bg-primary/10 text-primary' : 'text-heading'
                        }`}
                      >
                        {group.name}
                        <ChevronDownIcon className={`h-4 w-4 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="mt-1 space-y-1 pl-2">
                          {group.items.map((item) => (
                            <NavLink
                              key={item.path}
                              to={item.path}
                              end={item.path === '/admin'}
                              onClick={closeMenus}
                              className={({ isActive }) =>
                                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium ${
                                  isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-body hover:bg-background'
                                }`
                              }
                            >
                              <item.icon className="h-4 w-4" />
                              {item.name}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 border-t border-border pt-3">
                <Link
                  to="/"
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-body"
                >
                  <HomeIcon className="h-4 w-4" />
                  Trang chủ
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sale"
                >
                  <LogOutIcon className="h-4 w-4" />
                  Đăng xuất
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="min-h-[calc(100vh-4rem)] overflow-y-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
