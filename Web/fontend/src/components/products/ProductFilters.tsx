import React, { useEffect, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, FilterIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Category, Store } from '../../types';
import { api } from '../../services/api';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({
  title,
  children,
  defaultOpen = true
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border py-4">
      <button
        type="button"
        className="flex justify-between items-center w-full text-left font-serif font-semibold text-heading"
        onClick={() => setIsOpen(!isOpen)}>
        {title}
        {isOpen ?
        <ChevronUpIcon className="w-4 h-4 text-muted" /> :
        <ChevronDownIcon className="w-4 h-4 text-muted" />
        }
      </button>
      <AnimatePresence>
        {isOpen &&
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden">
          <div className="pt-4 space-y-3">{children}</div>
        </motion.div>
        }
      </AnimatePresence>
    </div>);
}

export function ProductFilters() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  useEffect(() => {
    api.get<Category[]>('/categories').then(setCategories).catch(() => setCategories([]));
    api.get<Store[]>('/stores').then(setStores).catch(() => setStores([]));
  }, []);

  useEffect(() => {
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
  }, [searchParams]);

  const getValues = (key: string) => searchParams.getAll(key);

  const updateSearchParams = (next: URLSearchParams) => {
    setSearchParams(next, { replace: true, preventScrollReset: true });
  };

  const updateMultiParam = (key: string, value: string, checked: boolean) => {
    const next = new URLSearchParams(searchParams);
    const current = next.getAll(key);
    next.delete(key);

    const updated = checked ?
      [...current, value] :
      current.filter((item) => item !== value);

    [...new Set(updated)].forEach((item) => next.append(key, item));
    updateSearchParams(next);
  };

  const setSingleParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    value ? next.set(key, value) : next.delete(key);
    updateSearchParams(next);
  };

  const applyPriceFilter = () => {
    const next = new URLSearchParams(searchParams);
    minPrice ? next.set('minPrice', minPrice) : next.delete('minPrice');
    maxPrice ? next.set('maxPrice', maxPrice) : next.delete('maxPrice');
    updateSearchParams(next);
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    const search = searchParams.get('q');
    if (search) {
      next.set('q', search);
    }
    setMinPrice('');
    setMaxPrice('');
    updateSearchParams(next);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-warm border border-border/50">
      <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-border">
        <FilterIcon className="w-5 h-5 text-primary" />
        <h2 className="font-serif text-xl font-bold text-heading">Bộ lọc</h2>
      </div>

      <FilterSection title="Danh mục">
        {categories.map((cat) =>
        <label
          key={cat.id}
          className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={getValues('category').includes(cat.id) || getValues('category').includes(cat.slug)}
            onChange={(event) => updateMultiParam('category', cat.id, event.target.checked)}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
          <span className="text-body group-hover:text-primary transition-colors">
            {cat.name}
          </span>
          <span className="text-muted text-sm ml-auto">
            ({cat.productCount})
          </span>
        </label>
        )}
      </FilterSection>

      <FilterSection title="Tình trạng">
        {['Như mới', 'Tốt', 'Khá', 'Trung bình'].map((condition) =>
        <label
          key={condition}
          className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={getValues('condition').includes(condition)}
            onChange={(event) => updateMultiParam('condition', condition, event.target.checked)}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
          <span className="text-body group-hover:text-primary transition-colors">
            {condition}
          </span>
        </label>
        )}
      </FilterSection>

      <FilterSection title="Cửa hàng" defaultOpen={false}>
        {stores.map((store) =>
        <label
          key={store.id}
          className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={getValues('store').includes(store.id)}
            onChange={(event) => updateMultiParam('store', store.id, event.target.checked)}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
          <span className="text-body group-hover:text-primary transition-colors">
            {store.name}
          </span>
        </label>
        )}
      </FilterSection>

      <FilterSection title="Khoảng giá">
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min="0"
            placeholder="Từ"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm" />
          <span className="text-muted">-</span>
          <input
            type="number"
            min="0"
            placeholder="Đến"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm" />
        </div>
        <button
          type="button"
          onClick={applyPriceFilter}
          className="w-full mt-3 bg-background text-heading font-medium py-2 rounded-md hover:bg-border transition-colors text-sm">
          Áp dụng
        </button>
      </FilterSection>

      <div className="pt-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              name="toggle"
              id="toggle"
              checked={searchParams.get('sale') === '1'}
              onChange={(event) => setSingleParam('sale', event.target.checked ? '1' : '')}
              className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-border checked:border-primary checked:right-0 checked:bg-primary transition-all duration-200" />
            <label
              htmlFor="toggle"
              className="toggle-label block overflow-hidden h-5 rounded-full bg-border cursor-pointer">
            </label>
          </div>
          <span className="text-sale font-medium">Đang giảm giá</span>
        </label>
      </div>

      <button
        type="button"
        onClick={clearFilters}
        className="w-full mt-8 text-muted hover:text-primary text-sm font-medium transition-colors underline underline-offset-4">
        Xóa tất cả bộ lọc
      </button>
    </div>);
}
