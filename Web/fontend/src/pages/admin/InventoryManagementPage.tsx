import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangleIcon,
  BoxesIcon,
  FilterIcon,
  RefreshCwIcon,
  SearchIcon,
  XIcon
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOrder } from '../../contexts/OrderContext';
import { Category, Product } from '../../types';
import { api } from '../../services/api';

export function InventoryManagementPage() {
  const { products, updateProductStock } = useOrder();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [addStock, setAddStock] = useState('');
  const [removeStock, setRemoveStock] = useState('');
  const [updateReason, setUpdateReason] = useState('');

  useEffect(() => {
    api.get<Category[]>('/categories').then(setCategories).catch(() => setCategories([]));
  }, []);

  const totalProducts = products.length;
  const lowStockProducts = products.filter((product) => product.stock > 0 && product.stock <= 3).length;
  const outOfStockProducts = products.filter((product) => product.stock === 0).length;

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const category = categories.find((item) => item.id === product.category);
      const matchesSearch =
        keyword === '' ||
        product.name.toLowerCase().includes(keyword) ||
        product.id.toLowerCase().includes(keyword) ||
        (category?.name || '').toLowerCase().includes(keyword);

      if (!matchesSearch) return false;
      if (showLowStockOnly && product.stock > 3) return false;
      if (selectedCategory && product.category !== selectedCategory) return false;
      return true;
    });
  }, [categories, products, searchTerm, selectedCategory, showLowStockOnly]);

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600 font-bold';
    if (stock <= 3) return 'text-orange-600 font-bold';
    if (stock <= 5) return 'text-yellow-600 font-medium';
    return 'text-green-600 font-medium';
  };

  const openUpdateModal = (product: Product) => {
    setSelectedProduct(product);
    setAddStock('');
    setRemoveStock('');
    setUpdateReason('');
    setIsUpdateModalOpen(true);
  };

  const handleUpdateStock = async () => {
    if (!selectedProduct) return;
    let delta = 0;
    if (addStock) delta += Number(addStock);
    if (removeStock) delta -= Number(removeStock);
    if (delta !== 0) {
      await updateProductStock(selectedProduct.id, delta, updateReason);
    }
    setIsUpdateModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-heading">
            Quản lý tồn kho
          </h1>
          <p className="text-muted mt-1">
            Theo dõi số lượng sản phẩm và cảnh báo sắp hết hàng
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          icon={<BoxesIcon className="w-7 h-7" />}
          label="Tổng sản phẩm"
          value={totalProducts}
          colorClass="bg-blue-50 text-blue-600"
        />
        <SummaryCard
          icon={<AlertTriangleIcon className="w-7 h-7" />}
          label="Sắp hết hàng (ít hơn 4 sản phẩm)"
          value={lowStockProducts}
          colorClass="bg-orange-50 text-orange-600"
          valueClass="text-orange-600"
        />
        <SummaryCard
          icon={<AlertTriangleIcon className="w-7 h-7" />}
          label="Hết hàng"
          value={outOfStockProducts}
          colorClass="bg-red-50 text-red-600"
          valueClass="text-red-600"
        />
      </div>

      <div className="bg-white p-4 rounded-xl border border-border shadow-warm flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <FilterIcon className="w-5 h-5 text-muted" />
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full sm:w-64 px-3 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white">
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              checked={showLowStockOnly}
              onChange={(event) => setShowLowStockOnly(event.target.checked)}
              className="rounded border-border text-primary focus:ring-primary w-4 h-4 mr-2"
            />
            <span className="text-sm font-medium text-heading">
              Chỉ hiện sắp hết hàng
            </span>
          </label>
        </div>
        <div className="relative w-full sm:w-64 lg:w-72 flex-none">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tìm sản phẩm..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-warm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-background/50 text-muted text-sm border-b border-border">
                <th className="p-4 font-medium w-16">Ảnh</th>
                <th className="p-4 font-medium">Tên sản phẩm</th>
                <th className="p-4 font-medium">Danh mục</th>
                <th className="p-4 font-medium text-center">Tồn kho hiện tại</th>
                <th className="p-4 font-medium text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => {
                const category = categories.find((item) => item.id === product.category);
                const isLowStock = product.stock <= 3;
                return (
                  <tr
                    key={product.id}
                    className={`transition-colors ${
                      isLowStock ? 'bg-red-50/30 hover:bg-red-50/50' : 'hover:bg-background/30'
                    }`}>
                    <td className="p-4">
                      <div className="w-10 h-10 rounded border border-border overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-heading line-clamp-1">
                        {product.name}
                      </div>
                      <div className="text-xs text-muted mt-1">
                        Mã: {product.id}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-body">{category?.name}</td>
                    <td className="p-4 text-center">
                      <span className={`text-lg ${getStockColor(product.stock)}`}>
                        {product.stock === 0 ? 'Hết hàng' : product.stock}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => openUpdateModal(product)}
                        className="px-3 py-1.5 bg-background border border-border hover:border-primary hover:text-primary rounded-lg text-sm font-medium transition-colors flex items-center mx-auto">
                        <RefreshCwIcon className="w-4 h-4 mr-1.5" />
                        Cập nhật
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted">
                    Không tìm thấy sản phẩm phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-warm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-serif text-lg font-bold text-heading">
            Tồn kho theo danh mục
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-6">
          {categories.map((category) => {
            const categoryProducts = products.filter((product) => product.category === category.id);
            const totalStock = categoryProducts.reduce((sum, product) => sum + product.stock, 0);
            return (
              <div
                key={category.id}
                className="bg-background rounded-lg p-4 text-center border border-border">
                <div className="text-sm text-muted mb-2">{category.name}</div>
                <div className="text-2xl font-serif font-bold text-heading">
                  {totalStock}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {isUpdateModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-warm-lg w-full max-w-md overflow-hidden flex flex-col">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="font-serif text-xl font-bold text-heading">
                  Cập nhật tồn kho
                </h2>
                <button
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="text-muted hover:text-heading">
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4 p-4 bg-background rounded-lg border border-border">
                  <img
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <div className="font-medium text-heading text-sm line-clamp-1">
                      {selectedProduct.name}
                    </div>
                    <div className="text-xs text-muted mt-1">
                      Tồn kho hiện tại:{' '}
                      <span className="font-bold text-heading">
                        {selectedProduct.stock}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-heading mb-2">
                      Nhập thêm (+)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={addStock}
                      onChange={(event) => setAddStock(event.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-2">
                      Trừ hàng (-)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={selectedProduct.stock}
                      value={removeStock}
                      onChange={(event) => setRemoveStock(event.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-heading mb-2">
                    Lý do cập nhật
                  </label>
                  <textarea
                    rows={2}
                    value={updateReason}
                    onChange={(event) => setUpdateReason(event.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="Nhập hàng mới, hàng lỗi, kiểm kê..."
                  />
                </div>
              </div>
              <div className="p-6 border-t border-border flex justify-end space-x-3 bg-background/50">
                <button
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-6 py-2 border border-border rounded-lg font-medium text-heading hover:bg-white transition-colors">
                  Hủy
                </button>
                <button
                  onClick={handleUpdateStock}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-warm">
                  Cập nhật
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  colorClass,
  valueClass = 'text-heading'
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  colorClass: string;
  valueClass?: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-border shadow-warm flex items-center">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mr-4 ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-muted font-medium mb-1">{label}</p>
        <h3 className={`text-3xl font-serif font-bold ${valueClass}`}>
          {value}
        </h3>
      </div>
    </div>
  );
}
