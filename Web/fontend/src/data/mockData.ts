import {
  Category,
  Product,
  Store,
  Review,
  Order,
  User,
  Article,
  CancelRequest,
  AdminStats } from
'../types';

export const categories: Category[] = [
{ id: 'c1', name: 'Áo', slug: 'ao', icon: 'ShirtIcon', productCount: 124 },
{ id: 'c2', name: 'Quần', slug: 'quan', icon: 'BoxIcon', productCount: 85 },
{
  id: 'c3',
  name: 'Váy/Đầm',
  slug: 'vay-dam',
  icon: 'SparklesIcon',
  productCount: 92
},
{
  id: 'c4',
  name: 'Giày dép',
  slug: 'giay-dep',
  icon: 'FootprintsIcon',
  productCount: 45
},
{
  id: 'c5',
  name: 'Túi xách',
  slug: 'tui-xach',
  icon: 'BriefcaseIcon',
  productCount: 67
},
{
  id: 'c6',
  name: 'Phụ kiện',
  slug: 'phu-kien',
  icon: 'WatchIcon',
  productCount: 110
}];


export const stores: Store[] = [
{
  id: 's1',
  name: 'Chi nhánh Quận 1',
  address: '123 Nguyễn Trãi, Q.1, TP.HCM',
  phone: '0901234567',
  image: 'https://picsum.photos/seed/store1/400/300'
},
{
  id: 's2',
  name: 'Chi nhánh Quận 3',
  address: '456 Lê Văn Sỹ, Q.3, TP.HCM',
  phone: '0902345678',
  image: 'https://picsum.photos/seed/store2/400/300'
},
{
  id: 's3',
  name: 'Chi nhánh Thủ Đức',
  address: '789 Võ Văn Ngân, TP.Thủ Đức',
  phone: '0903456789',
  image: 'https://picsum.photos/seed/store3/400/300'
}];


export const products: Product[] = [
{
  id: 'p1',
  name: 'Áo Sơ Mi Linen Trắng Vintage',
  price: 150000,
  originalPrice: 250000,
  images: [
  'https://picsum.photos/seed/shirt1/600/600',
  'https://picsum.photos/seed/shirt1b/600/600'],

  category: 'c1',
  store: 's1',
  condition: 'Như mới',
  description:
  'Áo sơ mi linen chất liệu thoáng mát, phong cách vintage thanh lịch. Phù hợp mặc đi làm hoặc đi chơi. Không xù lông, màu trắng ngà tự nhiên.',
  stock: 2,
  rating: 4.8,
  reviewCount: 12,
  isNew: true,
  isSale: true,
  salePercent: 40,
  createdAt: '2023-10-01T00:00:00Z'
},
{
  id: 'p2',
  name: "Quần Jeans Levi's 501 Xanh Đậm",
  price: 350000,
  images: [
  'https://picsum.photos/seed/jeans1/600/600',
  'https://picsum.photos/seed/jeans1b/600/600'],

  category: 'c2',
  store: 's2',
  condition: 'Tốt',
  description:
  "Quần jeans Levi's chính hãng độ mới 90%. Form đứng chuẩn, màu xanh đậm dễ phối đồ. Có một vết sờn nhẹ ở gấu quần tạo phong cách bụi bặm.",
  stock: 1,
  rating: 4.5,
  reviewCount: 8,
  isNew: false,
  isSale: false,
  createdAt: '2023-09-15T00:00:00Z'
},
{
  id: 'p3',
  name: 'Đầm Hoa Nhí Dáng Dài Mùa Thu',
  price: 180000,
  originalPrice: 220000,
  images: ['https://picsum.photos/seed/dress1/600/600'],
  category: 'c3',
  store: 's1',
  condition: 'Như mới',
  description:
  'Đầm hoa nhí phong cách Hàn Quốc, chất voan lụa mềm mại có lớp lót. Mặc cực kỳ tôn dáng và nữ tính.',
  stock: 3,
  rating: 5.0,
  reviewCount: 5,
  isNew: true,
  isSale: true,
  salePercent: 18,
  createdAt: '2023-10-10T00:00:00Z'
},
{
  id: 'p4',
  name: 'Túi Xách Da Thật Đeo Chéo Retro',
  price: 450000,
  images: [
  'https://picsum.photos/seed/bag1/600/600',
  'https://picsum.photos/seed/bag1b/600/600'],

  category: 'c5',
  store: 's3',
  condition: 'Khá',
  description:
  'Túi xách da bò thật 100%, màu nâu bò vintage. Da đã lên nước bóng đẹp. Phụ kiện đồng thau nguyên bản. Có xước nhẹ ở mặt sau.',
  stock: 1,
  rating: 4.2,
  reviewCount: 15,
  isNew: false,
  isSale: false,
  createdAt: '2023-08-20T00:00:00Z'
},
{
  id: 'p5',
  name: 'Áo Khoác Blazer Kẻ Caro Oversize',
  price: 220000,
  originalPrice: 300000,
  images: ['https://picsum.photos/seed/blazer1/600/600'],
  category: 'c1',
  store: 's2',
  condition: 'Tốt',
  description:
  'Blazer form rộng phong cách menswear. Họa tiết kẻ caro nâu tây dễ phối. Lớp lót trong còn nguyên vẹn, vai áo đứng form.',
  stock: 1,
  rating: 4.7,
  reviewCount: 9,
  isNew: true,
  isSale: true,
  salePercent: 26,
  createdAt: '2023-10-12T00:00:00Z'
},
{
  id: 'p6',
  name: 'Giày Oxford Da Nữ Cổ Điển',
  price: 280000,
  images: ['https://picsum.photos/seed/shoes1/600/600'],
  category: 'c4',
  store: 's1',
  condition: 'Trung bình',
  description:
  'Giày oxford da màu nâu đậm, size 37. Đế gỗ còn chắc chắn, da có nếp nhăn tự nhiên do sử dụng. Đã được vệ sinh và đánh xi cẩn thận.',
  stock: 1,
  rating: 4.0,
  reviewCount: 4,
  isNew: false,
  isSale: false,
  createdAt: '2023-07-11T00:00:00Z'
},
{
  id: 'p7',
  name: 'Chân Váy Midi Xếp Ly Màu Be',
  price: 120000,
  images: ['https://picsum.photos/seed/skirt1/600/600'],
  category: 'c3',
  store: 's3',
  condition: 'Như mới',
  description:
  'Chân váy xếp ly dáng dài qua gối, cạp chun co giãn thoải mái. Màu be nhã nhặn, dễ mix cùng áo thun hoặc sơ mi.',
  stock: 4,
  rating: 4.9,
  reviewCount: 22,
  isNew: true,
  isSale: false,
  createdAt: '2023-10-14T00:00:00Z'
},
{
  id: 'p8',
  name: 'Đồng Hồ Dây Da Mặt Vuông Vintage',
  price: 320000,
  originalPrice: 400000,
  images: ['https://picsum.photos/seed/watch1/600/600'],
  category: 'c6',
  store: 's2',
  condition: 'Tốt',
  description:
  'Đồng hồ nữ mặt vuông mạ vàng hồng, dây da nâu thay mới. Máy quartz Nhật chạy chuẩn giờ. Mặt kính không trầy xước.',
  stock: 1,
  rating: 4.6,
  reviewCount: 7,
  isNew: false,
  isSale: true,
  salePercent: 20,
  createdAt: '2023-09-05T00:00:00Z'
}];


