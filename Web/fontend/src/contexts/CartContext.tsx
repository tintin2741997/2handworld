import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import { CartItem, Product } from '../types';
import { api } from '../services/api';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    api.get<CartItem[]>('/cart').then(setCartItems).catch(() => setCartItems([]));
  }, []);

  const addToCart = async (product: Product, quantity: number) => {
    const nextCart = await api.post<CartItem[]>('/cart/items', {
      productId: product.id,
      quantity
    });
    setCartItems(nextCart);
  };

  const removeFromCart = async (productId: string) => {
    const nextCart = await api.delete<CartItem[]>(`/cart/items/${productId}`);
    setCartItems(nextCart);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    const nextCart = await api.put<CartItem[]>(`/cart/items/${productId}`, {
      quantity
    });
    setCartItems(nextCart);
  };

  const clearCart = async () => {
    const nextCart = await api.delete<CartItem[]>('/cart');
    setCartItems(nextCart);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount
      }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
