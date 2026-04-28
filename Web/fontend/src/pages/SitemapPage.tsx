import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, MapIcon } from 'lucide-react';
import { Category } from '../types';
import { api } from '../services/api';
import { PageBreadcrumb } from '../components/layout/PageBreadcrumb';
export function SitemapPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    api.get<Category[]>('/categories').then(setCategories).catch(() => setCategories([]));
  }, []);
  return (
    <main className="min-h-screen pt-56 md:pt-60 pb-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        <PageBreadcrumb items={[{ label: 'Sơ đồ trang web' }]} />
        <div className="text-center mb-12">
          <div className="inline-flex bg-primary/10 text-primary p-3 rounded-xl mb-4">
            <MapIcon className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-heading mb-4">
            Sơ đồ trang web
          </h1>
          <p className="text-lg text-muted">
            Tổng hợp tất cả các liên kết trên hệ thống 2HAND
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-warm border border-border p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Main Pages */}
            <div>
              <h2 className="font-serif text-xl font-bold text-heading mb-6 pb-2 border-b border-border">
                Trang chính
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className="flex items-center text-body hover:text-primary transition-colors">
                    
                    <ChevronRightIcon className="w-4 h-4 mr-2 text-muted" />{' '}
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/san-pham"
                    className="flex items-center text-body hover:text-primary transition-colors">
                    
                    <ChevronRightIcon className="w-4 h-4 mr-2 text-muted" /> Tất
                    cả sản phẩm
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cua-hang"
                    className="flex items-center text-body hover:text-primary transition-colors">
                    
                    <ChevronRightIcon className="w-4 h-4 mr-2 text-muted" /> Hệ
                    thống cửa hàng
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tin-tuc"
                    className="flex items-center text-body hover:text-primary transition-colors">
                    
                    <ChevronRightIcon className="w-4 h-4 mr-2 text-muted" /> Tin
                    tức & Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h2 className="font-serif text-xl font-bold text-heading mb-6 pb-2 border-b border-border">
                Danh mục sản phẩm
              </h2>
              <ul className="space-y-3">
                {categories.map((cat) =>
                <li key={cat.id}>
                    <Link
                    to={`/san-pham?category=${cat.slug}`}
                    className="flex items-center text-body hover:text-primary transition-colors">
                    
                      <ChevronRightIcon className="w-4 h-4 mr-2 text-muted" />{' '}
                      {cat.name}
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Account & Support */}
            <div>
              <h2 className="font-serif text-xl font-bold text-heading mb-6 pb-2 border-b border-border">
                Tài khoản & Hỗ trợ
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/dang-nhap"
                    className="flex items-center text-body hover:text-primary transition-colors">
                    
                    <ChevronRightIcon className="w-4 h-4 mr-2 text-muted" />{' '}
                    Đăng nhập / Đăng ký
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ho-so"
                    className="flex items-center text-body hover:text-primary transition-colors">
                    
                    <ChevronRightIcon className="w-4 h-4 mr-2 text-muted" /> Hồ
                    sơ cá nhân
                  </Link>
                </li>
                <li>
                  <Link
                    to="/don-hang"
                    className="flex items-center text-body hover:text-primary transition-colors">
                    
                    <ChevronRightIcon className="w-4 h-4 mr-2 text-muted" /> Đơn
                    hàng của tôi
                  </Link>
                </li>
                <li>
                  <Link
                    to="/gioi-thieu"
                    className="flex items-center text-body hover:text-primary transition-colors">
                    
                    <ChevronRightIcon className="w-4 h-4 mr-2 text-muted" />{' '}
                    Giới thiệu
                  </Link>
                </li>
                <li>
                  <Link
                    to="/chinh-sach"
                    className="flex items-center text-body hover:text-primary transition-colors">
                    
                    <ChevronRightIcon className="w-4 h-4 mr-2 text-muted" />{' '}
                    Chính sách đổi trả
                  </Link>
                </li>
                <li>
                  <Link
                    to="/lien-he"
                    className="flex items-center text-body hover:text-primary transition-colors">
                    
                    <ChevronRightIcon className="w-4 h-4 mr-2 text-muted" />{' '}
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>);

}
