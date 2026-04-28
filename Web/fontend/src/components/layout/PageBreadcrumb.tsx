import { Link } from 'react-router-dom';
import { ChevronRightIcon } from 'lucide-react';

type BreadcrumbItem = {
  label: string;
  to?: string;
};

type PageBreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function PageBreadcrumb({ items, className = '' }: PageBreadcrumbProps) {
  return (
    <nav className={`flex items-center text-sm text-muted mb-8 ${className}`}>
      <Link to="/" className="hover:text-primary transition-colors">
        Trang chủ
      </Link>
      {items.map((item) =>
      <span key={`${item.label}-${item.to || 'current'}`} className="flex items-center">
          <ChevronRightIcon className="w-4 h-4 mx-2" />
          {item.to ?
        <Link to={item.to} className="hover:text-primary transition-colors">
              {item.label}
            </Link> :
        <span className="text-heading font-medium">{item.label}</span>
        }
        </span>
      )}
    </nav>
  );
}
