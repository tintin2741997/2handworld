import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ArrowRightIcon,
  ShoppingBagIcon } from
'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/formatters';
import { motion } from 'framer-motion';
export function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const shippingFee = cartTotal > 500000 ? 0 : 30000;
  const finalTotal = cartTotal + shippingFee;
  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-warm">
          <ShoppingBagIcon className="w-16 h-16 text-border" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-heading mb-4">
          Giỏ hàng trống
        </h1>
        <p className="text-muted mb-8 text-center max-w-md">
          Chưa có sản phẩm nào trong giỏ hàng của bạn. Hãy khám phá những món đồ
          2hand độc đáo của chúng tôi nhé!
        </p>
        <Link
          to="/san-pham"
          className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary-hover transition-colors shadow-warm">
          
          Tiếp tục mua sắm
        </Link>
      </main>);

  }
  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-heading mb-8">
          Giỏ hàng của bạn
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-xl shadow-warm border border-border overflow-hidden">
              {/* Desktop Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-border bg-background/50 font-medium text-heading">
                <div className="col-span-6">Sản phẩm</div>
                <div className="col-span-2 text-center">Đơn giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-right">Thành tiền</div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-border">
                {cartItems.map((item) =>
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{
                    opacity: 0
                  }}
                  animate={{
                    opacity: 1
                  }}
                  exit={{
                    opacity: 0
                  }}
                  className="p-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                  
                    {/* Product Info */}
                    <div className="col-span-6 flex items-center gap-4 w-full">
                      <Link
                      to={`/san-pham/${item.product.id}`}
                      className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                      
                        <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover" />
                      
                      </Link>
                      <div className="flex flex-col flex-grow">
                        <Link
                        to={`/san-pham/${item.product.id}`}
                        className="font-serif font-semibold text-heading hover:text-primary transition-colors line-clamp-2 mb-1">
                        
                          {item.product.name}
                        </Link>
                        <span className="text-xs text-muted mb-2">
                          Tình trạng: {item.product.condition}
                        </span>
                        <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-sale text-sm flex items-center hover:underline w-fit">
                        
                          <TrashIcon className="w-4 h-4 mr-1" /> Xóa
                        </button>
                      </div>
                    </div>

                    {/* Mobile Price/Qty/Total Layout */}
                    <div className="col-span-6 w-full md:hidden flex justify-between items-end mt-4">
                      <div className="flex items-center border border-border rounded-lg bg-background">
                        <button
                        onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-2 text-muted hover:text-primary">
                        
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium text-sm">
                          {item.quantity}
                        </span>
                        <button
                        onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-2 text-muted hover:text-primary">
                        
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                      </div>
                    </div>

                    {/* Desktop Price */}
                    <div className="col-span-2 hidden md:flex justify-center font-medium text-body">
                      {formatPrice(item.product.price)}
                    </div>

                    {/* Desktop Quantity */}
                    <div className="col-span-2 hidden md:flex justify-center">
                      <div className="flex items-center border border-border rounded-lg bg-background">
                        <button
                        onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-2 text-muted hover:text-primary">
                        
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium text-sm">
                          {item.quantity}
                        </span>
                        <button
                        onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-2 text-muted hover:text-primary">
                        
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Desktop Total */}
                    <div className="col-span-2 hidden md:flex justify-end font-bold text-primary">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/san-pham"
                className="text-primary font-medium hover:underline flex items-center">
                
                <ArrowRightIcon className="w-4 h-4 mr-2 rotate-180" /> Tiếp tục
                mua sắm
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-warm border border-border p-6 sticky top-24">
              <h2 className="font-serif text-xl font-bold text-heading mb-6 pb-4 border-b border-border">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-4 mb-6 text-body">
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
                {shippingFee > 0 &&
                <div className="text-xs text-success bg-success/10 p-2 rounded">
                    Mua thêm {formatPrice(500000 - cartTotal)} để được miễn phí
                    vận chuyển!
                  </div>
                }
              </div>

              <div className="border-t border-border pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-serif font-bold text-heading">
                    Tổng cộng
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
                <p className="text-xs text-muted text-right mt-1">
                  (Đã bao gồm VAT nếu có)
                </p>
              </div>

              <Link
                to="/thanh-toan"
                className="w-full bg-primary text-white font-semibold py-4 rounded-xl hover:bg-primary-hover transition-colors shadow-warm flex justify-center items-center">
                
                Tiến hành thanh toán <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>);

}