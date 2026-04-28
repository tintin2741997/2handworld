import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import {
  CancelRequest,
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  Product
} from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  cancelRequests: CancelRequest[];
  products: Product[];
  createOrder: (
    items: OrderItem[],
    shippingInfo: any,
    paymentMethod: any,
    totalAmount: number,
    shippingFee: number
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => Promise<void>;
  submitCancelRequest: (orderId: string, reason: string) => Promise<void>;
  processCancelRequest: (
    requestId: string,
    status: 'approved' | 'rejected',
    adminReason?: string
  ) => Promise<void>;
  updateProductStock: (
    productId: string,
    quantityDelta: number,
    reason?: string
  ) => Promise<void>;
  refreshData: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [cancelRequests, setCancelRequests] = useState<CancelRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const refreshData = useCallback(async () => {
    const [nextProducts, nextOrders, nextCancelRequests] = await Promise.all([
      api.get<Product[]>('/products'),
      api.get<Order[]>('/orders').catch(() => []),
      api.get<CancelRequest[]>('/cancel-requests').catch(() => [])
    ]);
    setProducts(nextProducts);
    setOrders(nextOrders);
    setCancelRequests(nextCancelRequests);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData, user?.id]);

  const createOrder = async (
    items: OrderItem[],
    shippingInfo: any,
    paymentMethod: any,
    totalAmount: number,
    shippingFee: number
  ) => {
    try {
      const newOrder = await api.post<Order>('/orders', {
        items,
        shippingInfo,
        paymentMethod,
        totalAmount,
        shippingFee
      });
      setOrders((prev) => [newOrder, ...prev]);
      await refreshData();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi đặt hàng.'
      };
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const updatedOrder = await api.patch<Order>(`/orders/${orderId}/status`, {
      status
    });
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? updatedOrder : order))
    );
    await refreshData();
  };

  const updatePaymentStatus = async (
    orderId: string,
    status: PaymentStatus
  ) => {
    const updatedOrder = await api.patch<Order>(`/orders/${orderId}/payment`, {
      status
    });
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? updatedOrder : order))
    );
  };

  const submitCancelRequest = async (orderId: string, reason: string) => {
    await api.post('/cancel-requests', {
      orderId,
      reason
    });
    const nextCancelRequests = await api.get<CancelRequest[]>('/cancel-requests');
    setCancelRequests(nextCancelRequests);
  };

  const processCancelRequest = async (
    requestId: string,
    status: 'approved' | 'rejected',
    adminReason?: string
  ) => {
    await api.patch(`/cancel-requests/${requestId}/process`, {
      status,
      adminReason
    });
    await refreshData();
  };

  const updateProductStock = async (
    productId: string,
    quantityDelta: number,
    reason?: string
  ) => {
    await api.patch(`/inventory/${productId}`, {
      quantityDelta,
      reason
    });
    await refreshData();
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        cancelRequests,
        products,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        submitCancelRequest,
        processCancelRequest,
        updateProductStock,
        refreshData
      }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
