import React from 'react';
import { Link } from 'react-router-dom';
import { LeafIcon, MapPinIcon, PhoneIcon, MailIcon } from 'lucide-react';
export function Footer() {
  return (
    <footer className="bg-[#2D1810] text-[#E8DDD0] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="bg-primary text-white p-1.5 rounded-lg">
                <LeafIcon className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-tight">
                2HAND<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-[#8B7355] leading-relaxed mb-6">
              Nền tảng mua sắm thời trang secondhand chất lượng cao. Chúng tôi
              tin vào phong cách bền vững và giá trị vòng đời của mỗi món đồ.
            </p>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white mb-6">
              Hỗ trợ khách hàng
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Câu hỏi thường gặp (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white mb-6">
              Danh mục
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/san-pham"
                  className="hover:text-primary transition-colors">
                  
                  Áo & Sơ mi
                </Link>
              </li>
              <li>
                <Link
                  to="/san-pham"
                  className="hover:text-primary transition-colors">
                  
                  Quần & Jeans
                </Link>
              </li>
              <li>
                <Link
                  to="/san-pham"
                  className="hover:text-primary transition-colors">
                  
                  Váy & Đầm
                </Link>
              </li>
              <li>
                <Link
                  to="/san-pham"
                  className="hover:text-primary transition-colors">
                  
                  Túi xách & Phụ kiện
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white mb-6">
              Liên hệ
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPinIcon className="w-5 h-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                <span>123 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="w-5 h-5 mr-3 text-primary flex-shrink-0" />
                <span>090 123 4567</span>
              </li>
              <li className="flex items-center">
                <MailIcon className="w-5 h-5 mr-3 text-primary flex-shrink-0" />
                <span>hello@2handstore.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#4A3728] pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#8B7355] text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} 2HAND Store. Tất cả quyền được bảo
            lưu.
          </p>
          <div className="flex space-x-4">
            {/* Payment Icons Placeholders */}
            <div className="w-10 h-6 bg-white/10 rounded"></div>
            <div className="w-10 h-6 bg-white/10 rounded"></div>
            <div className="w-10 h-6 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    </footer>);

}