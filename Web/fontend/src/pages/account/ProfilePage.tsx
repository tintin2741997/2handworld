import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserIcon,
  LockIcon,
  PackageIcon,
  LogOutIcon,
  CheckCircleIcon } from
'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
export function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [activeTab, setActiveTab] = useState('info');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  if (!user) {
    navigate('/dang-nhap');
    return null;
  }
  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setToastMessage('Cập nhật thông tin thành công!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : 'Cập nhật thất bại!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      setToastMessage('Mật khẩu xác nhận không khớp!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    // Mock password update
    setToastMessage('Đổi mật khẩu thành công!');
    setShowToast(true);
    setPasswordData({
      current: '',
      new: '',
      confirm: ''
    });
    setTimeout(() => setShowToast(false), 3000);
  };
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  return (
    <main className="min-h-screen pt-28 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-heading mb-8">
          Tài khoản của tôi
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-xl shadow-warm border border-border p-6 mb-6">
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-border">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold font-serif text-2xl">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-heading">{user.name}</h3>
                  <p className="text-sm text-muted">{user.email}</p>
                  {user.status === 'vip' &&
                  <span className="inline-block mt-1 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded font-medium">
                      VIP Member
                    </span>
                  }
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'info' ? 'bg-primary/10 text-primary font-medium' : 'text-body hover:bg-background'}`}>
                  
                  <UserIcon className="w-5 h-5 mr-3" /> Thông tin cá nhân
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'password' ? 'bg-primary/10 text-primary font-medium' : 'text-body hover:bg-background'}`}>
                  
                  <LockIcon className="w-5 h-5 mr-3" /> Đổi mật khẩu
                </button>
                <Link
                  to="/don-hang"
                  className="w-full flex items-center px-4 py-3 rounded-lg text-body hover:bg-background transition-colors">
                  
                  <PackageIcon className="w-5 h-5 mr-3" /> Đơn hàng của tôi
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-sale hover:bg-sale/10 transition-colors mt-4 border border-transparent hover:border-sale/20">
                  
                  <LogOutIcon className="w-5 h-5 mr-3" /> Đăng xuất
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            <div className="bg-white rounded-xl shadow-warm border border-border p-6 md:p-8">
              {activeTab === 'info' ?
              <div>
                  <h2 className="font-serif text-2xl font-bold text-heading mb-6">
                    Thông tin cá nhân
                  </h2>
                  <form
                  onSubmit={handleInfoSubmit}
                  className="space-y-6 max-w-2xl">
                  
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-heading mb-2">
                          Họ và tên
                        </label>
                        <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value
                        })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                      
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-heading mb-2">
                          Email (Không thể thay đổi)
                        </label>
                        <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-muted cursor-not-allowed" />
                      
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-heading mb-2">
                        Số điện thoại
                      </label>
                      <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value
                      })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                    
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-heading mb-2">
                        Địa chỉ giao hàng mặc định
                      </label>
                      <textarea
                      value={formData.address}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: e.target.value
                      })
                      }
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      placeholder="Nhập địa chỉ chi tiết...">
                    </textarea>
                    </div>
                    <button
                    type="submit"
                    className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-hover transition-colors shadow-warm">
                    
                      Lưu thay đổi
                    </button>
                  </form>
                </div> :

              <div>
                  <h2 className="font-serif text-2xl font-bold text-heading mb-6">
                    Đổi mật khẩu
                  </h2>
                  <form
                  onSubmit={handlePasswordSubmit}
                  className="space-y-6 max-w-md">
                  
                    <div>
                      <label className="block text-sm font-medium text-heading mb-2">
                        Mật khẩu hiện tại
                      </label>
                      <input
                      type="password"
                      required
                      value={passwordData.current}
                      onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        current: e.target.value
                      })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                    
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-heading mb-2">
                        Mật khẩu mới
                      </label>
                      <input
                      type="password"
                      required
                      value={passwordData.new}
                      onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        new: e.target.value
                      })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                    
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-heading mb-2">
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                      type="password"
                      required
                      value={passwordData.confirm}
                      onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirm: e.target.value
                      })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                    
                    </div>
                    <button
                    type="submit"
                    className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-hover transition-colors shadow-warm">
                    
                      Cập nhật mật khẩu
                    </button>
                  </form>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast &&
        <motion.div
          initial={{
            opacity: 0,
            y: 50
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            y: 50
          }}
          className="fixed bottom-8 right-8 bg-white border-l-4 border-success shadow-warm-lg rounded-lg p-4 flex items-center z-50">
          
            <CheckCircleIcon className="w-6 h-6 text-success mr-3" />
            <span className="font-medium text-heading">{toastMessage}</span>
          </motion.div>
        }
      </AnimatePresence>
    </main>);

}
