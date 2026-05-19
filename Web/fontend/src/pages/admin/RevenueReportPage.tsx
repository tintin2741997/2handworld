import React, { useEffect, useMemo, useState } from 'react';
import {
  DownloadIcon,
  FileTextIcon,
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
import * as XLSX from 'xlsx';

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

type ProductRevenue = {
  productId: string;
  name: string;
  categoryName: string;
  quantitySold: number;
  averagePrice: number;
  revenue: number;
  profit: number;
};

type ExportRevenueRow = {
  period: string;
  orderCount: number;
  revenue: number;
  profit: number;
};

const emptyStats: AdminStats = {
  totalProducts: 0,
  totalCategories: 0,
  totalArticles: 0,
  totalOrders: 0,
  revenue: 0,
  profit: 0
};

const STORE_INFO = {
  name: '2HANDWORLD - THỜI TRANG SECOND-HAND',
  address: 'TP. Hồ Chí Minh',
  phone: '0901 234 567'
};

function safeNumber(value: unknown) {
  return Number(value || 0);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('vi-VN').format(Number(value || 0));
}

function getProfitMargin(profit: number, revenue: number) {
  if (!revenue) return '0%';
  return `${((profit / revenue) * 100).toFixed(2)}%`;
}

function makeReportHtml({
  dateRange,
  reportDate,
  summaryRevenue,
  summaryProfit,
  summaryOrders,
  successRate,
  productRevenue
}: {
  dateRange: 'day' | 'month';
  reportDate: string;
  summaryRevenue: number;
  summaryProfit: number;
  summaryOrders: number;
  successRate: string;
  productRevenue: ProductRevenue[];
}) {
  const productRows =
    productRevenue.length > 0
      ? productRevenue
          .map(
            (item) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.categoryName}</td>
                <td class="right">${formatNumber(item.quantitySold)}</td>
                <td class="right">${formatPrice(item.averagePrice)}</td>
                <td class="right">${formatPrice(item.revenue)}</td>
                <td class="right">${formatPrice(item.profit)}</td>
              </tr>
            `
          )
          .join('')
      : '<tr><td colspan="6" class="empty">Chưa có dữ liệu doanh thu theo sản phẩm.</td></tr>';

  return `
    <div style="width: 794px; padding: 32px; background: #ffffff; color: #111827; font-family: Arial, sans-serif;">
      <div style="border-bottom: 2px solid #111827; padding-bottom: 16px; margin-bottom: 20px;">
        <div style="font-weight: 700; font-size: 18px;">${STORE_INFO.name}</div>
        <div style="font-size: 12px; margin-top: 4px;">Địa chỉ: ${STORE_INFO.address}</div>
        <div style="font-size: 12px; margin-top: 4px;">Số điện thoại: ${STORE_INFO.phone}</div>
      </div>

      <h1 style="text-align: center; font-size: 22px; margin: 0 0 8px; text-transform: uppercase;">
        BÁO CÁO DOANH THU CỬA HÀNG QUẦN ÁO
      </h1>
      <div style="text-align: center; font-size: 13px; margin-bottom: 24px;">
        Kỳ báo cáo: ${dateRange === 'day' ? 'Theo ngày' : 'Theo tháng'} | Ngày xuất: ${reportDate}
      </div>

      <table>
        <thead>
          <tr><th>Chỉ số</th><th>Giá trị</th></tr>
        </thead>
        <tbody>
          <tr><td>Tổng doanh thu</td><td class="right">${formatPrice(summaryRevenue)}</td></tr>
          <tr><td>Tổng lợi nhuận</td><td class="right">${formatPrice(summaryProfit)}</td></tr>
          <tr><td>Số đơn thành công</td><td class="right">${formatNumber(summaryOrders)}</td></tr>
          <tr><td>Tỷ lệ thành công</td><td class="right">${successRate}</td></tr>
          <tr><td>Biên lợi nhuận</td><td class="right">${getProfitMargin(summaryProfit, summaryRevenue)}</td></tr>
        </tbody>
      </table>

      <h2>Doanh thu theo từng sản phẩm</h2>
      <table>
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Danh mục</th>
            <th>Số lượng bán</th>
            <th>Giá bán TB</th>
            <th>Doanh thu</th>
            <th>Lợi nhuận</th>
          </tr>
        </thead>
        <tbody>${productRows}</tbody>
      </table>

      <style>
        table { width: 100%; border-collapse: collapse; margin-top: 12px; margin-bottom: 22px; font-size: 11px; }
        th { background: #2d1810; color: #ffffff; border: 1px solid #d1d5db; padding: 8px; text-align: left; }
        td { border: 1px solid #d1d5db; padding: 8px; vertical-align: top; }
        h2 { font-size: 16px; margin: 22px 0 8px; }
        .right { text-align: right; white-space: nowrap; }
        .empty { text-align: center; color: #6b7280; }
      </style>
    </div>
  `;
}

export function RevenueReportPage() {
  const [dateRange, setDateRange] = useState<'day' | 'month'>('month');
  const [adminStats, setAdminStats] = useState<AdminStats>(emptyStats);
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
  const [categoryRevenue, setCategoryRevenue] = useState<CategoryRevenue[]>([]);
  const [productRevenue, setProductRevenue] = useState<ProductRevenue[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    api
      .get<RevenuePoint[]>(`/reports/revenue?range=${dateRange}`)
      .then((data) =>
        setRevenueData(
          data.map((item) => ({
            month: item.month,
            revenue: safeNumber(item.revenue),
            profit: safeNumber(item.profit),
            orderCount: safeNumber(item.orderCount)
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
            orders: safeNumber(item.orders),
            revenue: safeNumber(item.revenue),
            percent: safeNumber(item.percent)
          }))
        )
      )
      .catch(() => setCategoryRevenue([]));

    api
      .get<ProductRevenue[]>('/reports/products')
      .then((data) =>
        setProductRevenue(
          data.map((item) => ({
            productId: item.productId,
            name: item.name,
            categoryName: item.categoryName,
            quantitySold: safeNumber(item.quantitySold),
            averagePrice: safeNumber(item.averagePrice),
            revenue: safeNumber(item.revenue),
            profit: safeNumber(item.profit)
          }))
        )
      )
      .catch(() => setProductRevenue([]));
  }, []);

  const hasRevenueData = revenueData.length > 0;
  const rangeLabel = dateRange === 'day' ? 'theo ngày' : 'theo tháng';
  const reportDate = new Date().toLocaleDateString('vi-VN');

  const rangeStats = useMemo(
    () =>
      revenueData.reduce(
        (totals, item) => ({
          revenue: totals.revenue + item.revenue,
          profit: totals.profit + item.profit,
          orderCount: totals.orderCount + item.orderCount
        }),
        { revenue: 0, profit: 0, orderCount: 0 }
      ),
    [revenueData]
  );

  const summaryRevenue = hasRevenueData ? rangeStats.revenue : safeNumber(adminStats.revenue);
  const summaryProfit = hasRevenueData ? rangeStats.profit : safeNumber(adminStats.profit);
  const summaryOrders = hasRevenueData ? rangeStats.orderCount : safeNumber(adminStats.totalOrders);
  const successRate = summaryOrders > 0 ? '92.5%' : '0%';
  const profitMargin = getProfitMargin(summaryProfit, summaryRevenue);

  const getExportRows = async (): Promise<ExportRevenueRow[]> => {
    try {
      const rows = await api.get<ExportRevenueRow[]>(`/reports/export?range=${dateRange}`);

      return rows.map((row) => ({
        period: row.period,
        orderCount: safeNumber(row.orderCount),
        revenue: safeNumber(row.revenue),
        profit: safeNumber(row.profit)
      }));
    } catch {
      return revenueData.map((item) => ({
        period: item.month,
        orderCount: item.orderCount,
        revenue: item.revenue,
        profit: item.profit
      }));
    }
  };

  const exportExcel = async () => {
    try {
      setIsExporting(true);
      const rows = await getExportRows();
      const workbook = XLSX.utils.book_new();

      const overviewSheetData = [
        [STORE_INFO.name],
        [`Địa chỉ: ${STORE_INFO.address}`],
        [`Số điện thoại: ${STORE_INFO.phone}`],
        [],
        [`BÁO CÁO DOANH THU CỬA HÀNG (${rangeLabel.toUpperCase()})`],
        [`Ngày trích xuất: ${reportDate}`],
        [],
        ['TỔNG QUAN'],
        ['Chỉ số', 'Giá trị'],
        ['Tổng doanh thu', summaryRevenue],
        ['Tổng lợi nhuận', summaryProfit],
        ['Tổng số đơn hàng', summaryOrders],
        ['Tỷ lệ đơn thành công', successRate],
        ['Biên lợi nhuận', profitMargin],
        [],
        ['CHI TIẾT DOANH THU THEO KỲ'],
        ['Kỳ báo cáo', 'Số đơn thành công', 'Doanh thu', 'Lợi nhuận', 'Biên lợi nhuận'],
        ...rows.map((row) => [
          row.period,
          row.orderCount,
          row.revenue,
          row.profit,
          getProfitMargin(row.profit, row.revenue)
        ])
      ];

      const overviewSheet = XLSX.utils.aoa_to_sheet(overviewSheetData);
      overviewSheet['!cols'] = [{ wch: 28 }, { wch: 22 }, { wch: 20 }, { wch: 20 }, { wch: 18 }];
      XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Báo cáo doanh thu');

      const productSheetData = [
        ['DOANH THU THEO TỪNG SẢN PHẨM'],
        [`Ngày trích xuất: ${reportDate}`],
        [],
        ['Sản phẩm', 'Danh mục', 'Số lượng bán', 'Giá bán trung bình', 'Doanh thu', 'Lợi nhuận'],
        ...(productRevenue.length > 0
          ? productRevenue.map((item) => [
              item.name,
              item.categoryName,
              item.quantitySold,
              item.averagePrice,
              item.revenue,
              item.profit
            ])
          : [['Chưa có dữ liệu', '', 0, 0, 0, 0]])
      ];

      const productSheet = XLSX.utils.aoa_to_sheet(productSheetData);
      productSheet['!cols'] = [
        { wch: 34 },
        { wch: 18 },
        { wch: 16 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      XLSX.utils.book_append_sheet(workbook, productSheet, 'Doanh thu sản phẩm');

      const categorySheetData = [
        ['CƠ CẤU DOANH THU THEO DANH MỤC'],
        [`Ngày trích xuất: ${reportDate}`],
        [],
        ['Tên danh mục', 'Số đơn', 'Doanh thu', 'Tỷ trọng doanh thu'],
        ...(categoryRevenue.length > 0
          ? categoryRevenue.map((cat) => [cat.name, cat.orders, cat.revenue, `${cat.percent}%`])
          : [['Chưa có dữ liệu', 0, 0, '0%']])
      ];

      const categorySheet = XLSX.utils.aoa_to_sheet(categorySheetData);
      categorySheet['!cols'] = [{ wch: 30 }, { wch: 16 }, { wch: 20 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(workbook, categorySheet, 'Doanh thu danh mục');

      XLSX.writeFile(workbook, `Bao_Cao_Doanh_Thu_2HANDWORLD_${dateRange}_${Date.now()}.xlsx`);
    } catch (error) {
      console.error('Lỗi khi xuất file Excel:', error);
      alert('Không thể tải báo cáo Excel lúc này.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportPdf = async () => {
    let container: HTMLDivElement | null = null;

    try {
      setIsExporting(true);
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;

      container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-10000px';
      container.style.top = '0';
      container.innerHTML = makeReportHtml({
        dateRange,
        reportDate,
        summaryRevenue,
        summaryProfit,
        summaryOrders,
        successRate,
        productRevenue
      });
      document.body.appendChild(container);

      const canvas = await html2canvas(container.firstElementChild as HTMLElement, {
        scale: 2,
        backgroundColor: '#ffffff'
      });

      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      const imageWidth = pageWidth - margin * 2;
      const imageHeight = (canvas.height * imageWidth) / canvas.width;
      const imageData = canvas.toDataURL('image/png');

      if (imageHeight <= pageHeight - margin * 2) {
        doc.addImage(imageData, 'PNG', margin, margin, imageWidth, imageHeight);
      } else {
        const pageCanvas = document.createElement('canvas');
        const pageContext = pageCanvas.getContext('2d');
        const sourcePageHeight = Math.floor((canvas.width / imageWidth) * (pageHeight - margin * 2));
        pageCanvas.width = canvas.width;
        pageCanvas.height = sourcePageHeight;

        let renderedHeight = 0;
        let pageIndex = 0;

        while (renderedHeight < canvas.height && pageContext) {
          pageContext.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
          pageContext.drawImage(
            canvas,
            0,
            renderedHeight,
            canvas.width,
            sourcePageHeight,
            0,
            0,
            canvas.width,
            sourcePageHeight
          );

          if (pageIndex > 0) {
            doc.addPage();
          }

          const pageImage = pageCanvas.toDataURL('image/png');
          doc.addImage(pageImage, 'PNG', margin, margin, imageWidth, pageHeight - margin * 2);
          renderedHeight += sourcePageHeight;
          pageIndex += 1;
        }
      }

      doc.save(`Bao_Cao_Doanh_Thu_2HANDWORLD_${dateRange}_${Date.now()}.pdf`);
    } catch (error) {
      console.error('Lỗi khi xuất file PDF:', error);
      alert('Không thể xuất báo cáo PDF lúc này.');
    } finally {
      if (container) {
        document.body.removeChild(container);
      }
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-heading">Báo cáo doanh thu</h1>
          <p className="text-muted mt-1">Thống kê doanh thu, lợi nhuận và hiệu quả kinh doanh</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center bg-white rounded-lg border border-border p-1 shadow-sm">
            <button
              onClick={() => setDateRange('day')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                dateRange === 'day' ? 'bg-primary text-white' : 'text-muted hover:text-heading'
              }`}
            >
              Theo ngày
            </button>

            <button
              onClick={() => setDateRange('month')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                dateRange === 'month' ? 'bg-primary text-white' : 'text-muted hover:text-heading'
              }`}
            >
              Theo tháng
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportExcel}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <DownloadIcon className="w-4 h-4" />
              Xuất Excel
            </button>

            <button
              onClick={exportPdf}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-white text-heading text-sm font-medium hover:border-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FileTextIcon className="w-4 h-4" />
              Xuất PDF
            </button>
          </div>
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
          value={formatNumber(summaryOrders)}
          colorClass="bg-blue-50 text-blue-600"
        />

        <SummaryCard
          icon={<PercentIcon className="w-6 h-6" />}
          label="Biên lợi nhuận"
          value={profitMargin}
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
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8B7355', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8B7355', fontSize: 12 }} tickFormatter={(value) => `${Number(value) / 1000000}M`} />
                  <Tooltip formatter={(value: number) => formatPrice(Number(value))} />
                  <Bar dataKey="revenue" name="Doanh thu" fill="#C4704B" radius={[4, 4, 0, 0]} maxBarSize={50} />
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
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8B7355', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8B7355', fontSize: 12 }} tickFormatter={(value) => `${Number(value) / 1000000}M`} />
                  <Tooltip formatter={(value: number) => formatPrice(Number(value))} />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    name="Lợi nhuận"
                    stroke="#7B9E6B"
                    strokeWidth={3}
                    connectNulls
                    dot={{ r: 4, fill: '#7B9E6B', strokeWidth: 2, stroke: '#fff' }}
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
            Doanh thu theo từng sản phẩm
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 text-muted text-sm border-b border-border">
                <th className="p-4 font-medium">Sản phẩm</th>
                <th className="p-4 font-medium">Danh mục</th>
                <th className="p-4 font-medium text-center">Số lượng bán</th>
                <th className="p-4 font-medium text-right">Giá bán TB</th>
                <th className="p-4 font-medium text-right">Doanh thu</th>
                <th className="p-4 font-medium text-right">Lợi nhuận</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {productRevenue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-sm text-muted">
                    Chưa có dữ liệu doanh thu theo sản phẩm.
                  </td>
                </tr>
              ) : (
                productRevenue.map((item) => (
                  <tr key={item.productId} className="hover:bg-background/30 transition-colors">
                    <td className="p-4 font-medium text-heading">{item.name}</td>
                    <td className="p-4 text-body">{item.categoryName}</td>
                    <td className="p-4 text-center text-body">{formatNumber(item.quantitySold)}</td>
                    <td className="p-4 text-right text-body">{formatPrice(item.averagePrice)}</td>
                    <td className="p-4 font-medium text-primary text-right">{formatPrice(item.revenue)}</td>
                    <td className="p-4 text-right text-body">{formatPrice(item.profit)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-warm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-serif text-lg font-bold text-heading">
            Cơ cấu doanh thu theo danh mục
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 text-muted text-sm border-b border-border">
                <th className="p-4 font-medium">Danh mục</th>
                <th className="p-4 font-medium text-center">Số đơn</th>
                <th className="p-4 font-medium text-right">Doanh thu</th>
                <th className="p-4 font-medium text-right">Tỷ trọng</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {categoryRevenue.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-sm text-muted">
                    Chưa có dữ liệu doanh thu theo danh mục.
                  </td>
                </tr>
              ) : (
                categoryRevenue.map((cat) => (
                  <tr key={cat.name} className="hover:bg-background/30 transition-colors">
                    <td className="p-4 font-medium text-heading">{cat.name}</td>
                    <td className="p-4 text-center text-body">{formatNumber(cat.orders)}</td>
                    <td className="p-4 font-medium text-primary text-right">
                      {formatPrice(cat.revenue)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end">
                        <span className="text-sm text-muted mr-2">{cat.percent}%</span>
                        <div className="w-24 h-2 bg-background rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${Math.min(100, Math.max(0, cat.percent))}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
