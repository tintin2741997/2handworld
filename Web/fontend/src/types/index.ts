export type Condition = 'Như mới' | 'Tốt' | 'Khá' | 'Trung bình';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  categoryName?: string;
  store: string;
  condition: Condition;
  description: string;
  stock: number;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isSale: boolean;
  salePercent?: number;
  status?: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface OrderInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  note: string;
}

export type PaymentMethod = 'cod' | 'bank_transfer' | 'momo' | 'vnpay';

// --- NEW TYPES ---

export type OrderStatus =
'pending' |
'confirmed' |
'shipping' |
'completed' |
'cancelled' |
'failed_delivery' |
'returned' |
'rejected';
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  condition: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  items: OrderItem[];
  shippingInfo: OrderInfo;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  totalAmount: number;
  shippingFee: number;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface CancelRequest {
  id: string;
  orderId: string;
  reason: string;
  adminReason?: string;
  status: 'pending' | 'approved' | 'rejected';
  contactedBuyer: boolean;
  createdAt: string;
}

export type UserStatus = 'normal' | 'vip' | 'blacklisted';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  status: UserStatus;
  role?: 'admin' | 'buyer';
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  blacklistReason?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: 'news' | 'about' | 'policy' | 'contact' | 'faq';
  createdAt: string;
  isPublished: boolean;
}

export interface InventoryItem {
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  stock: number;
  lowStockThreshold: number;
  lastUpdated: string;
}

export interface AdminStats {
  totalProducts: number;
  totalCategories: number;
  totalArticles: number;
  totalOrders: number;
  revenue: number;
  profit: number;
}
