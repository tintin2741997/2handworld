import React, { useEffect, useMemo, useState } from 'react';
import { EyeIcon, EyeOffIcon, SearchIcon, StarIcon, TrashIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOrder } from '../../contexts/OrderContext';
import { Review } from '../../types';
import { api } from '../../services/api';

export function ReviewManagementPage() {
  const { products } = useOrder();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const loadReviews = () => {
    api.get<Review[]>('/reviews?admin=1').then(setReviews).catch(() => setReviews([]));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: '5', label: '5 sao' },
    { id: '4', label: '4 sao' },
    { id: '3', label: '3 sao' },
    { id: '2', label: '2 sao' },
    { id: '1', label: '1 sao' }
  ];

  const filteredReviews = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return reviews.filter((review) => {
      const product = products.find((p) => p.id === review.productId);
      const matchesTab = activeTab === 'all' || review.rating.toString() === activeTab;
      const matchesSearch =
        keyword === '' ||
        review.userName.toLowerCase().includes(keyword) ||
        review.comment.toLowerCase().includes(keyword) ||
        product?.name.toLowerCase().includes(keyword);
      return matchesTab && matchesSearch;
    });
  }, [activeTab, products, reviews, searchTerm]);

  const renderStars = (count: number) =>
    Array.from({ length: 5 }).map((_, index) => (
      <StarIcon
        key={index}
        className={`w-4 h-4 ${
          index < count ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));

  const toggleReviewStatus = async (review: Review) => {
    const nextStatus = review.status === 'hidden' ? 'active' : 'hidden';
    await api.patch(`/reviews/${review.id}/status`, { status: nextStatus });
    setReviews((current) =>
      current.map((item) =>
        item.id === review.id ? { ...item, status: nextStatus } : item
      )
    );
  };

  const confirmDelete = (review: Review) => {
    setSelectedReview(review);
    setIsDeleteModalOpen(true);
  };

  const deleteReview = async () => {
    if (!selectedReview) return;
    await api.delete(`/reviews/${selectedReview.id}`);
    setReviews((current) => current.filter((item) => item.id !== selectedReview.id));
    setSelectedReview(null);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-heading">
            Quản lý đánh giá
          </h1>
          <p className="text-muted mt-1">
            Kiểm duyệt và quản lý phản hồi từ khách hàng
          </p>
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tìm kiếm đánh giá..."
            className="pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none w-full sm:w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-warm overflow-hidden flex flex-col min-h-[600px]">
        <div className="flex border-b border-border overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors relative ${
                activeTab === tab.id ? 'text-primary' : 'text-muted hover:text-heading'
              }`}>
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[860px]">
            <thead>
              <tr className="bg-background/50 text-muted text-sm border-b border-border">
                <th className="p-4 font-medium">Sản phẩm</th>
                <th className="p-4 font-medium">Người đánh giá</th>
                <th className="p-4 font-medium">Đánh giá</th>
                <th className="p-4 font-medium">Nội dung</th>
                <th className="p-4 font-medium">Ngày</th>
                <th className="p-4 font-medium text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredReviews.map((review) => {
                const product = products.find((p) => p.id === review.productId);
                return (
                  <tr
                    key={review.id}
                    className={`hover:bg-background/30 transition-colors ${
                      review.status === 'hidden' ? 'bg-background/40 opacity-75' : ''
                    }`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded border border-border overflow-hidden flex-shrink-0 bg-background">
                          {product?.images[0] && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="font-medium text-heading text-sm line-clamp-2 max-w-[220px]">
                          {product?.name || 'Sản phẩm không tồn tại'}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-body">
                      {review.userName}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">{renderStars(review.rating)}</div>
                    </td>
                    <td className="p-4 text-sm text-body max-w-xs">
                      <p className="line-clamp-2">{review.comment}</p>
                      {review.status === 'hidden' && (
                        <span className="inline-flex mt-2 px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 text-xs font-medium">
                          Đã ẩn
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-muted">
                      {new Date(review.createdAt.replace(' ', 'T')).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => toggleReviewStatus(review)}
                          className={`p-1.5 rounded transition-colors ${
                            review.status === 'hidden'
                              ? 'text-green-700 hover:bg-green-50'
                              : 'text-orange-600 hover:bg-orange-50'
                          }`}
                          title={review.status === 'hidden' ? 'Xem đánh giá' : 'Ẩn đánh giá'}>
                          {review.status === 'hidden' ? (
                            <EyeIcon className="w-4 h-4" />
                          ) : (
                            <EyeOffIcon className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => confirmDelete(review)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Xóa đánh giá">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredReviews.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted">
                    Không có đánh giá phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isDeleteModalOpen && selectedReview && (
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
                Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-6 py-2 border border-border rounded-lg font-medium text-heading hover:bg-background transition-colors">
                  Hủy
                </button>
                <button
                  onClick={deleteReview}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                  Xóa đánh giá
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
