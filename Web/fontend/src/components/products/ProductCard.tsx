import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, ShoppingCartIcon } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/formatters';
interface ProductCardProps {
  product: Product;
}
export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cartItems } = useCart();
  const cartQuantity =
    cartItems.find((item) => item.product.id === product.id)?.quantity || 0;
  const remainingStock = Math.max(0, product.stock - cartQuantity);
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Như mới':
        return 'bg-success text-white';
      case 'Tốt':
        return 'bg-blue-500 text-white';
      case 'Khá':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-300 flex flex-col h-full border border-border/50">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link to={`/san-pham/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isSale && product.salePercent &&
          <span className="bg-sale text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
              -{product.salePercent}%
            </span>
          }
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {product.isNew &&
          <span className="bg-success text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
              Mới
            </span>
          }
        </div>

        {/* Quick Add Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            if (remainingStock > 0) {
              addToCart(product, 1).catch(() => undefined);
            }
          }}
          disabled={remainingStock <= 0}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-white text-heading font-medium px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 hover:bg-primary hover:text-white w-11/12 justify-center disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-white disabled:hover:text-heading">
          
          <ShoppingCartIcon className="w-4 h-4" />
          <span>Thêm vào giỏ</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span
            className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${getConditionColor(product.condition)}`}>
            
            {product.condition}
          </span>
          <div className="flex items-center text-muted text-xs">
            <StarIcon className="w-3 h-3 text-yellow-400 fill-current mr-1" />
            <span>
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        </div>

        <Link to={`/san-pham/${product.id}`} className="block mt-1 mb-1">
          <h3 className="font-serif font-semibold text-heading line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-muted mb-4 mt-auto">2HANDWORLD</p>

        <div className="flex items-baseline space-x-2 mt-auto pt-3 border-t border-border/50">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {product.isSale && product.originalPrice &&
          <span className="text-sm text-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
          }
        </div>
      </div>
    </div>);

}
