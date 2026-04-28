import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeafIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
export function LoginRegisterPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Vui lòng nhập email');
      return;
    }
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Đăng nhập thất bại');
    }
  };
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    try {
      await register(name, email, phone, password);
      navigate('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Đăng ký thất bại');
    }
  };
  return (
    <main className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex bg-primary text-white p-2 rounded-xl mb-4">
            <LeafIcon className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-heading mb-2">
            Chào mừng đến với 2HAND
          </h1>
          <p className="text-muted">Thời trang bền vững - Phong cách của bạn</p>
        </div>

        <div className="bg-white rounded-2xl shadow-warm border border-border overflow-hidden">
          <div className="flex border-b border-border">
            <button
              className={`flex-1 py-4 text-center font-medium transition-colors ${isLogin ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted hover:text-heading'}`}
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}>
              
              Đăng nhập
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition-colors ${!isLogin ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted hover:text-heading'}`}
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}>
              
              Đăng ký
            </button>
          </div>

          <div className="p-8">
            {error &&
            <div className="bg-sale/10 text-sale p-3 rounded-lg text-sm mb-6 border border-sale/20">
                {error}
              </div>
            }

            <AnimatePresence mode="wait">
              {isLogin ?
              <motion.form
                key="login"
                initial={{
                  opacity: 0,
                  x: -20
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                exit={{
                  opacity: 0,
                  x: 20
                }}
                transition={{
                  duration: 0.2
                }}
                onSubmit={handleLogin}
                className="space-y-5">
                
                  <div>
                    <label className="block text-sm font-medium text-heading mb-2">
                      Email
                    </label>
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="Nhập email của bạn" />
                  
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-heading">
                        Mật khẩu
                      </label>
                      <button
                      type="button"
                      className="text-xs text-primary hover:underline">
                      
                        Quên mật khẩu?
                      </button>
                    </div>
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="Nhập mật khẩu" />
                  
                  </div>
                  <button
                  type="submit"
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-warm mt-2">
                  
                    Đăng nhập
                  </button>
                  <div className="text-center mt-4">
                    <p className="text-xs text-muted">
                      Gợi ý: admin@2hand.vn / admin123 để vào trang quản trị
                    </p>
                  </div>
                </motion.form> :

              <motion.form
                key="register"
                initial={{
                  opacity: 0,
                  x: 20
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                exit={{
                  opacity: 0,
                  x: -20
                }}
                transition={{
                  duration: 0.2
                }}
                onSubmit={handleRegister}
                className="space-y-4">
                
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Họ và tên
                    </label>
                    <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="Nhập họ tên" />
                  
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Email
                    </label>
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="Nhập email" />
                  
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Số điện thoại
                    </label>
                    <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="Nhập số điện thoại" />
                  
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Mật khẩu
                    </label>
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="Tạo mật khẩu" />
                  
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Xác nhận mật khẩu
                    </label>
                    <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="Nhập lại mật khẩu" />
                  
                  </div>
                  <button
                  type="submit"
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-warm mt-4">
                  
                    Đăng ký tài khoản
                  </button>
                </motion.form>
              }
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>);

}
