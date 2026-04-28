import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRightIcon, SlidersHorizontalIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrder } from '../contexts/OrderContext';
import { ProductCard } from '../components/products/ProductCard';
import { ProductFilters } from '../components/products/ProductFilters';
import { formatPrice } from '../utils/formatters';

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export function ProductListPage() {
  const { products } = useOrder();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const categoryQueries = searchParams.getAll('category');
  const conditionQueries = searchParams.getAll('condition');
  const storeQueries = searchParams.getAll('store');
  const minPrice = Number(searchParams.get('minPrice') || 0);
  const maxPrice = Number(searchParams.get('maxPrice') || 0);
  const saleOnly = searchParams.get('sale') === '1';
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const removeFilterValue = (key: string, value?: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === undefined) {
      next.delete(key);
    } else {
      const remaining = next.getAll(key).filter((item) => item !== value);
      next.delete(key);
      remaining.forEach((item) => next.append(key, item));
    }
    setSearchParams(next);
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    if (searchQuery) {
      next.set('q', searchQuery);
    }
    setSearchParams(next);
  };

  const removePriceFilter = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('minPrice');
    next.delete('maxPrice');
    setSearchParams(next);
  };

  let filteredProducts = products;

  if (searchQuery) {
    const keyword = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(keyword) ||
        p.description.toLowerCase().includes(keyword)
    );
  }

  if (categoryQueries.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      categoryQueries.some(
        (category) =>
          p.category === category ||
          slugify(p.categoryName || '') === category ||
          slugify(p.categoryName || '') === slugify(category)
      )
    );
  }

  if (conditionQueries.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      conditionQueries.includes(p.condition)
    );
  }

  if (storeQueries.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      storeQueries.includes(p.store)
    );
  }

  if (minPrice > 0) {
    filteredProducts = filteredProducts.filter((p) => p.price >= minPrice);
  }

  if (maxPrice > 0) {
    filteredProducts = filteredProducts.filter((p) => p.price <= maxPrice);
  }

  if (saleOnly) {
    filteredProducts = filteredProducts.filter((p) => p.isSale);
  }

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const itemsPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));
  const requestedPage = Number(searchParams.get('page') || 1);
  const currentPage = Math.min(Math.max(1, requestedPage || 1), totalPages);
  const pageProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (page: number) => {
    const next = new URLSearchParams(searchParams);
    if (page <= 1) {
      next.delete('page');
    } else {
      next.set('page', String(page));
    }
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters =
    categoryQueries.length > 0 ||
    conditionQueries.length > 0 ||
    storeQueries.length > 0 ||
    minPrice > 0 ||
    maxPrice > 0 ||
    saleOnly;

  return (
    <main className="min-h-screen pt-56 md:pt-60 pb-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <nav className="flex items-center text-sm text-muted mb-8">
          <Link to="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <ChevronRightIcon className="w-4 h-4 mx-2" />
          <span className="text-heading font-medium">Sản phẩm</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-border">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-heading mb-2">
              {searchQuery ?
              `Kết quả tìm kiếm cho "${searchQuery}"` :
              'Tất cả sản phẩm'}
            </h1>
            <p className="text-muted">
              Hiển thị <span className="font-semibold text-heading">{sortedProducts.length}</span> kết quả
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button
              type="button"
              className="md:hidden flex items-center space-x-2 border border-border px-4 py-2 rounded-lg text-heading font-medium"
              onClick={() => setIsMobileFiltersOpen(true)}>
              <SlidersHorizontalIcon className="w-4 h-4" />
              <span>Lọc</span>
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted hidden md:inline">
                Sắp xếp:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-border rounded-lg px-4 py-2 text-heading focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white cursor-pointer">
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-1/4 flex-shrink-0">
            <div className="sticky top-24">
              <ProductFilters />
            </div>
          </aside>

          <AnimatePresence>
            {isMobileFiltersOpen &&
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 lg:hidden flex justify-end">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="w-4/5 max-w-sm bg-background h-full overflow-y-auto p-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-serif text-xl font-bold text-heading">
                    Bộ lọc
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="text-muted hover:text-heading p-2">
                    Đóng
                  </button>
                </div>
                <ProductFilters />
              </motion.div>
            </motion.div>
            }
          </AnimatePresence>

          <div className="w-full lg:w-3/4">
            {hasActiveFilters &&
            <div className="flex flex-wrap gap-2 mb-6">
              {categoryQueries.map((category) =>
              <span key={`category-${category}`} className="inline-flex items-center bg-white border border-border px-3 py-1 rounded-full text-sm text-body">
                  Danh mục: {category}
                  <button
                    type="button"
                    onClick={() => removeFilterValue('category', category)}
                    className="ml-2 text-muted hover:text-sale">
                    &times;
                  </button>
                </span>
              )}
              {conditionQueries.map((condition) =>
              <span key={`condition-${condition}`} className="inline-flex items-center bg-white border border-border px-3 py-1 rounded-full text-sm text-body">
                  Tình trạng: {condition}
                  <button
                    type="button"
                    onClick={() => removeFilterValue('condition', condition)}
                    className="ml-2 text-muted hover:text-sale">
                    &times;
                  </button>
                </span>
              )}
              {storeQueries.map((store) =>
              <span key={`store-${store}`} className="inline-flex items-center bg-white border border-border px-3 py-1 rounded-full text-sm text-body">
                  Cửa hàng: {store}
                  <button
                    type="button"
                    onClick={() => removeFilterValue('store', store)}
                    className="ml-2 text-muted hover:text-sale">
                    &times;
                  </button>
                </span>
              )}
              {(minPrice > 0 || maxPrice > 0) &&
              <span className="inline-flex items-center bg-white border border-border px-3 py-1 rounded-full text-sm text-body">
                  Giá: {minPrice > 0 ? formatPrice(minPrice) : '0đ'} - {maxPrice > 0 ? formatPrice(maxPrice) : 'không giới hạn'}
                  <button
                    type="button"
                    onClick={removePriceFilter}
                    className="ml-2 text-muted hover:text-sale">
                    &times;
                  </button>
                </span>
              }
              {saleOnly &&
              <span className="inline-flex items-center bg-white border border-border px-3 py-1 rounded-full text-sm text-body">
                  Đang giảm giá
                  <button
                    type="button"
                    onClick={() => removeFilterValue('sale')}
                    className="ml-2 text-muted hover:text-sale">
                    &times;
                  </button>
                </span>
              }
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-primary hover:underline ml-2">
                Xóa tất cả
              </button>
            </div>
            }

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageProducts.length > 0 ?
              pageProducts.map((product, index) =>
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}>
                <ProductCard product={product} />
              </motion.div>
              ) :
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-muted">
                  Không tìm thấy sản phẩm nào phù hợp.
                </p>
              </div>
              }
            </div>

            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2">
                {totalPages > 1 &&
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => changePage(currentPage - 1)}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronRightIcon className="w-5 h-5 rotate-180" />
                </button>
                }
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) =>
                <button
                  key={page}
                  type="button"
                  onClick={() => changePage(page)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-primary text-white shadow-md'
                      : 'border border-border text-heading hover:text-primary hover:border-primary'
                  }`}>
                    {page}
                  </button>
                )}
                {totalPages > 1 &&
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => changePage(currentPage + 1)}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
                }
              </nav>
            </div>
          </div>
        </div>
      </div>
    </main>);
}
