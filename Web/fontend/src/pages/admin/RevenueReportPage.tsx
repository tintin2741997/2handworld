import React, { useEffect, useState } from 'react';
import {
  PercentIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
  WalletIcon
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { formatPrice } from '../../utils/formatters';
import { AdminStats } from '../../types';
import { api } from '../../services/api';

type RevenuePoint = {
  month: string;
  revenue: number;
  profit: number;
  orderCount: number;
};

type CategoryRevenue = {
  name: string;
  orders: number;
  revenue: number;
  percent: number;
};

const emptyStats: AdminStats = {
  totalProducts: 0,
  totalCategories: 0,
  totalArticles: 0,
  totalOrders: 0,
  revenue: 0,
  profit: 0
};

export function RevenueReportPage() {
  const [dateRange, setDateRange] = useState<'day' | 'month'>('month');
  const [adminStats, setAdminStats] = useState<AdminStats>(emptyStats);
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
  const [categoryRevenue, setCategoryRevenue] = useState<CategoryRevenue[]>([]);

  useEffect(() => {
    api
      .get<RevenuePoint[]>(`/reports/revenue?range=${dateRange}`)
      .then((data) =>
        setRevenueData(
          data.map((item) => ({
            month: item.month,
            revenue: Number(item.revenue),
            profit: Number(item.profit),
            orderCount: Number(item.orderCount)
          }))
        )
      )
      .catch(() => setRevenueData([]));
  }, [dateRange]);

  useEffect(() => {
    api.get<AdminStats>('/reports/dashboard').then(setAdminStats).catch(() => {});
    api
      .get<CategoryRevenue[]>('/reports/categories')
      .then((data) =>
        setCategoryRevenue(
          data.map((item) => ({
            name: item.name,
            orders: Number(item.orders),
            revenue: Number(item.revenue),
            percent: Number(item.percent)
          }))
        )
      )
      .catch(() => setCategoryRevenue([]));
  }, []);

  const hasRevenueData = revenueData.length > 0;
  const rangeLabel = dateRange === 'day' ? 'theo ngày' : 'theo tháng';
  const rangeStats = revenueData.reduce(
    (totals, item) => ({
      revenue: totals.revenue + item.revenue,
      profit: totals.profit + item.profit,
      orderCount: totals.orderCount + item.orderCount
    }),
    { revenue: 0, profit: 0, orderCount: 0 }
  );
  const summaryRevenue = hasRevenueData ? rangeStats.revenue : adminStats.revenue;
  const summaryProfit = hasRevenueData ? rangeStats.profit : adminStats.profit;
  const summaryOrders = hasRevenueData ? rangeStats.orderCount : adminStats.totalOrders;

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          icon={<TrendingUpIcon className="w-6 h-6" />}
          label={`Doanh thu ${rangeLabel}`}
          value={formatPrice(summaryRevenue)}
          colorClass="bg-primary/10 text-primary"
        />
        <SummaryCard
          icon={<WalletIcon className="w-6 h-6" />}
          label={`Lợi nhuận ${rangeLabel}`}
          value={formatPrice(summaryProfit)}
          colorClass="bg-success/10 text-success"
        />
        <SummaryCard
          icon={<ShoppingBagIcon className="w-6 h-6" />}
          label={`Đơn thành công ${rangeLabel}`}
          value={String(summaryOrders)}
          colorClass="bg-blue-50 text-blue-600"
        />
        <SummaryCard
          icon={<PercentIcon className="w-6 h-6" />}
          label="Tỷ lệ thành công"
          value="92.5%"
          colorClass="bg-purple-50 text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-border shadow-warm">
          <h3 className="font-serif text-lg font-bold text-heading mb-6">
            Biểu đồ doanh thu {rangeLabel}
          </h3>
          <div className="h-80 w-full">
            {!hasRevenueData ? (
              <EmptyChart message="Chưa có dữ liệu doanh thu trong khoảng thời gian này." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DDD0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#8B7355', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#8B7355', fontSize: 12 }}
                    tickFormatter={(value) => `${Number(value) / 1000000}M`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatPrice(Number(value))}
                    cursor={{ fill: '#FDF8F0' }}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #E8DDD0',
                      boxShadow: '0 4px 20px -2px rgba(45, 24, 16, 0.05)'
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    name="Doanh thu"
                    fill="#C4704B"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border shadow-warm">
          <h3 className="font-serif text-lg font-bold text-heading mb-6">
            Biểu đồ lợi nhuận {rangeLabel}
          </h3>
          <div className="h-80 w-full">
            {!hasRevenueData ? (
              <EmptyChart message="Chưa có dữ liệu lợi nhuận trong khoảng thời gian này." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DDD0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#8B7355', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#8B7355', fontSize: 12 }}
                    tickFormatter={(value) => `${Number(value) / 1000000}M`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatPrice(Number(value))}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #E8DDD0',
                      boxShadow: '0 4px 20px -2px rgba(45, 24, 16, 0.05)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    name="Lợi nhuận"
                    stroke="#7B9E6B"
                    strokeWidth={3}
                    connectNulls
                    dot={{ r: 4, fill: '#7B9E6B', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

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
              {categoryRevenue.map((cat) => (
                <tr key={cat.name} className="hover:bg-background/30 transition-colors">
                  <td className="p-4 font-medium text-heading">{cat.name}</td>
                  <td className="p-4 text-center text-body">{cat.orders}</td>
                  <td className="p-4 font-medium text-primary text-right">
                    {formatPrice(cat.revenue)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end">
                      <span className="text-sm text-muted mr-2">{cat.percent}%</span>
                      <div className="w-24 h-2 bg-background rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${cat.percent}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  colorClass
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  colorClass: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-border shadow-warm">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
          {icon}
        </div>
      </div>
      <p className="text-sm text-muted font-medium mb-1">{label}</p>
      <h3 className="text-2xl font-serif font-bold text-heading">{value}</h3>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="h-full flex items-center justify-center text-sm text-muted">
      {message}
    </div>
  );
}
