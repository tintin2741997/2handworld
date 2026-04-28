import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon } from 'lucide-react';
import { Article } from '../types';
import { api } from '../services/api';
import { PageBreadcrumb } from '../components/layout/PageBreadcrumb';

export function NewsPage() {
  const { slug } = useParams();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    api.get<Article[]>('/content').then(setArticles).catch(() => setArticles([]));
  }, []);

  const newsArticles = articles.filter(
    (article) => article.category === 'news' && article.isPublished
  );
  const selectedArticle = slug ?
    newsArticles.find((article) => article.slug === slug) :
    null;

  if (slug) {
    if (!selectedArticle) {
      return (
        <main className="min-h-screen pt-28 md:pt-32 pb-20 bg-background">
          <div className="max-w-3xl mx-auto px-4 lg:px-8 text-center">
            <PageBreadcrumb items={[{ label: 'Tin tức', to: '/tin-tuc' }, { label: 'Không tìm thấy bài viết' }]} />
            <h1 className="text-3xl font-serif font-bold text-heading mb-4">
              Không tìm thấy bài viết
            </h1>
            <p className="text-muted mb-8">
              Bài viết có thể đã bị ẩn hoặc đường dẫn không còn tồn tại.
            </p>
            <Link
              to="/tin-tuc"
              className="inline-flex items-center text-primary font-medium hover:text-primary-hover">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Quay lại tin tức
            </Link>
          </div>
        </main>
      );
    }

    return (
      <main className="min-h-screen pt-28 md:pt-32 pb-20 bg-background">
        <article className="max-w-4xl mx-auto px-4 lg:px-8">
          <PageBreadcrumb items={[{ label: 'Tin tức', to: '/tin-tuc' }, { label: selectedArticle.title }]} />
          <Link
            to="/tin-tuc"
            className="inline-flex items-center text-primary font-medium hover:text-primary-hover mb-8">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Quay lại tin tức
          </Link>

          <div className="bg-white rounded-2xl overflow-hidden shadow-warm border border-border">
            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              className="w-full h-72 md:h-[420px] object-cover" />

            <div className="p-6 md:p-10">
              <div className="flex items-center text-sm text-muted mb-4">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {new Date(selectedArticle.createdAt).toLocaleDateString('vi-VN')}
              </div>

              <h1 className="text-3xl md:text-5xl font-serif font-bold text-heading leading-tight mb-5">
                {selectedArticle.title}
              </h1>

              <p className="text-lg text-muted mb-8">
                {selectedArticle.excerpt}
              </p>

              <div className="space-y-5 text-body text-lg leading-8">
                {selectedArticle.content.split('\n\n').map((paragraph) =>
                <p key={paragraph}>{paragraph}</p>
                )}
              </div>
            </div>
          </div>
        </article>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 md:pt-32 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <PageBreadcrumb items={[{ label: 'Tin tức' }]} />
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-heading mb-4">
            Tin tức & Blog
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Cập nhật xu hướng thời trang secondhand, mẹo phối đồ và những câu
            chuyện thú vị về phong cách sống bền vững.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.map((article) =>
          <article
            key={article.id}
            className="bg-white rounded-2xl overflow-hidden shadow-warm border border-border flex flex-col h-full group">
            <Link
              to={`/tin-tuc/${article.slug}`}
              className="h-56 overflow-hidden block">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </Link>

            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center text-xs text-muted mb-3">
                <CalendarIcon className="w-4 h-4 mr-1.5" />
                {new Date(article.createdAt).toLocaleDateString('vi-VN')}
              </div>
              <Link to={`/tin-tuc/${article.slug}`}>
                <h2 className="text-xl font-serif font-bold text-heading mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h2>
              </Link>
              <p className="text-body text-sm mb-6 line-clamp-3 flex-grow">
                {article.excerpt}
              </p>
              <Link
                to={`/tin-tuc/${article.slug}`}
                className="inline-flex items-center text-primary font-medium hover:text-primary-hover transition-colors mt-auto">
                Đọc thêm <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </article>
          )}
        </div>
      </div>
    </main>
  );
}