export const reviews: Review[] = [
{
  id: 'r1',
  productId: 'p1',
  userName: 'Nguyễn Thị Mai',
  rating: 5,
  comment:
  'Áo rất đẹp, chất vải mát, đóng gói cẩn thận và thơm. Sẽ ủng hộ shop tiếp!',
  createdAt: '2023-10-05T10:30:00Z'
},
{
  id: 'r2',
  productId: 'p1',
  userName: 'Trần Văn Hùng',
  rating: 4,
  comment:
  'Form áo hơi rộng so với mình nghĩ nhưng mặc kiểu oversize cũng ổn. Chất lượng tốt so với giá.',
  createdAt: '2023-10-08T14:15:00Z'
},
{
  id: 'r3',
  productId: 'p2',
  userName: 'Lê Hoàng Anh',
  rating: 5,
  comment:
  'Quần chuẩn auth, màu xanh wash rất đẹp. Tìm mãi mới được chiếc 501 ưng ý thế này.',
  createdAt: '2023-09-20T09:00:00Z'
},
{
  id: 'r4',
  productId: 'p4',
  userName: 'Phạm Thu Thảo',
  rating: 4,
  comment:
  'Túi da thật nên cầm rất thích tay, tuy có xước nhẹ như shop mô tả nhưng nhìn tổng thể vẫn rất vintage.',
  createdAt: '2023-08-25T16:45:00Z'
},
{
  id: 'r5',
  productId: 'p7',
  userName: 'Đinh Ngọc Diệp',
  rating: 5,
  comment: 'Váy xếp ly giữ nếp rất tốt, màu be dễ phối đồ. Giao hàng nhanh.',
  createdAt: '2023-10-15T11:20:00Z'
}];


// --- NEW MOCK DATA ---

