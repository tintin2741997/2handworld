import React, { useEffect, useState } from 'react';
import {
  BoxesIcon,
  AlertTriangleIcon,
  SearchIcon,
  FilterIcon,
  RefreshCwIcon,
  XIcon } from
'lucide-react';
import { useOrder } from '../../contexts/OrderContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '../../types';
import { api } from '../../services/api';
export function InventoryManagementPage() {
  const { products, updateProductStock } = useOrder();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [addStock, setAddStock] = useState('');
  const [removeStock, setRemoveStock] = useState('');
  const [updateReason, setUpdateReason] = useState('');
  const totalProducts = products.length;
  const lowStockProducts = products.filter(
    (p) => p.stock > 0 && p.stock <= 3
  ).length;
  const outOfStockProducts = products.filter((p) => p.stock === 0).length;
  const filteredProducts = products.filter((p) => {
    if (showLowStockOnly && p.stock > 3) return false;
    if (selectedCategory && p.category !== selectedCategory) return false;
    return true;
  });
  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600 font-bold';
    if (stock <= 3) return 'text-orange-600 font-bold';
    if (stock <= 5) return 'text-yellow-600 font-medium';
    return 'text-green-600 font-medium';
  };
  const openUpdateModal = (product: any) => {
    setSelectedProduct(product);
    setAddStock('');
    setRemoveStock('');
    setUpdateReason('');
    setIsUpdateModalOpen(true);
  };
  useEffect(() => {
    api.get<Category[]>('/categories').then(setCategories).catch(() => setCategories([]));
  }, []);
  const handleUpdateStock = async () => {
    if (!selectedProduct) return;
    let delta = 0;
    if (addStock) delta += parseInt(addStock);
    if (removeStock) delta -= parseInt(removeStock);
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-border shadow-warm flex items-center">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-4">
            <BoxesIcon className="w-7 h-7" />
          </div>
          <div>
            <p className="text-muted font-medium mb-1">Tổng sản phẩm</p>
            <h3 className="text-3xl font-serif font-bold text-heading">
              {totalProducts}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-warm flex items-center">
          <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 mr-4">
            <AlertTriangleIcon className="w-7 h-7" />
          </div>
          <div>
            <p className="text-muted font-medium mb-1">Sắp hết hàng (≤ 3)</p>
            <h3 className="text-3xl font-serif font-bold text-orange-600">
              {lowStockProducts}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-warm flex items-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-600 mr-4">
            <AlertTriangleIcon className="w-7 h-7" />
          </div>
          <div>
            <p className="text-muted font-medium mb-1">Hết hàng</p>
            <h3 className="text-3xl font-serif font-bold text-red-600">
              {outOfStockProducts}
            </h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-border shadow-warm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <FilterIcon className="w-5 h-5 text-muted" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white">
              
              <option value="">Tất cả danh mục</option>
              {categories.map((c) =>
              <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              )}
            </select>
          </div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showLowStockOnly}
              onChange={(e) => setShowLowStockOnly(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary w-4 h-4 mr-2" />
            
            <span className="text-sm font-medium text-heading">
              Chỉ hiện sắp hết hàng
            </span>
          </label>
        </div>
        <div className="relative w-full md:w-64">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
          
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-border shadow-warm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-background/50 text-muted text-sm border-b border-border">
                <th className="p-4 font-medium w-16">Ảnh</th>
                <th className="p-4 font-medium">Tên sản phẩm</th>
                <th className="p-4 font-medium">Danh mục</th>
                <th className="p-4 font-medium text-center">
                  Tồn kho hiện tại
                </th>
                <th className="p-4 font-medium text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => {
                const category = categories.find(
                  (c) => c.id === product.category
                );
                const isLowStock = product.stock <= 3;
                return (
                  <tr
                    key={product.id}
                    className={`transition-colors ${isLowStock ? 'bg-red-50/30 hover:bg-red-50/50' : 'hover:bg-background/30'}`}>
                    
                    <td className="p-4">
                      <div className="w-10 h-10 rounded border border-border overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover" />
                        
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
                      <span
                        className={`text-lg ${getStockColor(product.stock)}`}>
                        
                        {product.stock === 0 ? 'Hết hàng' : product.stock}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => openUpdateModal(product)}
                        className="px-3 py-1.5 bg-background border border-border hover:border-primary hover:text-primary rounded-lg text-sm font-medium transition-colors flex items-center mx-auto">
                        
                        <RefreshCwIcon className="w-4 h-4 mr-1.5" /> Cập nhật
                      </button>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl border border-border shadow-warm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-serif text-lg font-bold text-heading">
            Tồn kho theo danh mục
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-6">
          {categories.map((cat) => {
            const catProducts = products.filter((p) => p.category === cat.id);
            const totalStock = catProducts.reduce((sum, p) => sum + p.stock, 0);
            return (
              <div
                key={cat.id}
                className="bg-background rounded-lg p-4 text-center border border-border">
                
                <div className="text-sm text-muted mb-2">{cat.name}</div>
                <div className="text-2xl font-serif font-bold text-heading">
                  {totalStock}
                </div>
              </div>);

          })}
        </div>
      </div>

      {/* Update Stock Modal */}
      <AnimatePresence>
        {isUpdateModalOpen && selectedProduct &&
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.95
            }}
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
                  alt=""
                  className="w-12 h-12 rounded object-cover" />
                
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
                    onChange={(e) => setAddStock(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="0" />
                  
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
                    onChange={(e) => setRemoveStock(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="0" />
                  
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-heading mb-2">
                    Lý do cập nhật
                  </label>
                  <textarea
                  rows={2}
                  value={updateReason}
                  onChange={(e) => setUpdateReason(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="Nhập hàng mới, hàng lỗi, kiểm kê...">
                </textarea>
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
        }
      </AnimatePresence>
    </div>);

}
