import React, { useEffect, useState } from 'react';
import { MapPinIcon, PhoneIcon, ClockIcon } from 'lucide-react';
import { Store } from '../types';
import { api } from '../services/api';
import { PageBreadcrumb } from '../components/layout/PageBreadcrumb';

export function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    api.get<Store[]>('/stores').then(setStores).catch(() => setStores([]));
  }, []);

  return (
    <main className="min-h-screen pt-28 md:pt-32 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <PageBreadcrumb items={[{ label: 'Cửa hàng' }]} />

        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-heading mb-4">
            Cửa hàng 2HANDWORLD
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Ghé thăm cửa hàng 2HANDWORLD để trực tiếp trải nghiệm và lựa chọn
            những món đồ secondhand chất lượng nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stores.map((store) =>
          <div
            key={store.id}
            className="bg-white rounded-2xl overflow-hidden shadow-warm border border-border group hover:shadow-warm-lg transition-all duration-300">
            <div className="h-48 overflow-hidden relative">
              <img
                src={store.image}
                alt={store.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <h3 className="absolute bottom-4 left-6 text-xl font-serif font-bold text-white">
                {store.name}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-body leading-relaxed">{store.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-body font-medium">{store.phone}</p>
              </div>
              <div className="flex items-start gap-3">
                <ClockIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-body">Thứ 2 - Thứ 6: 09:00 - 21:00</p>
                  <p className="text-body">Thứ 7 - CN: 09:00 - 22:00</p>
                </div>
              </div>
              <button className="w-full mt-4 py-2.5 border border-primary text-primary rounded-xl font-medium hover:bg-primary hover:text-white transition-colors">
                Xem bản đồ
              </button>
            </div>
          </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-warm border border-border p-2 h-[400px] flex items-center justify-center">
          <div className="text-center">
            <MapPinIcon className="w-12 h-12 text-muted mx-auto mb-4 opacity-50" />
            <p className="text-muted font-medium">Bản đồ sẽ được cập nhật</p>
          </div>
        </div>
      </div>
    </main>
  );
}
