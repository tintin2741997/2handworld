import React, { useEffect, useState } from 'react';
import {
  EyeIcon,
  XIcon,
  SearchIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
  RotateCcwIcon,
  PhoneCallIcon,
  StarIcon } from
'lucide-react';
import { useOrder } from '../../contexts/OrderContext';
import { formatPrice } from '../../utils/formatters';
import { Order, User } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../services/api';
export function OrderManagementPage() {
  const {
    orders,
    cancelRequests,
    updateOrderStatus,
    updatePaymentStatus,
    processCancelRequest
  } = useOrder();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    api.get<User[]>('/users').then(setUsers).catch(() => setUsers([]));
  }, []);
  const tabs = [
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
  },
  {
    id: 'failed_delivery',
    label: 'Giao thất bại'
  },
  {
    id: 'returned',
    label: 'Đã trả về'
  },
  {
    id: 'rejected',
    label: 'Bị từ chối'
  },
  {
    id: 'cancel_requests',
    label: 'Yêu cầu hủy'
  }];

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const matchesOrderSearch = (order: Order) => {
    if (!normalizedSearch) {
      return true;
    }

    return [
      order.orderNumber,
      order.shippingInfo.fullName,
      order.shippingInfo.phone,
      order.shippingInfo.email,
      order.shippingInfo.address,
      order.orderStatus,
      order.paymentStatus
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalizedSearch));
  };
  const statusFilteredOrders =
  activeTab === 'all' || activeTab === 'cancel_requests' ?
  orders :
  orders.filter((o) => o.orderStatus === activeTab);
  const filteredOrders = statusFilteredOrders.filter(matchesOrderSearch);
  const filteredCancelRequests = cancelRequests.filter((request) => {
    const order = orders.find((o) => o.id === request.orderId);
    if (!normalizedSearch) {
      return true;
    }

    return (
      request.reason.toLowerCase().includes(normalizedSearch) ||
      request.status.toLowerCase().includes(normalizedSearch) ||
      (order ? matchesOrderSearch(order) : false)
    );
  });
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
            Chờ xác nhận
          </span>);

      case 'confirmed':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
            Đã xác nhận
          </span>);

      case 'shipping':
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
            Đang giao
          </span>);

      case 'completed':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
            Hoàn thành
          </span>);

      case 'cancelled':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
            Đã hủy
          </span>);

      case 'failed_delivery':
        return (
          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
            Giao thất bại
          </span>);

      case 'returned':
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
            Đã trả về
          </span>);

      case 'rejected':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
            Bị từ chối
          </span>);

      default:
        return null;
    }
  };
  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'unpaid':
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
            Chưa thanh toán
          </span>);

      case 'paid':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
            Đã thanh toán
          </span>);

      case 'failed':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
            Thất bại
          </span>);

      case 'refunded':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
            Đã hoàn tiền
          </span>);

      default:
        return null;
    }
  };
  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };
  // Find user to check risk status
  const orderUser = selectedOrder?.userId ?
  users.find((u) => u.id === selectedOrder.userId) :
  null;
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-heading">
            Quản lý đơn hàng
          </h1>
          <p className="text-muted mt-1">
            Xử lý đơn hàng, thanh toán và kiểm soát rủi ro
          </p>
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tìm mã đơn, SĐT..."
            className="pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none w-full sm:w-64" />
          
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-warm overflow-hidden flex flex-col min-h-[600px]">
        {/* Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-10 gap-1 border-b border-border p-2">
          {tabs.map((tab) =>
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`min-h-10 px-2 py-2 rounded-lg font-medium text-[12px] leading-tight transition-colors relative flex items-center justify-center text-center ${activeTab === tab.id ? 'text-primary bg-primary/10' : 'text-muted hover:text-heading hover:bg-background'}`}>
            
              {tab.label}
              {tab.id === 'cancel_requests' && cancelRequests.length > 0 &&
            <span className="ml-1 bg-sale text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {cancelRequests.length}
                </span>
            }
              {activeTab === tab.id &&
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full"></span>
            }
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-x-auto hide-scrollbar">
          {activeTab === 'cancel_requests' ?
          <table className="w-full text-left border-collapse min-w-[720px]">
              <thead>
                <tr className="bg-background/50 text-muted text-xs border-b border-border">
                  <th className="px-4 py-3 font-medium">Mã đơn</th>
                  <th className="px-4 py-3 font-medium">Lý do hủy (từ khách)</th>
                  <th className="px-4 py-3 font-medium">Ngày yêu cầu</th>
                  <th className="px-4 py-3 font-medium text-center">Trạng thái</th>
                  <th className="px-4 py-3 font-medium text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCancelRequests.map((req) => {
                const order = orders.find((o) => o.id === req.orderId);
                return (
                  <tr
                    key={req.id}
                    className="hover:bg-background/30 transition-colors">
                    
                      <td
                      className="px-4 py-3 font-medium text-primary hover:underline cursor-pointer"
                      onClick={() => order && openOrderDetail(order)}>
                      
                        {order?.orderNumber}
                      </td>
                      <td className="px-4 py-3 text-body max-w-xs truncate">
                        {req.reason}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted">
                        {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                        className={`px-2 py-1 rounded text-xs font-medium ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : req.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        
                          {req.status === 'pending' ?
                        'Chờ xử lý' :
                        req.status === 'approved' ?
                        'Đã duyệt' :
                        'Từ chối'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {req.status === 'pending' &&
                      <div className="flex items-center justify-center space-x-2">
                            <button
                          onClick={() =>
                          processCancelRequest(req.id, 'approved')
                          }
                          className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-sm font-medium transition-colors">
                          
                              Xác nhận hủy
                            </button>
                            <button
                          onClick={() =>
                          processCancelRequest(
                            req.id,
                            'rejected',
                            'Không hợp lệ'
                          )
                          }
                          className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded text-sm font-medium transition-colors">
                          
                              Từ chối
                            </button>
                          </div>
                      }
                      </td>
                    </tr>);

              })}
              </tbody>
            </table> :

          <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-background/50 text-muted text-xs border-b border-border">
                  <th className="px-4 py-3 font-medium">Mã đơn</th>
                  <th className="px-4 py-3 font-medium">Khách hàng</th>
                  <th className="px-4 py-3 font-medium text-right">Tổng tiền</th>
                  <th className="px-4 py-3 font-medium text-center">Thanh toán</th>
                  <th className="px-4 py-3 font-medium text-center">Trạng thái</th>
                  <th className="px-4 py-3 font-medium">Ngày đặt</th>
                  <th className="px-4 py-3 font-medium text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) =>
              <tr
                key={order.id}
                className="hover:bg-background/30 transition-colors">
                
                    <td className="px-4 py-3 font-medium text-heading">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-body font-medium">
                        {order.shippingInfo.fullName}
                      </div>
                      <div className="text-xs text-muted mt-0.5">
                        {order.shippingInfo.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-primary text-right">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {getPaymentBadge(order.paymentStatus)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {getStatusBadge(order.orderStatus)}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                    onClick={() => openOrderDetail(order)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Xem chi tiết">
                    
                        <EyeIcon className="w-5 h-5 mx-auto" />
                      </button>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          }
        </div>
      </div>

      {/* Order Detail Slide-over / Modal */}
      <AnimatePresence>
        {isDetailOpen && selectedOrder &&
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
            <motion.div
            initial={{
              x: '100%'
            }}
            animate={{
              x: 0
            }}
            exit={{
              x: '100%'
            }}
            transition={{
              type: 'tween',
              duration: 0.3
            }}
            className="bg-background w-full max-w-2xl h-full overflow-y-auto shadow-2xl flex flex-col">
            
              <div className="p-6 border-b border-border bg-white sticky top-0 z-10 flex justify-between items-center">
                <div>
                  <h2 className="font-serif text-xl font-bold text-heading">
                    Chi tiết đơn hàng
                  </h2>
                  <p className="text-sm text-muted mt-1">
                    {selectedOrder.orderNumber}
                  </p>
                </div>
                <button
                onClick={() => setIsDetailOpen(false)}
                className="text-muted hover:text-heading p-2 bg-background rounded-full">
                
                  <XIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6 flex-1">
                {/* RISK CONTROL ALERTS */}
                {selectedOrder.riskWarning?.type === 'blacklist' &&
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
                    <AlertTriangleIcon className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-red-800">
                        CẢNH BÁO RỦI RO
                      </h4>
                      <p className="text-sm text-red-700 mt-1">
                        {selectedOrder.riskWarning.message}
                      </p>
                      {selectedOrder.riskWarning.reason &&
                    <p className="text-sm text-red-700 mt-1">
                          Lý do: {selectedOrder.riskWarning.reason}
                        </p>
                    }
                    </div>
                  </div>
              }
                {!selectedOrder.riskWarning && orderUser?.status === 'blacklisted' &&
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
                    <AlertTriangleIcon className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-red-800">
                        CẢNH BÁO RỦI RO
                      </h4>
                      <p className="text-sm text-red-700 mt-1">
                        Tài khoản này nằm trong danh sách đen. Lý do:{' '}
                        {orderUser.blacklistReason}
                      </p>
                    </div>
                  </div>
              }
                {orderUser?.status === 'vip' &&
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start">
                    <StarIcon className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0 fill-current" />
                    <div>
                      <h4 className="font-bold text-yellow-800">
                        Khách hàng VIP
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Ưu tiên xử lý đơn hàng cho khách hàng này.
                      </p>
                    </div>
                  </div>
              }

                {/* Status Row */}
                <div className="flex gap-4">
                  <div className="flex-1 bg-white p-4 rounded-xl border border-border shadow-sm">
                    <p className="text-xs text-muted mb-1">Trạng thái đơn</p>
                    <div className="mt-1">
                      {getStatusBadge(selectedOrder.orderStatus)}
                    </div>
                  </div>
                  <div className="flex-1 bg-white p-4 rounded-xl border border-border shadow-sm">
                    <p className="text-xs text-muted mb-1">Thanh toán</p>
                    <div className="mt-1">
                      {getPaymentBadge(selectedOrder.paymentStatus)}
                    </div>
                  </div>
                </div>

                {/* Action Buttons based on status */}
                <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
                  <h3 className="font-semibold text-heading mb-3">
                    Cập nhật trạng thái
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.orderStatus === 'pending' &&
                  <>
                        <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'confirmed');
                        setSelectedOrder({
                          ...selectedOrder,
                          orderStatus: 'confirmed'
                        });
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center">
                      
                          <CheckCircleIcon className="w-4 h-4 mr-2" /> Xác nhận
                          đơn
                        </button>
                        <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'rejected');
                        setSelectedOrder({
                          ...selectedOrder,
                          orderStatus: 'rejected'
                        });
                      }}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 flex items-center">
                      
                          <XCircleIcon className="w-4 h-4 mr-2" /> Từ chối
                        </button>
                      </>
                  }
                    {selectedOrder.orderStatus === 'confirmed' &&
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'shipping');
                      setSelectedOrder({
                        ...selectedOrder,
                        orderStatus: 'shipping'
                      });
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center">
                    
                        <TruckIcon className="w-4 h-4 mr-2" /> Giao hàng
                      </button>
                  }
                    {selectedOrder.orderStatus === 'shipping' &&
                  <>
                        <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'completed');
                        setSelectedOrder({
                          ...selectedOrder,
                          orderStatus: 'completed'
                        });
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center">
                      
                          <CheckCircleIcon className="w-4 h-4 mr-2" /> Hoàn
                          thành
                        </button>
                        <button
                      onClick={() => {
                        updateOrderStatus(
                          selectedOrder.id,
                          'failed_delivery'
                        );
                        setSelectedOrder({
                          ...selectedOrder,
                          orderStatus: 'failed_delivery'
                        });
                      }}
                      className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 flex items-center">
                      
                          <AlertTriangleIcon className="w-4 h-4 mr-2" /> Giao
                          thất bại
                        </button>
                      </>
                  }
                    {selectedOrder.orderStatus === 'failed_delivery' &&
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'returned');
                      setSelectedOrder({
                        ...selectedOrder,
                        orderStatus: 'returned'
                      });
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 flex items-center">
                    
                        <RotateCcwIcon className="w-4 h-4 mr-2" /> Trả về kho
                      </button>
                  }
                  </div>

                  <h3 className="font-semibold text-heading mb-3 mt-6">
                    Cập nhật thanh toán
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.paymentStatus === 'unpaid' &&
                  <button
                    onClick={() => {
                      updatePaymentStatus(selectedOrder.id, 'paid');
                      setSelectedOrder({
                        ...selectedOrder,
                        paymentStatus: 'paid'
                      });
                    }}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 flex items-center">
                    
                        Đã thanh toán
                      </button>
                  }
                    {selectedOrder.paymentStatus === 'paid' &&
                  <button
                    onClick={() => {
                      updatePaymentStatus(selectedOrder.id, 'refunded');
                      setSelectedOrder({
                        ...selectedOrder,
                        paymentStatus: 'refunded'
                      });
                    }}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 flex items-center">
                    
                        Hoàn tiền
                      </button>
                  }
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
                  <h3 className="font-semibold text-heading mb-4 border-b border-border pb-2">
                    Thông tin giao hàng
                  </h3>
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <div className="text-muted">Người nhận:</div>
                    <div className="font-medium text-body">
                      {selectedOrder.shippingInfo.fullName}
                    </div>
                    <div className="text-muted">Số điện thoại:</div>
                    <div className="font-medium text-body">
                      {selectedOrder.shippingInfo.phone}
                    </div>
                    <div className="text-muted">Địa chỉ:</div>
                    <div className="font-medium text-body">
                      {selectedOrder.shippingInfo.address},{' '}
                      {selectedOrder.shippingInfo.ward},{' '}
                      {selectedOrder.shippingInfo.district},{' '}
                      {selectedOrder.shippingInfo.city}
                    </div>
                    <div className="text-muted">Ghi chú:</div>
                    <div className="font-medium text-body">
                      {selectedOrder.shippingInfo.note || 'Không có'}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
                  <h3 className="font-semibold text-heading mb-4 border-b border-border pb-2">
                    Sản phẩm ({selectedOrder.items.length})
                  </h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, idx) =>
                  <div key={idx} className="flex gap-4">
                        <div className="w-16 h-16 rounded border border-border overflow-hidden flex-shrink-0">
                          <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover" />
                      
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-heading line-clamp-2">
                            {item.productName}
                          </h4>
                          <div className="text-xs text-muted mt-1">
                            Tình trạng: {item.condition} | SL: {item.quantity}
                          </div>
                          <div className="text-primary font-medium text-sm mt-1">
                            {formatPrice(item.price)}
                          </div>
                        </div>
                      </div>
                  )}
                  </div>
                  <div className="mt-6 pt-4 border-t border-border space-y-2 text-sm">
                    <div className="flex justify-between text-body">
                      <span>Tạm tính:</span>
                      <span>
                        {formatPrice(
                        selectedOrder.totalAmount - selectedOrder.shippingFee
                      )}
                      </span>
                    </div>
                    <div className="flex justify-between text-body">
                      <span>Phí vận chuyển:</span>
                      <span>{formatPrice(selectedOrder.shippingFee)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-primary pt-2 border-t border-border mt-2">
                      <span>Tổng cộng:</span>
                      <span>{formatPrice(selectedOrder.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        }
      </AnimatePresence>
    </div>);

}
