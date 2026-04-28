import React, { useEffect, useState } from 'react';
import {
  TrendingUpIcon,
  WalletIcon,
  ShoppingBagIcon,
  PercentIcon,
  CalendarIcon } from
'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer } from
'recharts';
import { formatPrice } from '../../utils/formatters';
import { AdminStats } from '../../types';
import { api } from '../../services/api';
export function RevenueReportPage() {
  const [dateRange, setDateRange] = useState('month');
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
  const [categoryRevenue, setCategoryRevenue] = useState<
    { name: string; orders: number; revenue: number; percent: number }[]
  >([]);

  useEffect(() => {
    api.get<AdminStats>('/reports/dashboard').then(setAdminStats).catch(() => {});
    api
      .get<{ month: string; revenue: number; profit: number; orderCount: number }[]>(
        '/reports/revenue'
      )
      .then(setMonthlyRevenue)
      .catch(() => setMonthlyRevenue([]));
    api
      .get<{ name: string; orders: number; revenue: number; percent: number }[]>(
        '/reports/categories'
      )
      .then(setCategoryRevenue)
      .catch(() => setCategoryRevenue([]));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-heading">
            Báo cáo doanh thu
          </h1>
          <p className="text-muted mt-1">
            Thống kê doanh thu, lợi nhuận và hiệu quả kinh doanh
          </p>
        </div>
        <div className="flex items-center bg-white rounded-lg border border-border p-1 shadow-sm">
          <button
            onClick={() => setDateRange('day')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${dateRange === 'day' ? 'bg-primary text-white' : 'text-muted hover:text-heading'}`}>
            
            Theo ngày
          </button>
          <button
            onClick={() => setDateRange('month')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${dateRange === 'month' ? 'bg-primary text-white' : 'text-muted hover:text-heading'}`}>
            
            Theo tháng
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-border shadow-warm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUpIcon className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-muted font-medium mb-1">Tổng doanh thu</p>
          <h3 className="text-2xl font-serif font-bold text-heading">
            {formatPrice(adminStats.revenue)}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-warm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success">
              <WalletIcon className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-muted font-medium mb-1">Tổng lợi nhuận</p>
          <h3 className="text-2xl font-serif font-bold text-heading">
            {formatPrice(adminStats.profit)}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-warm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <ShoppingBagIcon className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-muted font-medium mb-1">
            Tổng đơn thành công
          </p>
          <h3 className="text-2xl font-serif font-bold text-heading">
            {adminStats.totalOrders}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-warm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <PercentIcon className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-muted font-medium mb-1">
            Tỷ lệ thành công
          </p>
          <h3 className="text-2xl font-serif font-bold text-heading">92.5%</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-border shadow-warm">
          <h3 className="font-serif text-lg font-bold text-heading mb-6">
            Biểu đồ doanh thu
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyRevenue}
                margin={{
                  top: 10,
                  right: 10,
                  left: 20,
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
                  maxBarSize={50} />
                
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border shadow-warm">
          <h3 className="font-serif text-lg font-bold text-heading mb-6">
            Biểu đồ lợi nhuận
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyRevenue}
                margin={{
                  top: 10,
                  right: 10,
                  left: 20,
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
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #E8DDD0',
                    boxShadow: '0 4px 20px -2px rgba(45, 24, 16, 0.05)'
                  }} />
                
                <Line
                  type="monotone"
                  dataKey="profit"
                  name="Lợi nhuận"
                  stroke="#7B9E6B"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: '#7B9E6B',
                    strokeWidth: 2,
                    stroke: '#fff'
                  }}
                  activeDot={{
                    r: 6
                  }} />
                
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl border border-border shadow-warm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-serif text-lg font-bold text-heading">
            Doanh thu theo danh mục
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 text-muted text-sm border-b border-border">
                <th className="p-4 font-medium">Danh mục</th>
                <th className="p-4 font-medium text-center">Số đơn</th>
                <th className="p-4 font-medium text-right">Doanh thu</th>
                <th className="p-4 font-medium text-right">% Tổng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categoryRevenue.map((cat, idx) =>
              <tr
                key={idx}
                className="hover:bg-background/30 transition-colors">
                
                  <td className="p-4 font-medium text-heading">{cat.name}</td>
                  <td className="p-4 text-center text-body">{cat.orders}</td>
                  <td className="p-4 font-medium text-primary text-right">
                    {formatPrice(cat.revenue)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end">
                      <span className="text-sm text-muted mr-2">
                        {cat.percent}%
                      </span>
                      <div className="w-24 h-2 bg-background rounded-full overflow-hidden">
                        <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${cat.percent}%`
                        }}>
                      </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}
