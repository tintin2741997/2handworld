import React, { useState } from 'react';
import { StarIcon } from 'lucide-react';
import { Review } from '../../types';
interface ProductReviewsProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}
export function ProductReviews({
  reviews,
  rating,
  reviewCount
}: ProductReviewsProps) {
  const [activeTab, setActiveTab] = useState('all');
  const tabs = [
  {
    id: 'all',
    label: 'Tất cả'
  },
  {
    id: '5',
    label: '5 Sao'
  },
  {
    id: '4',
    label: '4 Sao'
  },
  {
    id: '3',
    label: '3 Sao'
  },
  {
    id: '2',
    label: '2 Sao'
  },
  {
    id: '1',
    label: '1 Sao'
  }];

  const renderStars = (count: number) => {
    return Array.from({
      length: 5
    }).map((_, i) =>
    <StarIcon
      key={i}
      className={`w-4 h-4 ${i < count ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />

    );
  };
  const filteredReviews = activeTab === 'all' ? reviews : reviews.filter((r) => r.rating === parseInt(activeTab, 10));

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-warm border border-border/50">
      <h2 className="font-serif text-2xl font-bold text-heading mb-8">
        Đánh giá sản phẩm
      </h2>

      {/* Summary */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-border">
        <div className="text-center md:text-left">
          <div className="text-5xl font-bold text-primary mb-2">
            {rating.toFixed(1)}
          </div>
          <div className="flex justify-center md:justify-start mb-2">
            {renderStars(Math.round(rating))}
          </div>
          <div className="text-muted text-sm">{reviewCount} đánh giá</div>
        </div>

        <div className="flex-1 w-full space-y-2">
          {[5, 4, 3, 2, 1].map((star) =>
          <div key={star} className="flex items-center text-sm">
              <span className="w-12 text-muted">{star} sao</span>
              <div className="flex-1 h-2 bg-background rounded-full mx-3 overflow-hidden">
                <div
                className="h-full bg-yellow-400 rounded-full"
                style={{
                  width: `${star === 5 ? 70 : star === 4 ? 20 : 10}%`
                }}>
              </div>
              </div>
              <span className="w-8 text-right text-muted">
                {star === 5 ? 8 : star === 4 ? 3 : 1}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) =>
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${activeTab === tab.id ? 'bg-primary text-white border-primary' : 'bg-white text-body border-border hover:border-primary hover:text-primary'}`}>
          
            {tab.label}
          </button>
        )}
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-background rounded-xl border border-dashed border-border/60">
            <p className="text-muted text-sm">Chưa có đánh giá nào phù hợp.</p>
          </div>
        ) : (
          filteredReviews.map((review) =>
          <div
            key={review.id}
            className="pb-6 border-b border-border last:border-0 last:pb-0">
            
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold font-serif">
                    {review.userName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-heading">
                      {review.userName}
                    </div>
                    <div className="flex items-center mt-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted">
                  {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                </div>
              </div>
              <p className="text-body mt-3 leading-relaxed">{review.comment}</p>
            </div>
          )
        )}
      </div>

      <div className="mt-8 text-center">
        <button className="px-6 py-2 border border-primary text-primary font-medium rounded-full hover:bg-primary hover:text-white transition-colors">
          Xem thêm đánh giá
        </button>
      </div>
    </div>);

}