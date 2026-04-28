import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  TruckIcon,
  RefreshCwIcon,
  ClockIcon } from
'lucide-react';
import { useOrder } from '../contexts/OrderContext';
import { ProductCard } from '../components/products/ProductCard';
import { motion } from 'framer-motion';
import { Category } from '../types';
import { api } from '../services/api';
export function HomePage() {
  const { products } = useOrder();
  const [categories, setCategories] = useState<Category[]>([]);
  const newProducts = products.filter((p) => p.isNew).slice(0, 4);
  const saleProducts = products.filter((p) => p.isSale).slice(0, 4);
  useEffect(() => {
    api.get<Category[]>('/categories').then(setCategories).catch(() => setCategories([]));
  }, []);
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative bg-[#E8DDD0] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/hero/1920/800"
            alt="Vintage clothing rack"
            className="w-full h-full object-cover opacity-40 mix-blend-multiply" />
          
        </div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 py-24 md:py-32 lg:py-40">
          <motion.div
            initial={{
              opacity: 0,
              y: 30
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.8
            }}
            className="max-w-2xl">
            
            <span className="inline-block py-1 px-3 rounded-full bg-white/80 text-primary font-semibold text-sm mb-6 backdrop-blur-sm">
              Khám phá bộ sưu tập mùa Thu
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-heading leading-tight mb-6">
              Thời trang 2HANDWORLD <br />
              <span className="text-primary italic">Phong cách bền vững</span>
            </h1>
            {/* <p className="text-lg md:text-xl text-body mb-10 leading-relaxed max-w-xl">
              Mỗi món đồ đều có một câu chuyện. Khám phá những sản phẩm
              secondhand chất lượng cao, được tuyển chọn kỹ lưỡng với giá cả hợp
              lý.
            </p> */}
            <Link
              to="/san-pham"
              className="inline-flex items-center bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-hover transition-colors shadow-warm-lg hover:shadow-xl hover:-translate-y-1 transform duration-300">
              
              Khám phá ngay
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-12 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-primary mb-4">
                <ShieldCheckIcon className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-semibold text-heading mb-2">
                Chất lượng đảm bảo
              </h3>
              <p className="text-sm text-muted">Tuyển chọn kỹ lưỡng</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-primary mb-4">
                <ClockIcon className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-semibold text-heading mb-2">
                Giá hợp lý
              </h3>
              <p className="text-sm text-muted">Tiết kiệm đến 70%</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-primary mb-4">
                <RefreshCwIcon className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-semibold text-heading mb-2">
                Đổi trả dễ dàng
              </h3>
              <p className="text-sm text-muted">Trong vòng 3 ngày</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-primary mb-4">
                <TruckIcon className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-semibold text-heading mb-2">
                Giao hàng nhanh
              </h3>
              <p className="text-sm text-muted">Toàn quốc từ 2-4 ngày</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-heading mb-4">
            Danh mục nổi bật
          </h2>
          <p className="text-muted">Tìm kiếm theo phong cách của bạn</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((cat, index) =>
          <Link
            key={cat.id}
            to={`/san-pham?category=${cat.slug}`}
            className="group bg-white rounded-2xl p-6 text-center shadow-warm hover:shadow-warm-lg transition-all duration-300 border border-border/50 hover:border-primary/30">
            
              <div className="w-16 h-16 mx-auto bg-background rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white text-primary transition-colors duration-300">
                {/* Fallback icon since we can't dynamically render Lucide icons easily from string names without a map */}
                <div className="text-2xl font-serif">{cat.name.charAt(0)}</div>
              </div>
              <h3 className="font-semibold text-heading group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-muted mt-1">
                {cat.productCount} sản phẩm
              </p>
            </Link>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold text-heading mb-2">
                Sản phẩm mới
              </h2>
              <p className="text-muted">Những món đồ vừa được cập nhật</p>
            </div>
            <Link
              to="/san-pham"
              className="hidden md:flex items-center text-primary font-medium hover:text-primary-hover transition-colors">
              
              Xem tất cả <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {newProducts.map((product) =>
            <ProductCard key={product.id} product={product} />
            )}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link
              to="/san-pham"
              className="inline-flex items-center text-primary font-medium border border-primary px-6 py-2 rounded-full">
              
              Xem tất cả <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Sale Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold text-sale mb-2 flex items-center">
                Đang giảm giá{' '}
                <span className="ml-3 px-2 py-1 bg-sale text-white text-xs rounded uppercase tracking-wider">
                  Hot
                </span>
              </h2>
              <p className="text-muted">
                Cơ hội sở hữu đồ đẹp với giá tốt nhất
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {saleProducts.map((product) =>
            <ProductCard key={product.id} product={product} />
            )}
          </div>
        </div>
      </section>
    </main>);

}