export const users: User[] = [
{
  id: 'u1',
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@gmail.com',
  phone: '0901112222',
  address: '123 Lê Lợi, Q.1, TP.HCM',
  status: 'normal',
  totalOrders: 2,
  totalSpent: 450000,
  createdAt: '2023-01-15T00:00:00Z'
},
{
  id: 'u2',
  name: 'Trần Thị B',
  email: 'tranthib@gmail.com',
  phone: '0903334444',
  address: '456 Nguyễn Huệ, Q.1, TP.HCM',
  status: 'vip',
  totalOrders: 15,
  totalSpent: 5200000,
  createdAt: '2022-11-20T00:00:00Z'
},
{
  id: 'u3',
  name: 'Lê Hoàng C',
  email: 'lehoangc@gmail.com',
  phone: '0905556666',
  status: 'blacklisted',
  totalOrders: 5,
  totalSpent: 1200000,
  createdAt: '2023-05-10T00:00:00Z',
  blacklistReason: 'Bom hàng 3 lần liên tiếp'
},
{
  id: 'u4',
  name: 'Phạm Thu D',
  email: 'phamthud@gmail.com',
  phone: '0907778888',
  address: '789 Võ Văn Tần, Q.3, TP.HCM',
  status: 'normal',
  totalOrders: 1,
  totalSpent: 150000,
  createdAt: '2023-10-01T00:00:00Z'
},
{
  id: 'u5',
  name: 'Hoàng Minh E',
  email: 'hoangminhe@gmail.com',
  phone: '0909990000',
  status: 'vip',
  totalOrders: 8,
  totalSpent: 3400000,
  createdAt: '2023-02-28T00:00:00Z'
}];


export const orders: Order[] = [
{
  id: 'o1',
  orderNumber: 'ORD-20231025-01',
  userId: 'u1',
  items: [
  {
    productId: 'p1',
    productName: 'Áo Sơ Mi Linen Trắng Vintage',
    productImage: 'https://picsum.photos/seed/shirt1/600/600',
    price: 150000,
    quantity: 1,
    condition: 'Như mới'
  }],

  shippingInfo: {
    fullName: 'Nguyễn Văn A',
    phone: '0901112222',
    email: 'nguyenvana@gmail.com',
    address: '123 Lê Lợi',
    city: 'hcm',
    district: 'q1',
    ward: 'p1',
    note: 'Giao giờ hành chính'
  },
  paymentMethod: 'cod',
  paymentStatus: 'unpaid',
  orderStatus: 'pending',
  totalAmount: 180000,
  shippingFee: 30000,
  note: '',
  createdAt: '2023-10-25T08:30:00Z',
  updatedAt: '2023-10-25T08:30:00Z'
},
{
  id: 'o2',
  orderNumber: 'ORD-20231024-05',
  userId: 'u2',
  items: [
  {
    productId: 'p2',
    productName: "Quần Jeans Levi's 501 Xanh Đậm",
    productImage: 'https://picsum.photos/seed/jeans1/600/600',
    price: 350000,
    quantity: 1,
    condition: 'Tốt'
  },
  {
    productId: 'p3',
    productName: 'Đầm Hoa Nhí Dáng Dài Mùa Thu',
    productImage: 'https://picsum.photos/seed/dress1/600/600',
    price: 180000,
    quantity: 1,
    condition: 'Như mới'
  }],

  shippingInfo: {
    fullName: 'Trần Thị B',
    phone: '0903334444',
    email: 'tranthib@gmail.com',
    address: '456 Nguyễn Huệ',
    city: 'hcm',
    district: 'q1',
    ward: 'p2',
    note: ''
  },
  paymentMethod: 'bank_transfer',
  paymentStatus: 'paid',
  orderStatus: 'shipping',
  totalAmount: 530000,
  shippingFee: 0,
  note: '',
  createdAt: '2023-10-24T14:15:00Z',
  updatedAt: '2023-10-25T09:00:00Z'
},
{
  id: 'o3',
  orderNumber: 'ORD-20231020-12',
  userId: 'u4',
  items: [
  {
    productId: 'p4',
    productName: 'Túi Xách Da Thật Đeo Chéo Retro',
    productImage: 'https://picsum.photos/seed/bag1/600/600',
    price: 450000,
    quantity: 1,
    condition: 'Khá'
  }],

  shippingInfo: {
    fullName: 'Phạm Thu D',
    phone: '0907778888',
    email: 'phamthud@gmail.com',
    address: '789 Võ Văn Tần',
    city: 'hcm',
    district: 'q3',
    ward: 'p1',
    note: ''
  },
  paymentMethod: 'momo',
  paymentStatus: 'paid',
  orderStatus: 'completed',
  totalAmount: 480000,
  shippingFee: 30000,
  note: '',
  createdAt: '2023-10-20T10:00:00Z',
  updatedAt: '2023-10-22T16:30:00Z'
},
{
  id: 'o4',
  orderNumber: 'ORD-20231018-03',
  userId: 'u3',
  items: [
  {
    productId: 'p5',
    productName: 'Áo Khoác Blazer Kẻ Caro Oversize',
    productImage: 'https://picsum.photos/seed/blazer1/600/600',
    price: 220000,
    quantity: 1,
    condition: 'Tốt'
  }],

  shippingInfo: {
    fullName: 'Lê Hoàng C',
    phone: '0905556666',
    email: 'lehoangc@gmail.com',
    address: '12 CMT8',
    city: 'hcm',
    district: 'q3',
    ward: 'p2',
    note: ''
  },
  paymentMethod: 'cod',
  paymentStatus: 'unpaid',
  orderStatus: 'cancelled',
  totalAmount: 250000,
  shippingFee: 30000,
  note: 'Khách yêu cầu hủy',
  createdAt: '2023-10-18T09:20:00Z',
  updatedAt: '2023-10-18T11:00:00Z'
},
{
  id: 'o5',
  orderNumber: 'ORD-20231026-02',
  userId: 'u5',
  items: [
  {
    productId: 'p7',
    productName: 'Chân Váy Midi Xếp Ly Màu Be',
    productImage: 'https://picsum.photos/seed/skirt1/600/600',
    price: 120000,
    quantity: 2,
    condition: 'Như mới'
  }],

  shippingInfo: {
    fullName: 'Hoàng Minh E',
    phone: '0909990000',
    email: 'hoangminhe@gmail.com',
    address: '345 Điện Biên Phủ',
    city: 'hcm',
    district: 'q3',
    ward: 'p1',
    note: ''
  },
  paymentMethod: 'vnpay',
  paymentStatus: 'paid',
  orderStatus: 'confirmed',
  totalAmount: 270000,
  shippingFee: 30000,
  note: '',
  createdAt: '2023-10-26T15:45:00Z',
  updatedAt: '2023-10-26T16:00:00Z'
}];


