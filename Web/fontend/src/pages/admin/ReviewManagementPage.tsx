import React, { useEffect, useState } from 'react';
import { StarIcon, EyeOffIcon, TrashIcon, SearchIcon } from 'lucide-react';
import { useOrder } from '../../contexts/OrderContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Review } from '../../types';
import { api } from '../../services/api';
export function ReviewManagementPage() {
  const { products } = useOrder();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  useEffect(() => {
    api.get<Review[]>('/reviews').then(setReviews).catch(() => setReviews([]));
  }, []);
  const tabs = [
  {
    id: 'all',
    label: 'Tất cả'
  },
  {
    id: '5',
    label: '5 Sao'
  },
  {
    id: '4',
    label: '4 Sao'
  },
  {
    id: '3',
    label: '3 Sao'
  },
  {
    id: '2',
    label: '2 Sao'
  },
  {
    id: '1',
    label: '1 Sao'
  }];

  const filteredReviews =
  activeTab === 'all' ?
  reviews :
  reviews.filter((r) => r.rating.toString() === activeTab);
  const renderStars = (count: number) => {
    return Array.from({
      length: 5
    }).map((_, i) =>
    <StarIcon
      key={i}
      className={`w-4 h-4 ${i < count ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />

    );
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
            placeholder="Tìm kiếm đánh giá..."
            className="pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none w-full sm:w-64" />
          
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-warm overflow-hidden flex flex-col min-h-[600px]">
        {/* Tabs */}
        <div className="flex border-b border-border overflow-x-auto hide-scrollbar">
          {tabs.map((tab) =>
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors relative ${activeTab === tab.id ? 'text-primary' : 'text-muted hover:text-heading'}`}>
            
              {tab.label}
              {activeTab === tab.id &&
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
            }
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-background/50 text-muted text-sm border-b border-border">
                <th className="p-4 font-medium w-12 text-center">
                  <input
                    type="checkbox"
                    className="rounded border-border text-primary focus:ring-primary" />
                  
                </th>
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
                    className="hover:bg-background/30 transition-colors">
                    
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        className="rounded border-border text-primary focus:ring-primary" />
                      
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded border border-border overflow-hidden flex-shrink-0">
                          <img
                            src={product?.images[0]}
                            alt=""
                            className="w-full h-full object-cover" />
                          
                        </div>
                        <div className="font-medium text-heading text-sm line-clamp-2 max-w-[200px]">
                          {product?.name}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-body">
                      {review.userName}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-body max-w-xs">
                      <p className="line-clamp-2">{review.comment}</p>
                    </td>
                    <td className="p-4 text-sm text-muted">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="Ẩn đánh giá">
                          
                          <EyeOffIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setIsDeleteModalOpen(true)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Xóa">
                          
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteModalOpen &&
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
            className="bg-white rounded-xl shadow-warm-lg w-full max-w-md p-6 text-center">
            
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrashIcon className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-heading mb-2">
                Xác nhận xóa
              </h3>
              <p className="text-body mb-6">
                Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể
                hoàn tác.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2 border border-border rounded-lg font-medium text-heading hover:bg-background transition-colors">
                
                  Hủy
                </button>
                <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                
                  Xóa đánh giá
                </button>
              </div>
            </motion.div>
          </div>
        }
      </AnimatePresence>
    </div>);

}
