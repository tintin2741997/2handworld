import React, { useEffect, useState } from 'react';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  XIcon,
  MapPinIcon,
  PhoneIcon } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store } from '../../types';
import { api } from '../../services/api';
export function StoreManagementPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  useEffect(() => {
    api.get<Store[]>('/stores').then(setStores).catch(() => setStores([]));
  }, []);
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-heading">
            Quáº£n lÃ½ cá»­a hÃ ng
          </h1>
          <p className="text-muted mt-1">
            Quáº£n lÃ½ danh sÃ¡ch chi nhÃ¡nh vÃ  Ä‘á»‹a chá»‰
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-warm flex items-center">
          
          <PlusIcon className="w-5 h-5 mr-2" />
          ThÃªm chi nhÃ¡nh
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-warm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 text-muted text-sm border-b border-border">
                <th className="p-4 font-medium w-24">áº¢nh</th>
                <th className="p-4 font-medium">TÃªn chi nhÃ¡nh</th>
                <th className="p-4 font-medium">Äá»‹a chá»‰</th>
                <th className="p-4 font-medium">Sá»‘ Ä‘iá»‡n thoáº¡i</th>
                <th className="p-4 font-medium text-center">Thao tÃ¡c</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stores.map((store) =>
              <tr
                key={store.id}
                className="hover:bg-background/30 transition-colors">
                
                  <td className="p-4">
                    <div className="w-16 h-12 rounded border border-border overflow-hidden">
                      <img
                      src={store.image}
                      alt={store.name}
                      className="w-full h-full object-cover" />
                    
                    </div>
                  </td>
                  <td className="p-4 font-medium text-heading">{store.name}</td>
                  <td className="p-4 text-sm text-body flex items-start mt-1">
                    <MapPinIcon className="w-4 h-4 text-muted mr-1.5 flex-shrink-0 mt-0.5" />
                    {store.address}
                  </td>
                  <td className="p-4 text-sm text-body">
                    <div className="flex items-center">
                      <PhoneIcon className="w-4 h-4 text-muted mr-1.5" />
                      {store.phone}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                      onClick={() => setIsModalOpen(true)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Sá»­a">
                      
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="XÃ³a">
                      
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
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
            className="bg-white rounded-xl shadow-warm-lg w-full max-w-lg overflow-hidden flex flex-col">
            
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="font-serif text-xl font-bold text-heading">
                  ThÃªm chi nhÃ¡nh má»›i
                </h2>
                <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted hover:text-heading">
                
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-heading mb-2">
                      TÃªn chi nhÃ¡nh *
                    </label>
                    <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="VD: Chi nhÃ¡nh Quáº­n 1" />
                  
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-2">
                      Äá»‹a chá»‰ *
                    </label>
                    <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="Nháº­p Ä‘á»‹a chá»‰ Ä‘áº§y Ä‘á»§" />
                  
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-2">
                      Sá»‘ Ä‘iá»‡n thoáº¡i *
                    </label>
                    <input
                    type="tel"
                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="Nháº­p sá»‘ Ä‘iá»‡n thoáº¡i" />
                  
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-2">
                      HÃ¬nh áº£nh
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-background transition-colors cursor-pointer">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                        <PlusIcon className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-medium text-heading">
                        Nháº¥n Ä‘á»ƒ táº£i áº£nh lÃªn
                      </p>
                    </div>
                  </div>
                </form>
              </div>
              <div className="p-6 border-t border-border flex justify-end space-x-3 bg-background/50">
                <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 border border-border rounded-lg font-medium text-heading hover:bg-white transition-colors">
                
                  Há»§y
                </button>
                <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-warm">
                
                  LÆ°u
                </button>
              </div>
            </motion.div>
          </div>
        }
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteModalOpen &&
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
            className="bg-white rounded-xl shadow-warm-lg w-full max-w-md p-6 text-center">
            
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrashIcon className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-heading mb-2">
                XÃ¡c nháº­n xÃ³a
              </h3>
              <p className="text-body mb-6">
                Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a chi nhÃ¡nh nÃ y?
              </p>
              <div className="flex justify-center space-x-3">
                <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2 border border-border rounded-lg font-medium text-heading hover:bg-background transition-colors">
                
                  Há»§y
                </button>
                <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                
                  XÃ³a chi nhÃ¡nh
                </button>
              </div>
            </motion.div>
          </div>
        }
      </AnimatePresence>
    </div>);

}