export const cancelRequests: CancelRequest[] = [
{
  id: 'cr1',
  orderId: 'o1',
  reason: 'Tôi muốn đổi sang sản phẩm khác',
  status: 'pending',
  contactedBuyer: false,
  createdAt: '2023-10-25T09:00:00Z'
}];


export const articles: Article[] = [
{
  id: 'a1',
  title: 'Xu hướng thời trang Vintage mùa Thu Đông 2023',
  slug: 'xu-huong-thoi-trang-vintage-mua-thu-dong-2023',
  excerpt:
  'Khám phá những phong cách phối đồ secondhand cực chất cho mùa lạnh năm nay.',
  content: 'Nội dung bài viết chi tiết...',
  image: 'https://picsum.photos/seed/news1/800/400',
  category: 'news',
  createdAt: '2023-10-15T00:00:00Z',
  isPublished: true
},
{
  id: 'a2',
  title: 'Cách bảo quản áo len 2hand luôn như mới',
  slug: 'cach-bao-quan-ao-len-2hand-luon-nhu-moi',
  excerpt:
  'Mẹo nhỏ giúp những chiếc áo len secondhand của bạn không bị xù lông và giữ form chuẩn.',
  content: 'Nội dung bài viết chi tiết...',
  image: 'https://picsum.photos/seed/news2/800/400',
  category: 'news',
  createdAt: '2023-10-10T00:00:00Z',
  isPublished: true
},
{
  id: 'a3',
  title: 'Câu chuyện của 2HAND',
  slug: 'cau-chuyen-cua-2hand',
  excerpt: 'Hành trình mang thời trang bền vững đến với giới trẻ Việt Nam.',
  content: 'Nội dung bài viết chi tiết...',
  image: 'https://picsum.photos/seed/about/800/400',
  category: 'about',
  createdAt: '2023-01-01T00:00:00Z',
  isPublished: true
}];


export const adminStats: AdminStats = {
  totalProducts: 156,
  totalCategories: 6,
  totalArticles: 12,
  totalOrders: 1245,
  revenue: 345600000,
  profit: 125000000
};

export const monthlyRevenue = [
{ month: 'T5', revenue: 45000000, profit: 15000000, orderCount: 180 },
{ month: 'T6', revenue: 52000000, profit: 18000000, orderCount: 210 },
{ month: 'T7', revenue: 48000000, profit: 16000000, orderCount: 195 },
{ month: 'T8', revenue: 61000000, profit: 22000000, orderCount: 245 },
{ month: 'T9', revenue: 58000000, profit: 20000000, orderCount: 230 },
{ month: 'T10', revenue: 81600000, profit: 34000000, orderCount: 320 }];