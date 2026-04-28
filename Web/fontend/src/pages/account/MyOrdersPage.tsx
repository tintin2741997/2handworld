import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PackageIcon,
  ChevronRightIcon,
  XIcon,
  AlertCircleIcon,
  StarIcon } from
'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useOrder } from '../../contexts/OrderContext';
import { formatPrice } from '../../utils/formatters';
import { Order, OrderStatus } from '../../types';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from '../../services/api';
export function MyOrdersPage() {
  const { user } = useAuth();
  const { orders, submitCancelRequest } = useOrder();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  if (!user) {
    navigate('/dang-nhap');
    return null;
  }
  // Filter orders for current user
  const userOrders = orders.filter((o) => o.userId === user.id);
  const filteredOrders =
  activeTab === 'all' ?
  userOrders :
  userOrders.filter((o) => o.orderStatus === activeTab);
  const tabs: {
    id: OrderStatus | 'all';
    label: string;
  }[] = [
  {
    id: 'all',
    label: 'Tất cả'
  },
  {
    id: 'pending',
    label: 'Chờ xác nhận'
  },
  {
    id: 'confirmed',
    label: 'Đã xác nhận'
  },
  {
    id: 'shipping',
    label: 'Đang giao'
  },
  {
    id: 'completed',
    label: 'Hoàn thành'
  },
  {
    id: 'cancelled',
    label: 'Đã hủy'
  }];

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
            Chờ xác nhận
          </span>);

      case 'confirmed':
        return (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
            Đã xác nhận
          </span>);

      case 'shipping':
        return (
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">
            Đang giao
          </span>);

      case 'completed':
        return (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
            Hoàn thành
          </span>);

      case 'cancelled':
        return (
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold">
            Đã hủy
          </span>);

      default:
        return (
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold">
            {status}
          </span>);

    }
  };
  const handleCancelOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOrder && cancelReason) {
      await submitCancelRequest(selectedOrder.id, cancelReason);
      setShowCancelModal(false);
      setCancelReason('');
      alert('Yêu cầu hủy đơn đã được gửi thành công.');
    }
  };
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewOrder?.items[0]) {
      await api.post('/reviews', {
        productId: reviewOrder.items[0].productId,
        rating,
        comment
      });
    }
    setShowReviewModal(false);
    setReviewOrder(null);
    setRating(5);
    setComment('');
    alert('Cảm ơn bạn đã đánh giá sản phẩm!');
  };
  return (
    <main className="min-h-screen pt-28 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-muted mb-6">
          <Link to="/ho-so" className="hover:text-primary transition-colors">
            Tài khoản
          </Link>
          <ChevronRightIcon className="w-4 h-4 mx-2" />
          <span className="text-heading font-medium">Đơn hàng của tôi</span>
        </nav>

        <h1 className="text-3xl font-serif font-bold text-heading mb-8">
          Đơn hàng của tôi
        </h1>

        <div className="bg-white rounded-xl shadow-warm border border-border overflow-hidden mb-8">
          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-border hide-scrollbar">
            {tabs.map((tab) =>
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors relative ${activeTab === tab.id ? 'text-primary' : 'text-muted hover:text-heading'}`}>
              
                {tab.label}
                {activeTab === tab.id &&
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
              }
              </button>
            )}
          </div>

          {/* Order List */}
          <div className="p-6">
            {filteredOrders.length === 0 ?
            <div className="text-center py-12">
                <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
                  <PackageIcon className="w-10 h-10 text-muted" />
                </div>
                <h3 className="text-lg font-medium text-heading mb-2">
                  Chưa có đơn hàng nào
                </h3>
                <p className="text-muted mb-6">
                  Bạn chưa có đơn hàng nào trong trạng thái này.
                </p>
                <Link
                to="/san-pham"
                className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors">
                
                  Tiếp tục mua sắm
                </Link>
              </div> :

            <div className="space-y-6">
                {filteredOrders.map((order) =>
              <div
                key={order.id}
                className="border border-border rounded-xl p-6 hover:shadow-warm transition-shadow">
                
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-border gap-4">
                      <div>
                        <span className="font-bold text-heading mr-4">
                          {order.orderNumber}
                        </span>
                        <span className="text-sm text-muted">
                          {new Date(order.createdAt).toLocaleDateString(
                        'vi-VN'
                      )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                        {getStatusBadge(order.orderStatus)}
                        {order.orderStatus === 'completed' &&
                    <button
                      onClick={() => {
                        setReviewOrder(order);
                        setShowReviewModal(true);
                      }}
                      className="text-primary font-medium text-sm hover:underline">
                      
                            Đánh giá
                          </button>
                    }
                        <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-primary font-medium text-sm hover:underline">
                      
                          Xem chi tiết
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-border flex-shrink-0">
                        <img
                      src={order.items[0].productImage}
                      alt={order.items[0].productName}
                      className="w-full h-full object-cover" />
                    
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-heading line-clamp-1">
                          {order.items[0].productName}
                        </h4>
                        <p className="text-sm text-muted mt-1">
                          Phân loại: {order.items[0].condition}
                        </p>
                        <p className="text-sm text-muted">
                          x{order.items[0].quantity}
                        </p>
                      </div>
                      <div className="font-medium text-heading">
                        {formatPrice(order.items[0].price)}
                      </div>
                    </div>

                    {order.items.length > 1 &&
                <div className="text-sm text-muted text-center py-2 border-t border-border border-dashed">
                        Xem thêm {order.items.length - 1} sản phẩm khác
                      </div>
                }

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                      <span className="text-muted">Tổng tiền:</span>
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  </div>
              )}
              </div>
            }
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder &&
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
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            
              <div className="flex justify-between items-center p-6 border-b border-border">
                <h2 className="font-serif text-xl font-bold text-heading">
                  Chi tiết đơn hàng {selectedOrder.orderNumber}
                </h2>
                <button
                onClick={() => setSelectedOrder(null)}
                className="text-muted hover:text-heading">
                
                  <XIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-muted">
                    Ngày đặt:{' '}
                    {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                  </span>
                  {getStatusBadge(selectedOrder.orderStatus)}
                </div>

                <div className="bg-background rounded-xl p-4 mb-6 border border-border">
                  <h3 className="font-semibold text-heading mb-3">
                    Thông tin nhận hàng
                  </h3>
                  <p className="text-sm text-body mb-1">
                    <span className="text-muted">Người nhận:</span>{' '}
                    {selectedOrder.shippingInfo.fullName}
                  </p>
                  <p className="text-sm text-body mb-1">
                    <span className="text-muted">Số điện thoại:</span>{' '}
                    {selectedOrder.shippingInfo.phone}
                  </p>
                  <p className="text-sm text-body">
                    <span className="text-muted">Địa chỉ:</span>{' '}
                    {selectedOrder.shippingInfo.address},{' '}
                    {selectedOrder.shippingInfo.ward},{' '}
                    {selectedOrder.shippingInfo.district},{' '}
                    {selectedOrder.shippingInfo.city}
                  </p>
                </div>

                <h3 className="font-semibold text-heading mb-4">Sản phẩm</h3>
                <div className="space-y-4 mb-6">
                  {selectedOrder.items.map((item, idx) =>
                <div
                  key={idx}
                  className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  
                      <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-16 h-16 rounded-md object-cover border border-border" />
                  
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-heading">
                          {item.productName}
                        </h4>
                        <p className="text-xs text-muted mt-1">
                          Tình trạng: {item.condition}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-heading">
                          {formatPrice(item.price)}
                        </div>
                        <div className="text-xs text-muted">
                          x{item.quantity}
                        </div>
                      </div>
                    </div>
                )}
                </div>

                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Tạm tính</span>
                    <span className="font-medium text-heading">
                      {formatPrice(
                      selectedOrder.totalAmount - selectedOrder.shippingFee
                    )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Phí vận chuyển</span>
                    <span className="font-medium text-heading">
                      {formatPrice(selectedOrder.shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border mt-2">
                    <span className="font-bold text-heading">Tổng cộng</span>
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(selectedOrder.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border bg-background flex justify-end gap-4">
                {(selectedOrder.orderStatus === 'pending' ||
              selectedOrder.orderStatus === 'confirmed') &&
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-6 py-2 border border-sale text-sale rounded-lg font-medium hover:bg-sale/5 transition-colors">
                
                    Yêu cầu hủy đơn
                  </button>
              }
                <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors">
                
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        }
      </AnimatePresence>

      {/* Cancel Request Modal */}
      <AnimatePresence>
        {showCancelModal &&
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
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
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            
              <div className="p-6 border-b border-border flex items-center gap-3">
                <AlertCircleIcon className="w-6 h-6 text-sale" />
                <h2 className="font-serif text-xl font-bold text-heading">
                  Yêu cầu hủy đơn hàng
                </h2>
              </div>
              <form onSubmit={handleCancelOrder} className="p-6">
                <p className="text-sm text-body mb-4">
                  Vui lòng cho chúng tôi biết lý do bạn muốn hủy đơn hàng này:
                </p>
                <textarea
                required
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all mb-6"
                placeholder="Nhập lý do hủy đơn...">
              </textarea>
                <div className="flex justify-end gap-3">
                  <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 text-muted hover:text-heading font-medium">
                  
                    Quay lại
                  </button>
                  <button
                  type="submit"
                  className="px-6 py-2 bg-sale text-white rounded-lg font-medium hover:bg-sale/90 transition-colors">
                  
                    Gửi yêu cầu
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        }
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && reviewOrder &&
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
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
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="font-serif text-xl font-bold text-heading">
                  Đánh giá sản phẩm
                </h2>
                <button
                onClick={() => setShowReviewModal(false)}
                className="text-muted hover:text-heading">
                
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmitReview} className="p-6">
                <div className="flex items-center gap-4 mb-6 p-4 bg-background rounded-lg border border-border">
                  <img
                  src={reviewOrder.items[0].productImage}
                  alt={reviewOrder.items[0].productName}
                  className="w-16 h-16 rounded-md object-cover border border-border" />
                
                  <div>
                    <h4 className="text-sm font-medium text-heading line-clamp-2">
                      {reviewOrder.items[0].productName}
                    </h4>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-heading mb-2 text-center">
                    Chất lượng sản phẩm
                  </label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) =>
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none">
                    
                        <StarIcon
                      className={`w-8 h-8 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    
                      </button>
                  )}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-heading mb-2">
                    Nhận xét của bạn
                  </label>
                  <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="Chia sẻ cảm nhận của bạn về sản phẩm...">
                </textarea>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-muted hover:text-heading font-medium">
                  
                    Hủy
                  </button>
                  <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors">
                  
                    Gửi đánh giá
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        }
      </AnimatePresence>
    </main>);

}
