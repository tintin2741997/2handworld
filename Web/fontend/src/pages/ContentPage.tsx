import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react';
import { Article } from '../types';
import { api } from '../services/api';
import { PageBreadcrumb } from '../components/layout/PageBreadcrumb';
export function ContentPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  useEffect(() => {
    api.get<Article[]>('/content').then(setArticles).catch(() => setArticles([]));
  }, []);
  const location = useLocation();
  const path = location.pathname;
  let category = 'about';
  let title = 'Giới thiệu';
  if (path.includes('chinh-sach')) {
    category = 'policy';
    title = 'Chính sách';
  } else if (path.includes('lien-he')) {
    category = 'contact';
    title = 'Liên hệ';
  }
  const content = articles.find((a) => a.category === category) || articles[0] || {
    id: 'fallback',
    title,
    slug: category,
    excerpt: '',
    content: '',
    image: 'https://picsum.photos/seed/content/800/400',
    category: category as Article['category'],
    createdAt: new Date().toISOString(),
    isPublished: true
  };
  return (
    <main className="min-h-screen pt-28 md:pt-32 pb-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        <PageBreadcrumb items={[{ label: title }]} />
        <h1 className="text-4xl font-serif font-bold text-heading mb-12 text-center">
          {title}
        </h1>

        {category === 'contact' ?
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-warm border border-border">
              <h2 className="text-2xl font-serif font-bold text-heading mb-6">
                Gửi tin nhắn cho chúng tôi
              </h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Họ và tên
                  </label>
                  <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Nhập họ tên" />
                
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Email
                  </label>
                  <input
                  type="email"
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Nhập email" />
                
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Nội dung
                  </label>
                  <textarea
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Nhập nội dung tin nhắn...">
                </textarea>
                </div>
                <button
                type="button"
                className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-warm">
                
                  Gửi tin nhắn
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-serif font-bold text-heading mb-4">
                  Thông tin liên hệ
                </h3>
                <p className="text-body mb-6">
                  Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của
                  bạn. Đừng ngần ngại liên hệ với 2HAND nhé!
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <MapPinIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-heading">Địa chỉ</h4>
                      <p className="text-muted text-sm mt-1">
                        123 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <PhoneIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-heading">Điện thoại</h4>
                      <p className="text-muted text-sm mt-1">090 123 4567</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <MailIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-heading">Email</h4>
                      <p className="text-muted text-sm mt-1">
                        hello@2handstore.vn
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> :

        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-warm border border-border prose prose-stone max-w-none">
            {/* Placeholder for rich text content */}
            <h2 className="text-2xl font-serif font-bold text-heading mb-4">
              {content.title}
            </h2>
            <p className="text-lg text-muted mb-8 italic">{content.excerpt}</p>

            {category === 'about' &&
          <div className="space-y-6 text-body leading-relaxed">
                <p>
                  2HAND được thành lập với sứ mệnh mang thời trang bền vững đến
                  gần hơn với giới trẻ Việt Nam. Chúng tôi tin rằng mỗi món đồ
                  đều có một câu chuyện riêng và xứng đáng được yêu thương thêm
                  một lần nữa.
                </p>
                <img
              src={content.image}
              alt="About us"
              className="w-full rounded-xl my-8 object-cover h-64" />
            
                <h3 className="text-xl font-serif font-bold text-heading mt-8 mb-4">
                  Giá trị cốt lõi
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Bền vững:</strong> Kéo dài vòng đời sản phẩm, giảm
                    thiểu rác thải thời trang.
                  </li>
                  <li>
                    <strong>Chất lượng:</strong> Tuyển chọn kỹ lưỡng từng sản
                    phẩm trước khi đến tay khách hàng.
                  </li>
                  <li>
                    <strong>Minh bạch:</strong> Mô tả trung thực về tình trạng
                    của từng món đồ.
                  </li>
                </ul>
              </div>
          }

            {category === 'policy' &&
          <div className="space-y-8 text-body leading-relaxed">
                <div>
                  <h3 className="text-xl font-serif font-bold text-heading mb-3">
                    1. Chính sách đổi trả
                  </h3>
                  <p>
                    Chúng tôi hỗ trợ đổi trả trong vòng 3 ngày kể từ khi nhận
                    hàng đối với các trường hợp:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      Sản phẩm không đúng mô tả (lỗi, rách không được báo trước)
                    </li>
                    <li>Giao sai sản phẩm</li>
                  </ul>
                  <p className="mt-2 text-sm text-muted">
                    * Lưu ý: Không hỗ trợ đổi trả với lý do không vừa, không
                    thích (vì là đồ 2hand mỗi mẫu chỉ có 1 chiếc).
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-heading mb-3">
                    2. Chính sách vận chuyển
                  </h3>
                  <p>
                    Giao hàng toàn quốc với mức phí đồng giá 30.000đ. Miễn phí
                    vận chuyển cho đơn hàng từ 500.000đ.
                  </p>
                  <p className="mt-2">
                    Thời gian giao hàng dự kiến: 1-2 ngày (Nội thành TP.HCM) và
                    3-5 ngày (Các tỉnh thành khác).
                  </p>
                </div>
              </div>
          }
          </div>
        }
      </div>
    </main>);

}
