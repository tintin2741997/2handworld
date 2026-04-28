import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRightIcon,
  StarIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  ShieldCheckIcon,
  TruckIcon,
  RefreshCwIcon } from
'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useOrder } from '../contexts/OrderContext';
import { formatPrice } from '../utils/formatters';
import { ProductReviews } from '../components/products/ProductReviews';
import { ProductCard } from '../components/products/ProductCard';
import { Review } from '../types';
import { api } from '../services/api';
export function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { products } = useOrder();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  // In a real app, fetch product by id. Using mock data here.
  const product = products.find((p) => p.id === id) || products[0];
  const relatedProducts = product ? products.
  filter((p) => p.category === product.category && p.id !== product.id).
  slice(0, 4) : [];
  const productReviews = product ? reviews.filter((r) => r.productId === product.id) : [];
  useEffect(() => {
    if (product?.id) {
      api
        .get<Review[]>(`/reviews?productId=${product.id}`)
        .then(setReviews)
        .catch(() => setReviews([]));
    }
  }, [product?.id]);
  if (!product) {
    return (
      <main className="min-h-screen pt-56 md:pt-60 pb-20 flex items-center justify-center">
        <p className="text-muted">Đang tải sản phẩm...</p>
      </main>
    );
  }
  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };
  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Could add a toast notification here
  };
  return (
    <main className="min-h-screen pt-56 md:pt-60 pb-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-muted mb-8">
          <Link to="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <ChevronRightIcon className="w-4 h-4 mx-2" />
          <Link to="/san-pham" className="hover:text-primary transition-colors">
            Sản phẩm
          </Link>
          <ChevronRightIcon className="w-4 h-4 mx-2" />
          <span className="text-heading font-medium truncate">
            {product.name}
          </span>
        </nav>

        {/* Product Top Section */}
        <div className="flex flex-col lg:flex-row gap-12 mb-16">
          {/* Image Gallery */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-2xl overflow-hidden border border-border shadow-warm mb-4 aspect-square">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover" />
              
            </div>
            {product.images.length > 1 &&
            <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) =>
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-colors ${selectedImage === idx ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                
                    <img
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  className="w-full h-full object-cover" />
                
                  </button>
              )}
              </div>
            }
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-success/10 text-success px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {product.condition}
                </span>
                {product.isSale &&
                <span className="bg-sale text-white px-3 py-1 rounded-full text-xs font-bold">
                    Giảm {product.salePercent}%
                  </span>
                }
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-heading mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-medium text-heading">
                    {product.rating}
                  </span>
                </div>
                <span className="text-border">|</span>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-muted hover:text-primary underline underline-offset-4">
                  
                  {product.reviewCount} Đánh giá
                </button>
                <span className="text-border">|</span>
                <span className="text-muted">Đã bán 12</span>
              </div>

              <div className="flex items-end gap-4 mb-8">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.isSale && product.originalPrice &&
                <span className="text-xl text-muted line-through mb-1">
                    {formatPrice(product.originalPrice)}
                  </span>
                }
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border shadow-sm mb-8">
              <p className="text-body leading-relaxed mb-6">
                {product.description}
              </p>
              <div className="flex items-center text-sm text-muted">
                <span className="font-medium text-heading mr-2">Cửa hàng:</span>
                <Link to="#" className="text-primary hover:underline">
                  Chi nhánh Quận 1
                </Link>
              </div>
            </div>

            {/* Actions */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="font-medium text-heading">Số lượng:</span>
                <div className="flex items-center border border-border rounded-lg bg-white">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 text-muted hover:text-primary disabled:opacity-50 transition-colors">
                    
                    <MinusIcon className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-medium text-heading">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-2 text-muted hover:text-primary disabled:opacity-50 transition-colors">
                    
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-sm text-muted ml-2">
                  {product.stock} sản phẩm có sẵn
                </span>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-white border-2 border-primary text-primary font-semibold py-4 rounded-xl hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                  
                  <ShoppingCartIcon className="w-5 h-5" />
                  Thêm vào giỏ
                </button>
                <Link
                  to="/thanh-toan"
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-white font-semibold py-4 rounded-xl hover:bg-primary-hover transition-colors shadow-warm hover:shadow-warm-lg text-center">
                  
                  Mua ngay
                </Link>
              </div>
            </div>

            {/* Policies */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="flex items-start gap-3">
                <RefreshCwIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-heading text-sm">
                    Đổi trả 3 ngày
                  </h4>
                  <p className="text-xs text-muted mt-1">
                    Nếu không đúng mô tả
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheckIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-heading text-sm">
                    Cam kết chính hãng
                  </h4>
                  <p className="text-xs text-muted mt-1">Đã qua kiểm định</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TruckIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-heading text-sm">
                    Giao hàng toàn quốc
                  </h4>
                  <p className="text-xs text-muted mt-1">
                    Freeship đơn từ 500k
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-16">
          <div className="flex border-b border-border mb-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 px-8 font-serif font-semibold text-lg transition-colors relative ${activeTab === 'description' ? 'text-primary' : 'text-muted hover:text-heading'}`}>
              
              Mô tả chi tiết
              {activeTab === 'description' &&
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
              }
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 px-8 font-serif font-semibold text-lg transition-colors relative ${activeTab === 'reviews' ? 'text-primary' : 'text-muted hover:text-heading'}`}>
              
              Đánh giá ({product.reviewCount})
              {activeTab === 'reviews' &&
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
              }
            </button>
          </div>

          <div className="min-h-[300px]">
            {activeTab === 'description' ?
            <div className="bg-white p-8 rounded-xl border border-border shadow-sm max-w-4xl">
                <h3 className="font-serif text-xl font-bold text-heading mb-4">
                  Thông tin sản phẩm
                </h3>
                <ul className="space-y-4 text-body mb-8">
                  <li className="flex">
                    <span className="w-40 font-medium text-heading">
                      Tình trạng:
                    </span>{' '}
                    <span>
                      {product.condition} - Đã qua sử dụng nhưng còn rất tốt.
                    </span>
                  </li>
                  <li className="flex">
                    <span className="w-40 font-medium text-heading">
                      Thương hiệu:
                    </span>{' '}
                    <span>Vintage / No brand</span>
                  </li>
                  <li className="flex">
                    <span className="w-40 font-medium text-heading">
                      Chất liệu:
                    </span>{' '}
                    <span>Linen / Cotton</span>
                  </li>
                  <li className="flex">
                    <span className="w-40 font-medium text-heading">
                      Màu sắc:
                    </span>{' '}
                    <span>Như hình ảnh</span>
                  </li>
                </ul>
                <h3 className="font-serif text-xl font-bold text-heading mb-4">
                  Mô tả từ người bán
                </h3>
                <p className="text-body leading-relaxed whitespace-pre-line">
                  {product.description}
                  <br />
                  <br />
                  Lưu ý: Đồ 2hand có thể có những lỗi nhỏ không đáng kể. Chúng
                  tôi đã cố gắng mô tả và chụp ảnh chi tiết nhất có thể. Vui
                  lòng xem kỹ trước khi quyết định mua. Màu sắc thực tế có thể
                  chênh lệch một chút do ánh sáng khi chụp.
                </p>
              </div> :

            <ProductReviews
              reviews={productReviews}
              rating={product.rating}
              reviewCount={product.reviewCount} />

            }
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 &&
        <section>
            <h2 className="text-2xl font-serif font-bold text-heading mb-8">
              Sản phẩm liên quan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) =>
            <ProductCard key={p.id} product={p} />
            )}
            </div>
          </section>
        }
      </div>
    </main>);

}
