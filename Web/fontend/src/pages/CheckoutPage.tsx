import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckIcon,
  CreditCardIcon,
  TruckIcon,
  MapPinIcon,
  ChevronLeftIcon } from
'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useOrder } from '../contexts/OrderContext';
import { formatPrice } from '../utils/formatters';
export function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { createOrder } = useOrder();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const shippingFee = cartTotal > 500000 ? 0 : 30000;
  const finalTotal = cartTotal + shippingFee;
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: '',
    paymentMethod: 'cod'
  });
  const handleInputChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>

  {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };
  const handlePlaceOrder = async () => {
    setError('');
    const orderItems = cartItems.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.images[0],
      price: item.product.price,
      quantity: item.quantity,
      condition: item.product.condition
    }));
    const result = await createOrder(
      orderItems,
      formData,
      formData.paymentMethod,
      finalTotal,
      shippingFee
    );
    if (result.success) {
      setIsSuccess(true);
      await clearCart();
    } else {
      setError(result.error || 'Có lỗi xảy ra khi đặt hàng.');
    }
  };
  if (cartItems.length === 0 && !isSuccess) {
    navigate('/gio-hang');
    return null;
  }
  if (isSuccess) {
    return (
      <main className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-background">
        <div className="bg-white p-10 rounded-2xl shadow-warm-lg max-w-lg w-full text-center border border-border">
          <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckIcon className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-heading mb-4">
            Đặt hàng thành công!
          </h1>
          <p className="text-body mb-8 leading-relaxed">
            Cảm ơn bạn đã mua sắm tại 2HANDWORLD. Đơn hàng của bạn đã được ghi nhận
            và sẽ được xử lý trong thời gian sớm nhất. Chúng tôi sẽ liên hệ qua
            số điện thoại <strong>{formData.phone}</strong> để xác nhận.
          </p>
          <Link
            to="/"
            className="inline-block bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary-hover transition-colors shadow-warm">
            
            Về trang chủ
          </Link>
        </div>
      </main>);

  }
  return (
    <main className="min-h-screen pt-24 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Stepper */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border z-0"></div>
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 transition-all duration-500"
              style={{
                width: `${(step - 1) * 50}%`
              }}>
            </div>

            {[
            {
              num: 1,
              label: 'Thông tin nhận hàng',
              icon: MapPinIcon
            },
            {
              num: 2,
              label: 'Thanh toán',
              icon: CreditCardIcon
            },
            {
              num: 3,
              label: 'Xác nhận',
              icon: CheckIcon
            }].
            map((s) =>
            <div
              key={s.num}
              className="relative z-10 flex flex-col items-center">
              
                <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-background transition-colors duration-300 ${step >= s.num ? 'bg-primary text-white' : 'bg-white text-muted border-border'}`}>
                
                  <s.icon className="w-5 h-5" />
                </div>
                <span
                className={`mt-2 text-sm font-medium ${step >= s.num ? 'text-heading' : 'text-muted'}`}>
                
                  {s.label}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Form Area */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-xl shadow-warm border border-border p-6 md:p-8">
              {step === 1 &&
              <form onSubmit={handleNextStep}>
                  <h2 className="font-serif text-2xl font-bold text-heading mb-6">
                    Thông tin nhận hàng
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-heading mb-2">
                        Họ và tên *
                      </label>
                      <input
                      required
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      placeholder="Nhập họ tên" />
                    
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-heading mb-2">
                        Số điện thoại *
                      </label>
                      <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      placeholder="Nhập số điện thoại" />
                    
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-heading mb-2">
                      Email
                    </label>
                    <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="Nhập email (không bắt buộc)" />
                  
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-heading mb-2">
                      Địa chỉ cụ thể *
                    </label>
                    <input
                    required
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="Số nhà, tên đường..." />
                  
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-heading mb-2">
                        Tỉnh / Thành phố *
                      </label>
                      <select
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white">
                      
                        <option value="">Chọn Tỉnh/Thành</option>
                        <option value="hcm">Hồ Chí Minh</option>
                        <option value="hn">Hà Nội</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-heading mb-2">
                        Quận / Huyện *
                      </label>
                      <select
                      required
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white">
                      
                        <option value="">Chọn Quận/Huyện</option>
                        <option value="q1">Quận 1</option>
                        <option value="q3">Quận 3</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-heading mb-2">
                        Phường / Xã *
                      </label>
                      <select
                      required
                      name="ward"
                      value={formData.ward}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white">
                      
                        <option value="">Chọn Phường/Xã</option>
                        <option value="p1">Phường 1</option>
                        <option value="p2">Phường 2</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-heading mb-2">
                      Ghi chú đơn hàng
                    </label>
                    <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="Ghi chú về thời gian giao hàng...">
                  </textarea>
                  </div>
                  <div className="flex justify-between items-center">
                    <Link
                    to="/gio-hang"
                    className="text-muted hover:text-primary flex items-center font-medium">
                    
                      <ChevronLeftIcon className="w-5 h-5 mr-1" /> Quay lại giỏ
                      hàng
                    </Link>
                    <button
                    type="submit"
                    className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-hover transition-colors shadow-warm">
                    
                      Tiếp tục thanh toán
                    </button>
                  </div>
                </form>
              }

              {step === 2 &&
              <form onSubmit={handleNextStep}>
                  <h2 className="font-serif text-2xl font-bold text-heading mb-6">
                    Phương thức thanh toán
                  </h2>
                  <div className="space-y-4 mb-8">
                    <label
                    className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                    
                      <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-primary focus:ring-primary border-gray-300" />
                    
                      <div className="ml-4 flex-1">
                        <span className="block font-medium text-heading">
                          Thanh toán khi nhận hàng (COD)
                        </span>
                        <span className="block text-sm text-muted mt-1">
                          Thanh toán bằng tiền mặt khi giao hàng.
                        </span>
                      </div>
                      <TruckIcon className="w-8 h-8 text-muted" />
                    </label>

                    <label
                    className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'bank_transfer' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                    
                      <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-primary focus:ring-primary border-gray-300" />
                    
                      <div className="ml-4 flex-1">
                        <span className="block font-medium text-heading">
                          Chuyển khoản ngân hàng
                        </span>
                        <span className="block text-sm text-muted mt-1">
                          Chuyển khoản trực tiếp qua tài khoản ngân hàng.
                        </span>
                      </div>
                      <CreditCardIcon className="w-8 h-8 text-muted" />
                    </label>
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-muted hover:text-primary flex items-center font-medium">
                    
                      <ChevronLeftIcon className="w-5 h-5 mr-1" /> Quay lại
                    </button>
                    <button
                    type="submit"
                    className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-hover transition-colors shadow-warm">
                    
                      Xem lại đơn hàng
                    </button>
                  </div>
                </form>
              }

              {step === 3 &&
              <div>
                  <h2 className="font-serif text-2xl font-bold text-heading mb-6">
                    Xác nhận đơn hàng
                  </h2>

                  {error &&
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-200">
                      {error}
                    </div>
                }

                  <div className="bg-background rounded-xl p-6 mb-6 border border-border">
                    <h3 className="font-semibold text-heading mb-4 border-b border-border pb-2">
                      Thông tin giao hàng
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-body">
                      <div>
                        <span className="text-muted">Người nhận:</span>{' '}
                        {formData.fullName}
                      </div>
                      <div>
                        <span className="text-muted">Số điện thoại:</span>{' '}
                        {formData.phone}
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-muted">Địa chỉ:</span>{' '}
                        {formData.address}, {formData.ward}, {formData.district}
                        , {formData.city}
                      </div>
                      {formData.note &&
                    <div className="md:col-span-2">
                          <span className="text-muted">Ghi chú:</span>{' '}
                          {formData.note}
                        </div>
                    }
                    </div>
                  </div>

                  <div className="bg-background rounded-xl p-6 mb-8 border border-border">
                    <h3 className="font-semibold text-heading mb-4 border-b border-border pb-2">
                      Phương thức thanh toán
                    </h3>
                    <div className="text-sm text-body">
                      {formData.paymentMethod === 'cod' ?
                    'Thanh toán khi nhận hàng (COD)' :
                    'Chuyển khoản ngân hàng'}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-muted hover:text-primary flex items-center font-medium">
                    
                      <ChevronLeftIcon className="w-5 h-5 mr-1" /> Quay lại
                    </button>
                    <button
                    onClick={handlePlaceOrder}
                    className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-warm text-lg">
                    
                      Xác nhận đặt hàng
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-warm border border-border p-6 sticky top-24">
              <h2 className="font-serif text-xl font-bold text-heading mb-6 pb-4 border-b border-border">
                Đơn hàng của bạn
              </h2>

              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {cartItems.map((item) =>
                <div key={item.product.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border border-border relative">
                      <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover" />
                    
                      <span className="absolute -top-2 -right-2 bg-muted text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-heading line-clamp-2 mb-1">
                        {item.product.name}
                      </h4>
                      <div className="text-primary font-bold text-sm">
                        {formatPrice(item.product.price)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-6 text-sm text-body border-t border-border pt-4">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-medium">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium">
                    {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-end">
                  <span className="font-serif font-bold text-heading">
                    Tổng cộng
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>);

}
