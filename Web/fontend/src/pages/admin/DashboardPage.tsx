import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PackageIcon,
  TagIcon,
  FileTextIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
  WalletIcon,
  ArrowUpRightIcon,
  PlusIcon,
  EyeIcon,
  BoxesIcon } from
'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer } from
'recharts';
import { useOrder } from '../../contexts/OrderContext';
import { formatPrice } from '../../utils/formatters';
import { AdminStats } from '../../types';
import { api } from '../../services/api';
export function DashboardPage() {
  const { orders } = useOrder();
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalArticles: 0,
    totalOrders: 0,
    revenue: 0,
    profit: 0
  });
  const [monthlyRevenue, setMonthlyRevenue] = useState<
    { month: string; revenue: number; profit: number; orderCount: number }[]
  >([]);
  const recentOrders = orders.slice(0, 5);
  useEffect(() => {
    api.get<AdminStats>('/reports/dashboard').then(setAdminStats).catch(() => {});
    api
      .get<{ month: string; revenue: number; profit: number; orderCount: number }[]>(
        '/reports/revenue'
      )
      .then(setMonthlyRevenue)
      .catch(() => setMonthlyRevenue([]));
  }, []);
  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
            Chờ xác nhận
          </span>);

      case 'confirmed':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
            Đã xác nhận
          </span>);

      case 'shipping':
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
            Đang giao
          </span>);

      case 'completed':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
            Hoàn thành
          </span>);

      case 'cancelled':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
            Đã hủy
          </span>);

      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
            {status}
          </span>);

    }
  };
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-heading">
            Dashboard
          </h1>
          <p className="text-muted mt-1">Tổng quan hoạt động kinh doanh</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-muted">
            Cập nhật lần cuối: Hôm nay, 08:30
          </span>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-border shadow-warm flex items-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-6">
            <TrendingUpIcon className="w-7 h-7" />
          </div>
          <div>
            <p className="text-muted font-medium mb-1">Tổng doanh thu</p>
            <h3 className="text-3xl font-serif font-bold text-heading">
              {formatPrice(adminStats.revenue)}
            </h3>
            <p className="text-sm text-success flex items-center mt-2">
              <ArrowUpRightIcon className="w-4 h-4 mr-1" /> +12.5% so với tháng
              trước
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-warm flex items-center">
          <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center text-success mr-6">
            <WalletIcon className="w-7 h-7" />
          </div>
          <div>
            <p className="text-muted font-medium mb-1">Tổng lợi nhuận</p>
            <h3 className="text-3xl font-serif font-bold text-heading">
              {formatPrice(adminStats.profit)}
            </h3>
            <p className="text-sm text-success flex items-center mt-2">
              <ArrowUpRightIcon className="w-4 h-4 mr-1" /> +8.2% so với tháng
              trước
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-border shadow-warm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <PackageIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-success flex items-center">
              <ArrowUpRightIcon className="w-3 h-3 mr-0.5" /> 5%
            </span>
          </div>
          <h4 className="text-2xl font-serif font-bold text-heading mb-1">
            {adminStats.totalProducts}
          </h4>
          <p className="text-sm text-muted">Tổng sản phẩm</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-border shadow-warm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <TagIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-muted flex items-center">
              0%
            </span>
          </div>
          <h4 className="text-2xl font-serif font-bold text-heading mb-1">
            {adminStats.totalCategories}
          </h4>
          <p className="text-sm text-muted">Tổng danh mục</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-border shadow-warm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
              <FileTextIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-success flex items-center">
              <ArrowUpRightIcon className="w-3 h-3 mr-0.5" /> 2%
            </span>
          </div>
          <h4 className="text-2xl font-serif font-bold text-heading mb-1">
            {adminStats.totalArticles}
          </h4>
          <p className="text-sm text-muted">Tổng bài viết</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-border shadow-warm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <ShoppingBagIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-success flex items-center">
              <ArrowUpRightIcon className="w-3 h-3 mr-0.5" /> 18%
            </span>
          </div>
          <h4 className="text-2xl font-serif font-bold text-heading mb-1">
            {adminStats.totalOrders}
          </h4>
          <p className="text-sm text-muted">Tổng đơn hàng</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-border shadow-warm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-lg font-bold text-heading">
              Biểu đồ doanh thu 6 tháng
            </h3>
            <select className="text-sm border-border rounded-md text-muted focus:ring-primary focus:border-primary">
              <option>Năm nay</option>
              <option>Năm ngoái</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyRevenue}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 0
                }}>
                
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E8DDD0" />
                
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#8B7355',
                    fontSize: 12
                  }}
                  dy={10} />
                
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#8B7355',
                    fontSize: 12
                  }}
                  tickFormatter={(value) => `${value / 1000000}M`} />
                
                <Tooltip
                  formatter={(value: number) => formatPrice(value)}
                  cursor={{
                    fill: '#FDF8F0'
                  }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #E8DDD0',
                    boxShadow: '0 4px 20px -2px rgba(45, 24, 16, 0.05)'
                  }} />
                
                <Bar
                  dataKey="revenue"
                  name="Doanh thu"
                  fill="#C4704B"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40} />
                
                <Bar
                  dataKey="profit"
                  name="Lợi nhuận"
                  fill="#7B9E6B"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40} />
                
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Recent Orders */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-border shadow-warm">
            <h3 className="font-serif text-lg font-bold text-heading mb-4">
              Thao tác nhanh
            </h3>
            <div className="space-y-3">
              <Link
                to="/admin/san-pham"
                className="flex items-center p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors group">
                
                <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center mr-3 group-hover:bg-primary group-hover:text-white transition-colors">
                  <PlusIcon className="w-4 h-4" />
                </div>
                <span className="font-medium text-body group-hover:text-primary transition-colors">
                  Thêm sản phẩm mới
                </span>
              </Link>
              <Link
                to="/admin/don-hang"
                className="flex items-center p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors group">
                
                <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center mr-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <EyeIcon className="w-4 h-4" />
                </div>
                <span className="font-medium text-body group-hover:text-primary transition-colors">
                  Xem đơn hàng chờ xử lý
                </span>
              </Link>
              <Link
                to="/admin/ton-kho"
                className="flex items-center p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors group">
                
                <div className="w-8 h-8 rounded bg-orange-50 text-orange-600 flex items-center justify-center mr-3 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <BoxesIcon className="w-4 h-4" />
                </div>
                <span className="font-medium text-body group-hover:text-primary transition-colors">
                  Quản lý tồn kho
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-border shadow-warm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="font-serif text-lg font-bold text-heading">
            Đơn hàng gần đây
          </h3>
          <Link
            to="/admin/don-hang"
            className="text-sm font-medium text-primary hover:underline">
            
            Xem tất cả
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 text-muted text-sm border-b border-border">
                <th className="p-4 font-medium">Mã đơn</th>
                <th className="p-4 font-medium">Khách hàng</th>
                <th className="p-4 font-medium">Tổng tiền</th>
                <th className="p-4 font-medium">Trạng thái</th>
                <th className="p-4 font-medium">Ngày đặt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.map((order) =>
              <tr
                key={order.id}
                className="hover:bg-background/30 transition-colors">
                
                  <td className="p-4 font-medium text-heading">
                    {order.orderNumber}
                  </td>
                  <td className="p-4 text-body">
                    {order.shippingInfo.fullName}
                  </td>
                  <td className="p-4 font-medium text-primary">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="p-4">
                    {getOrderStatusBadge(order.orderStatus)}
                  </td>
                  <td className="p-4 text-sm text-muted">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}
