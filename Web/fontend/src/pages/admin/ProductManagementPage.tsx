import React, { useEffect, useState } from 'react';
import { PlusIcon, SearchIcon, EditIcon, TrashIcon, XIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category, Product } from '../../types';
import { useOrder } from '../../contexts/OrderContext';
import { formatPrice } from '../../utils/formatters';
import { api } from '../../services/api';

type ProductForm = {
  name: string;
  categoryId: string;
  price: string;
  importPrice: string;
  condition: string;
  stock: string;
  lowStockThreshold: string;
  discountPercent: string;
  image: string;
  description: string;
  status: string;
};

const emptyForm: ProductForm = {
  name: '',
  categoryId: '',
  price: '',
  importPrice: '',
  condition: 'Như mới',
  stock: '1',
  lowStockThreshold: '3',
  discountPercent: '0',
  image: '',
  description: '',
  status: 'active'
};

export function ProductManagementPage() {
  const { products, refreshData } = useOrder();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  useEffect(() => {
    api.get<Category[]>('/categories').then(setCategories).catch(() => setCategories([]));
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.includes(searchTerm)) &&
      (selectedCategory ? p.category === selectedCategory : true)
  );

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm({
      ...emptyForm,
      categoryId: categories[0]?.id || ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      categoryId: product.category,
      price: String(product.price),
      importPrice: String(Math.max(1, Math.round(product.price * 0.6))),
      condition: product.condition,
      stock: String(product.stock),
      lowStockThreshold: '3',
      discountPercent: String(product.salePercent || 0),
      image: product.images[0] || '',
      description: product.description,
      status: product.status || 'active'
    });
    setIsModalOpen(true);
  };

  const updateForm = (key: keyof ProductForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const payload = () => ({
    name: form.name,
    categoryId: form.categoryId,
    price: Number(form.price),
    importPrice: Number(form.importPrice || form.price),
    condition: form.condition,
    stock: Number(form.stock || 0),
    lowStockThreshold: Number(form.lowStockThreshold || 3),
    discountPercent: Number(form.discountPercent || 0),
    image: form.image,
    description: form.description,
    status: form.status
  });

  const handleSave = async () => {
    if (!form.name || !form.categoryId || !form.price) {
      alert('Vui lòng nhập tên, danh mục và giá bán.');
      return;
    }
    if (editingProduct) {
      await api.patch(`/products/${editingProduct.id}`, payload());
    } else {
      await api.post('/products', payload());
    }
    await refreshData();
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    await api.delete(`/products/${deletingProduct.id}`);
    await refreshData();
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-heading">
            Quản lý sản phẩm
          </h1>
          <p className="text-muted mt-1">
            Thêm, sửa, ẩn và quản lý danh sách sản phẩm
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-warm flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-border shadow-warm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mã SP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="md:w-64 px-3 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white">
          <option value="">Tất cả danh mục</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-warm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-background/50 text-muted text-sm border-b border-border">
                <th className="p-4 font-medium w-16">Ảnh</th>
                <th className="p-4 font-medium">Tên sản phẩm</th>
                <th className="p-4 font-medium">Danh mục</th>
                <th className="p-4 font-medium text-right">Giá bán</th>
                <th className="p-4 font-medium text-center">Tồn kho</th>
                <th className="p-4 font-medium text-center">Trạng thái</th>
                <th className="p-4 font-medium text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => {
                const category = categories.find((c) => c.id === product.category);
                return (
                  <tr key={product.id} className="hover:bg-background/30 transition-colors">
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
                      <div className="font-medium text-heading line-clamp-2">
                        {product.name}
                      </div>
                      <div className="text-xs text-muted mt-1">
                        Mã: {product.id} | {product.condition}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-body">{category?.name}</td>
                    <td className="p-4 font-medium text-primary text-right">
                      {formatPrice(product.price)}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          product.stock === 0
                            ? 'bg-red-100 text-red-800'
                            : product.stock <= 3
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-1 bg-background rounded text-xs">
                        {product.status || 'active'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Sửa">
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingProduct(product);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Ẩn">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-warm-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="font-serif text-xl font-bold text-heading">
                  {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-muted hover:text-heading">
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-heading mb-2">
                      Tên sản phẩm *
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-2">
                      Danh mục *
                    </label>
                    <select
                      value={form.categoryId}
                      onChange={(e) => updateForm('categoryId', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white">
                      <option value="">Chọn danh mục</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-2">
                      Tình trạng
                    </label>
                    <input
                      value={form.condition}
                      onChange={(e) => updateForm('condition', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-2">
                      Giá bán
                    </label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => updateForm('price', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-2">
                      Giá nhập
                    </label>
                    <input
                      type="number"
                      value={form.importPrice}
                      onChange={(e) => updateForm('importPrice', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-2">
                      Tồn kho
                    </label>
                    <input
                      type="number"
                      value={form.stock}
                      disabled={!!editingProduct}
                      onChange={(e) => updateForm('stock', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none disabled:bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-2">
                      Giảm giá %
                    </label>
                    <input
                      type="number"
                      value={form.discountPercent}
                      onChange={(e) => updateForm('discountPercent', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-heading mb-2">
                      Link ảnh
                    </label>
                    <input
                      value={form.image}
                      onChange={(e) => updateForm('image', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-heading mb-2">
                      Mô tả
                    </label>
                    <textarea
                      rows={4}
                      value={form.description}
                      onChange={(e) => updateForm('description', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-border flex justify-end space-x-3 bg-background/50">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-border rounded-lg font-medium text-heading hover:bg-white transition-colors">
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-warm">
                  Lưu sản phẩm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && deletingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-warm-lg w-full max-w-md p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrashIcon className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-heading mb-2">
                Ẩn sản phẩm
              </h3>
              <p className="text-body mb-6">
                Sản phẩm sẽ chuyển sang trạng thái hidden và không hiển thị cho buyer.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-6 py-2 border border-border rounded-lg font-medium text-heading hover:bg-background transition-colors">
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                  Ẩn sản phẩm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
