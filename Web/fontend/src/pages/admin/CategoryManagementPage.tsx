import React, { useEffect, useState } from 'react';
import { PlusIcon, EditIcon, TrashIcon, XIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '../../types';
import { api } from '../../services/api';

export function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');

  const loadCategories = () =>
    api.get<Category[]>('/categories').then(setCategories).catch(() => setCategories([]));

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setSelectedCategory(null);
    setCategoryName('');
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) return;
    const payload = { name: categoryName.trim() };
    const next = selectedCategory
      ? await api.put<Category[]>(`/categories/${selectedCategory.id}`, payload)
      : await api.post<Category[]>('/categories', payload);
    setCategories(next);
    setIsModalOpen(false);
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      const next = await api.delete<Category[]>(`/categories/${selectedCategory.id}`);
      setCategories(next);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Không thể xóa danh mục.');
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-heading">
            Quản lý danh mục
          </h1>
          <p className="text-muted mt-1">
            Quản lý các danh mục sản phẩm trên hệ thống
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-warm flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Thêm danh mục
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-warm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 text-muted text-sm border-b border-border">
                <th className="p-4 font-medium w-16 text-center">ID</th>
                <th className="p-4 font-medium">Tên danh mục</th>
                <th className="p-4 font-medium">Slug</th>
                <th className="p-4 font-medium text-center">Số sản phẩm</th>
                <th className="p-4 font-medium text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-background/30 transition-colors">
                  <td className="p-4 text-center text-muted">{cat.id}</td>
                  <td className="p-4 font-medium text-heading flex items-center">
                    <div className="w-8 h-8 rounded bg-background flex items-center justify-center mr-3 text-primary">
                      {cat.name.charAt(0)}
                    </div>
                    {cat.name}
                  </td>
                  <td className="p-4 text-sm text-muted">{cat.slug}</td>
                  <td className="p-4 text-center">
                    <span className="inline-block px-2 py-1 bg-background rounded text-xs font-medium">
                      {cat.productCount}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Sửa">
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Xóa">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
              className="bg-white rounded-xl shadow-warm-lg w-full max-w-md overflow-hidden flex flex-col">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="font-serif text-xl font-bold text-heading">
                  {selectedCategory ? 'Sửa danh mục' : 'Thêm danh mục'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-muted hover:text-heading">
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">
                    Tên danh mục *
                  </label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="VD: Áo thun"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={categoryName.toLowerCase().trim().replace(/\s+/g, '-')}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-muted outline-none"
                    readOnly
                  />
                  <p className="text-xs text-muted mt-1">
                    Tự động tạo từ tên danh mục
                  </p>
                </div>
              </div>
              <div className="p-6 border-t border-border flex justify-end space-x-3 bg-background/50">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-border rounded-lg font-medium text-heading hover:bg-white transition-colors">
                  Hủy
                </button>
                <button
                  onClick={handleSaveCategory}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-warm">
                  Lưu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && selectedCategory && (
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
                Xác nhận xóa
              </h3>
              <p className="text-body mb-6">
                Bạn có chắc chắn muốn xóa danh mục {selectedCategory.name}?
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-6 py-2 border border-border rounded-lg font-medium text-heading hover:bg-background transition-colors">
                  Hủy
                </button>
                <button
                  onClick={handleDeleteCategory}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                  Xóa danh mục
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
