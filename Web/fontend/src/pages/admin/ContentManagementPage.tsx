import React, { useEffect, useState } from 'react';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  XIcon,
  CheckCircleIcon } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Article } from '../../types';
import { api } from '../../services/api';
export function ContentManagementPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState('news');
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    api.get<Article[]>('/content').then(setArticles).catch(() => setArticles([]));
  }, []);
  const tabs = [
  {
    id: 'news',
    label: 'Tin tức & Blog'
  },
  {
    id: 'about',
    label: 'Giới thiệu'
  },
  {
    id: 'policy',
    label: 'Chính sách'
  },
  {
    id: 'contact',
    label: 'Liên hệ'
  }];

  const newsArticles = articles.filter((a) => a.category === 'news');
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-heading">
            Quản lý nội dung
          </h1>
          <p className="text-muted mt-1">
            Quản lý bài viết và các trang thông tin tĩnh
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-warm overflow-hidden flex flex-col min-h-[600px]">
        {/* Tabs */}
        <div className="flex border-b border-border overflow-x-auto">
          {tabs.map((tab) =>
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors relative ${activeTab === tab.id ? 'text-primary' : 'text-muted hover:text-heading'}`}>
            
              {tab.label}
              {activeTab === tab.id &&
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
            }
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-6 flex-1">
          {activeTab === 'news' ?
          <div className="space-y-4">
              <div className="flex justify-end">
                <button
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-warm flex items-center text-sm">
                
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Thêm bài viết
                </button>
              </div>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background/50 text-muted text-sm border-b border-border">
                      <th className="p-4 font-medium">Tiêu đề</th>
                      <th className="p-4 font-medium">Ngày đăng</th>
                      <th className="p-4 font-medium text-center">
                        Trạng thái
                      </th>
                      <th className="p-4 font-medium text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {newsArticles.map((article) =>
                  <tr
                    key={article.id}
                    className="hover:bg-background/30 transition-colors">
                    
                        <td className="p-4">
                          <div className="font-medium text-heading line-clamp-1">
                            {article.title}
                          </div>
                          <div className="text-xs text-muted mt-1 line-clamp-1">
                            {article.excerpt}
                          </div>
                        </td>
                        <td className="p-4 text-sm text-body">
                          {new Date(article.createdAt).toLocaleDateString(
                        'vi-VN'
                      )}
                        </td>
                        <td className="p-4 text-center">
                          {article.isPublished ?
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                              <CheckCircleIcon className="w-3 h-3 mr-1" /> Đã
                              đăng
                            </span> :

                      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                              Nháp
                            </span>
                      }
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                          onClick={() => setIsModalOpen(true)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Sửa">
                          
                              <EditIcon className="w-4 h-4" />
                            </button>
                            <button
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Xóa">
                          
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div> :

          <div className="max-w-4xl space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-xl font-bold text-heading">
                  Nội dung trang: {tabs.find((t) => t.id === activeTab)?.label}
                </h3>
                <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-warm">
                  Lưu thay đổi
                </button>
              </div>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="bg-background/50 p-2 border-b border-border flex gap-2">
                  {/* Fake rich text toolbar */}
                  <div className="w-8 h-8 bg-white rounded border border-border flex items-center justify-center font-bold">
                    B
                  </div>
                  <div className="w-8 h-8 bg-white rounded border border-border flex items-center justify-center italic">
                    I
                  </div>
                  <div className="w-8 h-8 bg-white rounded border border-border flex items-center justify-center underline">
                    U
                  </div>
                  <div className="w-px h-8 bg-border mx-1"></div>
                  <div className="w-8 h-8 bg-white rounded border border-border flex items-center justify-center text-sm">
                    H1
                  </div>
                  <div className="w-8 h-8 bg-white rounded border border-border flex items-center justify-center text-sm">
                    H2
                  </div>
                </div>
                <textarea
                className="w-full h-96 p-4 outline-none resize-none text-body leading-relaxed"
                defaultValue={
                articles.find((a) => a.category === activeTab)?.content ||
                'Nhập nội dung tại đây...'
                }>
              </textarea>
              </div>
            </div>
          }
        </div>
      </div>

      {/* Add/Edit Article Modal */}
      <AnimatePresence>
        {isModalOpen &&
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.95
            }}
            className="bg-white rounded-xl shadow-warm-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="font-serif text-xl font-bold text-heading">
                  Thêm bài viết mới
                </h2>
                <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted hover:text-heading">
                
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">
                    Tiêu đề *
                  </label>
                  <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="Nhập tiêu đề bài viết" />
                
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">
                    Tóm tắt
                  </label>
                  <textarea
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="Đoạn mô tả ngắn...">
                </textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">
                    Ảnh đại diện (URL)
                  </label>
                  <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="https://..." />
                
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">
                    Nội dung chi tiết
                  </label>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <div className="bg-background/50 p-2 border-b border-border flex gap-2">
                      <div className="w-8 h-8 bg-white rounded border border-border flex items-center justify-center font-bold">
                        B
                      </div>
                      <div className="w-8 h-8 bg-white rounded border border-border flex items-center justify-center italic">
                        I
                      </div>
                    </div>
                    <textarea
                    rows={10}
                    className="w-full p-4 outline-none resize-none text-body"
                    placeholder="Nhập nội dung bài viết...">
                  </textarea>
                  </div>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked />
                  
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
                    <span className="ml-3 text-sm font-medium text-heading">
                      Đăng bài viết (Publish)
                    </span>
                  </label>
                </div>
              </div>
              <div className="p-6 border-t border-border flex justify-end space-x-3 bg-background/50">
                <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 border border-border rounded-lg font-medium text-heading hover:bg-white transition-colors">
                
                  Hủy
                </button>
                <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-warm">
                
                  Lưu bài viết
                </button>
              </div>
            </motion.div>
          </div>
        }
      </AnimatePresence>
    </div>);

}
