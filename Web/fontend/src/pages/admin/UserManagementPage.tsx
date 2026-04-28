import React, { useEffect, useState } from 'react';
import {
  SearchIcon,
  EyeIcon,
  StarIcon,
  BanIcon,
  XIcon,
  CheckCircleIcon,
  PhoneIcon } from
'lucide-react';
import { useOrder } from '../../contexts/OrderContext';
import { User } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../services/api';
export function UserManagementPage() {
  const { orders } = useOrder();
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showPhoneBlacklistModal, setShowPhoneBlacklistModal] = useState(false);
  const [blacklistPhone, setBlacklistPhone] = useState('');
  const [blacklistReason, setBlacklistReason] = useState('');
  const tabs = [
  {
    id: 'all',
    label: 'Tất cả'
  },
  {
    id: 'normal',
    label: 'Thường'
  },
  {
    id: 'vip',
    label: 'VIP'
  },
  {
    id: 'blacklisted',
    label: 'Blacklist'
  }];

  useEffect(() => {
    api.get<User[]>('/users').then(setUsers).catch(() => setUsers([]));
  }, []);

  const filteredUsers =
  activeTab === 'all' ? users : users.filter((u) => u.status === activeTab);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'normal':
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
            Thường
          </span>);

      case 'vip':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium flex items-center w-fit">
            <StarIcon className="w-3 h-3 mr-1 fill-current" /> VIP
          </span>);

      case 'blacklisted':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium flex items-center w-fit">
            <BanIcon className="w-3 h-3 mr-1" /> Blacklist
          </span>);

      default:
        return null;
    }
  };
  const openUserDetail = (user: User) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };
  const userOrders = selectedUser ?
  orders.filter((o) => o.userId === selectedUser.id) :
  [];
  const handleBlacklistPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (blacklistPhone && blacklistReason) {
      await api.post('/blacklist', {
        phone: blacklistPhone,
        reason: blacklistReason
      });
      alert(`Đã thêm số điện thoại ${blacklistPhone} vào danh sách đen.`);
      setShowPhoneBlacklistModal(false);
      setBlacklistPhone('');
      setBlacklistReason('');
    }
  };
  const reloadUsers = async () => {
    const nextUsers = await api.get<User[]>('/users');
    setUsers(nextUsers);
    if (selectedUser) {
      setSelectedUser(nextUsers.find((user) => user.id === selectedUser.id) || null);
    }
  };
  const updateUserStatus = async (userId: string, status: 'normal' | 'vip' | 'blacklisted') => {
    if (status === 'blacklisted') {
      const reason = window.prompt('Nhập lý do blacklist tài khoản:');
      if (!reason) return;
      await api.post('/blacklist', {
        userId,
        reason
      });
    } else {
      await api.patch(`/users/${userId}/status`, {
        status
      });
    }
    await reloadUsers();
  };
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-heading">
            Quản lý người dùng
          </h1>
          <p className="text-muted mt-1">
            Quản lý tài khoản, phân quyền và kiểm soát rủi ro
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowPhoneBlacklistModal(true)}
            className="hidden sm:flex items-center px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
            
            <BanIcon className="w-4 h-4 mr-2" /> Blacklist SĐT
          </button>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Tìm tên, email, SĐT..."
              className="pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none w-full sm:w-64" />
            
          </div>
        </div>
      </div>

      <div className="sm:hidden mb-4">
        <button
          onClick={() => setShowPhoneBlacklistModal(true)}
          className="w-full flex items-center justify-center px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
          
          <BanIcon className="w-4 h-4 mr-2" /> Blacklist SĐT
        </button>
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
                <th className="p-4 font-medium">Khách hàng</th>
                <th className="p-4 font-medium">Liên hệ</th>
                <th className="p-4 font-medium text-center">Tổng đơn</th>
                <th className="p-4 font-medium text-right">Tổng chi tiêu</th>
                <th className="p-4 font-medium">Trạng thái</th>
                <th className="p-4 font-medium text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) =>
              <tr
                key={user.id}
                className="hover:bg-background/30 transition-colors">
                
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-serif font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="font-medium text-heading">
                        {user.name}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-body">{user.email}</div>
                    <div className="text-xs text-muted mt-0.5">
                      {user.phone}
                    </div>
                  </td>
                  <td className="p-4 text-center font-medium">
                    {user.totalOrders}
                  </td>
                  <td className="p-4 text-right font-medium text-primary">
                    {formatPrice(user.totalSpent)}
                  </td>
                  <td className="p-4">{getStatusBadge(user.status)}</td>
                  <td className="p-4 text-center">
                    <button
                    onClick={() => openUserDetail(user)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Xem chi tiết">
                    
                      <EyeIcon className="w-5 h-5 mx-auto" />
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {isDetailOpen && selectedUser &&
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
            className="bg-background rounded-xl shadow-warm-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            
              <div className="p-6 border-b border-border bg-white flex justify-between items-center">
                <h2 className="font-serif text-xl font-bold text-heading">
                  Hồ sơ khách hàng
                </h2>
                <button
                onClick={() => setIsDetailOpen(false)}
                className="text-muted hover:text-heading">
                
                  <XIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 flex flex-col lg:flex-row gap-6">
                {/* Left Col: Info & Actions */}
                <div className="w-full lg:w-1/3 space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-border shadow-sm text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center font-serif font-bold text-3xl mx-auto mb-4">
                      {selectedUser.name.charAt(0)}
                    </div>
                    <h3 className="font-bold text-heading text-lg">
                      {selectedUser.name}
                    </h3>
                    <p className="text-sm text-muted mb-4">
                      Thành viên từ{' '}
                      {new Date(selectedUser.createdAt).toLocaleDateString(
                      'vi-VN'
                    )}
                    </p>
                    <div className="flex justify-center mb-6">
                      {getStatusBadge(selectedUser.status)}
                    </div>

                    <div className="space-y-3 text-left text-sm">
                      <div className="flex justify-between border-b border-border pb-2">
                        <span className="text-muted">Email:</span>
                        <span className="font-medium text-body">
                          {selectedUser.email}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-border pb-2">
                        <span className="text-muted">SĐT:</span>
                        <span className="font-medium text-body">
                          {selectedUser.phone}
                        </span>
                      </div>
                      <div className="flex justify-between pb-2">
                        <span className="text-muted">Địa chỉ:</span>
                        <span className="font-medium text-body text-right max-w-[150px] truncate">
                          {selectedUser.address || 'Chưa cập nhật'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
                    <h4 className="font-semibold text-heading mb-4">
                      Thao tác tài khoản
                    </h4>
                    <div className="space-y-3">
                      {selectedUser.status === 'normal' &&
                    <>
                          <button
                            onClick={() => updateUserStatus(selectedUser.id, 'vip')}
                            className="w-full py-2 px-4 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-sm font-medium hover:bg-yellow-100 flex items-center justify-center transition-colors">
                            <StarIcon className="w-4 h-4 mr-2 fill-current" />{' '}
                            Gắn VIP
                          </button>
                          <button
                            onClick={() => updateUserStatus(selectedUser.id, 'blacklisted')}
                            className="w-full py-2 px-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center transition-colors">
                            <BanIcon className="w-4 h-4 mr-2" /> Thêm Blacklist
                          </button>
                        </>
                    }
                      {selectedUser.status === 'vip' &&
                    <>
                          <button
                            onClick={() => updateUserStatus(selectedUser.id, 'normal')}
                            className="w-full py-2 px-4 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center justify-center transition-colors">
                            Bỏ VIP
                          </button>
                          <button
                            onClick={() => updateUserStatus(selectedUser.id, 'blacklisted')}
                            className="w-full py-2 px-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center transition-colors">
                            <BanIcon className="w-4 h-4 mr-2" /> Thêm Blacklist
                          </button>
                        </>
                    }
                      {selectedUser.status === 'blacklisted' &&
                    <>
                          <div className="p-3 bg-red-50 rounded-lg border border-red-100 mb-3">
                            <p className="text-xs font-bold text-red-800 mb-1">
                              Lý do Blacklist:
                            </p>
                            <p className="text-sm text-red-700">
                              {selectedUser.blacklistReason}
                            </p>
                          </div>
                          <button
                            onClick={() => updateUserStatus(selectedUser.id, 'normal')}
                            className="w-full py-2 px-4 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium hover:bg-green-100 flex items-center justify-center transition-colors">
                            <CheckCircleIcon className="w-4 h-4 mr-2" /> Bỏ
                            Blacklist
                          </button>
                        </>
                    }
                    </div>
                  </div>
                </div>

                {/* Right Col: Stats & History */}
                <div className="w-full lg:w-2/3 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
                      <p className="text-sm text-muted mb-1">Tổng đơn hàng</p>
                      <h3 className="text-2xl font-serif font-bold text-heading">
                        {selectedUser.totalOrders}
                      </h3>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
                      <p className="text-sm text-muted mb-1">Tổng chi tiêu</p>
                      <h3 className="text-2xl font-serif font-bold text-primary">
                        {formatPrice(selectedUser.totalSpent)}
                      </h3>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-[400px]">
                    <div className="p-5 border-b border-border">
                      <h4 className="font-semibold text-heading">
                        Lịch sử mua hàng
                      </h4>
                    </div>
                    <div className="overflow-y-auto flex-1 p-0">
                      {userOrders.length > 0 ?
                    <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-background/50 text-muted text-xs border-b border-border">
                              <th className="p-3 font-medium">Mã đơn</th>
                              <th className="p-3 font-medium">Ngày</th>
                              <th className="p-3 font-medium text-right">
                                Tổng tiền
                              </th>
                              <th className="p-3 font-medium text-center">
                                Trạng thái
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {userOrders.map((order) =>
                        <tr
                          key={order.id}
                          className="hover:bg-background/30 transition-colors">
                          
                                <td className="p-3 text-sm font-medium text-primary">
                                  {order.orderNumber}
                                </td>
                                <td className="p-3 text-sm text-muted">
                                  {new Date(order.createdAt).toLocaleDateString(
                              'vi-VN'
                            )}
                                </td>
                                <td className="p-3 text-sm font-medium text-right">
                                  {formatPrice(order.totalAmount)}
                                </td>
                                <td className="p-3 text-center">
                                  {order.orderStatus === 'completed' ?
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                                      Hoàn thành
                                    </span> :
                            order.orderStatus === 'cancelled' ?
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs">
                                      Đã hủy
                                    </span> :

                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                                      Đang xử lý
                                    </span>
                            }
                                </td>
                              </tr>
                        )}
                          </tbody>
                        </table> :

                    <div className="flex items-center justify-center h-full text-muted text-sm">
                          Chưa có đơn hàng nào
                        </div>
                    }
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        }
      </AnimatePresence>

      {/* Phone Blacklist Modal */}
      <AnimatePresence>
        {showPhoneBlacklistModal &&
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
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            
              <div className="p-6 border-b border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <BanIcon className="w-5 h-5" />
                </div>
                <h2 className="font-serif text-xl font-bold text-heading">
                  Chặn số điện thoại
                </h2>
              </div>
              <form onSubmit={handleBlacklistPhone} className="p-6">
                <p className="text-sm text-body mb-6">
                  Số điện thoại bị chặn sẽ không thể đặt hàng trên hệ thống,
                  ngay cả khi không đăng nhập.
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-heading mb-2">
                      Số điện thoại *
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                      <input
                      required
                      type="tel"
                      value={blacklistPhone}
                      onChange={(e) => setBlacklistPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                      placeholder="Nhập số điện thoại cần chặn" />
                    
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-heading mb-2">
                      Lý do chặn *
                    </label>
                    <textarea
                    required
                    value={blacklistReason}
                    onChange={(e) => setBlacklistReason(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                    placeholder="Bom hàng nhiều lần, lừa đảo...">
                  </textarea>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                  type="button"
                  onClick={() => setShowPhoneBlacklistModal(false)}
                  className="px-4 py-2 text-muted hover:text-heading font-medium">
                  
                    Hủy
                  </button>
                  <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                  
                    Xác nhận chặn
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        }
      </AnimatePresence>
    </div>);

}
