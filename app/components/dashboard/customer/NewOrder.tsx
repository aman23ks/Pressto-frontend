'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Search, MapPin, Star, Clock } from 'lucide-react';
import { TopNav } from '../../../common/TopNav';
import { useRouter } from 'next/navigation';
import { StatusBadge } from '../../../common/StatusBadge';
import ShopService from '@/app/services/shopService';
import { toast } from 'react-hot-toast';

interface Shop {
 id: string;
 name: string;
 rating: number;
 distance: string;
 pricePerItem: number;
 totalOrders: number;
 deliveryTime: string;
}

interface OrderItem {
 type: string;
 count: number;
 pricePerItem: number;
}

export const NewOrder = ({ onBack }: { onBack: () => void }) => {
 const router = useRouter();
 const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
 const [shops, setShops] = useState<Shop[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchQuery, setSearchQuery] = useState('');
 const [orderItems, setOrderItems] = useState<OrderItem[]>([
   { type: 'Shirts', count: 0, pricePerItem: 10 },
   { type: 'Pants', count: 0, pricePerItem: 12 },
   { type: 'Dresses', count: 0, pricePerItem: 15 },
   { type: 'Suits', count: 0, pricePerItem: 25 },
 ]);

 useEffect(() => {
   fetchShops();
 }, []);

 const fetchShops = async () => {
   try {
     setLoading(true);
     const data = await ShopService.getAllShops();
     setShops(data);
   } catch (error) {
     toast.error('Failed to fetch shops');
     console.error('Error fetching shops:', error);
   } finally {
     setLoading(false);
   }
 };

 const filteredShops = shops.filter(shop =>
   shop.name.toLowerCase().includes(searchQuery.toLowerCase())
 );

 const handleItemCount = (index: number, increment: boolean) => {
   const newOrderItems = [...orderItems];
   newOrderItems[index].count = increment 
     ? newOrderItems[index].count + 1 
     : Math.max(0, newOrderItems[index].count - 1);
   setOrderItems(newOrderItems);
 };

 const handleSchedulePickup = () => {
   if (totalItems === 0) return;
   
   const orderData = {
     shop: selectedShop,
     items: orderItems.filter(item => item.count > 0),
     totalAmount,
     totalItems
   };
   sessionStorage.setItem('currentOrder', JSON.stringify(orderData));
   
   router.push(`/schedule-pickup`);
 };

 const totalItems = orderItems.reduce((sum, item) => sum + item.count, 0);
 const totalAmount = orderItems.reduce((sum, item) => sum + (item.count * item.pricePerItem), 0);

 return (
   <div className="min-h-screen bg-white">
     <TopNav userType="Customer" onNotificationClick={() => {}} />

     <main className="max-w-2xl mx-auto px-4 py-8">
       {/* Header */}
       <div className="flex items-center mb-6">
         <button 
           onClick={onBack}
           className="mr-4 text-gray-600 hover:text-gray-900"
         >
           <ArrowLeft size={24} />
         </button>
         <h1 className="text-2xl font-bold">New Order</h1>
       </div>

       {!selectedShop ? (
         <>
           {/* Search */}
           <div className="relative mb-6">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
             <input
               type="text"
               placeholder="Search for shops..."
               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>

           {/* Shop List */}
           {loading ? (
             <div className="flex justify-center items-center py-12">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
             </div>
           ) : filteredShops.length > 0 ? (
             <div className="space-y-4">
               {filteredShops.map(shop => (
                 <div
                   key={shop.id}
                   className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition duration-200"
                   onClick={() => setSelectedShop(shop)}
                 >
                   <div className="flex justify-between items-start mb-3">
                     <div>
                       <h3 className="font-medium text-lg">{shop.name}</h3>
                       <div className="flex items-center text-sm text-gray-600 mt-1">
                         <MapPin size={16} className="mr-1" />
                         <span>{shop.distance}</span>
                         <span className="mx-2">•</span>
                         <Star size={16} className="mr-1 text-yellow-400" />
                         <span>{shop.rating}</span>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="font-medium">₹{shop.pricePerItem}/item</p>
                       <p className="text-sm text-gray-600 mt-1">{shop.totalOrders}+ orders</p>
                     </div>
                   </div>
                   <div className="flex items-center text-sm text-gray-600">
                     <Clock size={16} className="mr-1" />
                     <span>Delivery in {shop.deliveryTime}</span>
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="text-center py-12">
               <p className="text-gray-600">No shops found</p>
             </div>
           )}
         </>
       ) : (
         <>
           {/* Selected Shop Info */}
           <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
             <div className="flex justify-between items-start">
               <div>
                 <h3 className="font-medium">{selectedShop.name}</h3>
                 <div className="flex items-center text-sm text-gray-600 mt-1">
                   <MapPin size={16} className="mr-1" />
                   <span>{selectedShop.distance}</span>
                   <span className="mx-2">•</span>
                   <Star size={16} className="mr-1 text-yellow-400" />
                   <span>{selectedShop.rating}</span>
                 </div>
               </div>
               <button 
                 onClick={() => setSelectedShop(null)}
                 className="text-blue-600 text-sm hover:underline"
               >
                 Change Shop
               </button>
             </div>
           </div>

           {/* Item Selection */}
           <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
             <h3 className="font-medium text-lg mb-4">Select Items</h3>
             <div className="space-y-6">
               {orderItems.map((item, index) => (
                 <div key={index} className="flex items-center justify-between">
                   <div>
                     <p className="font-medium">{item.type}</p>
                     <p className="text-sm text-gray-600">₹{item.pricePerItem}/item</p>
                   </div>
                   <div className="flex items-center space-x-4">
                     <button
                       onClick={() => handleItemCount(index, false)}
                       className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                     >
                       -
                     </button>
                     <span className="w-8 text-center">{item.count}</span>
                     <button
                       onClick={() => handleItemCount(index, true)}
                       className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                     >
                       +
                     </button>
                   </div>
                 </div>
               ))}
             </div>
           </div>

           {/* Order Summary */}
           <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
             <h3 className="font-medium text-lg mb-4">Order Summary</h3>
             <div className="space-y-3">
               <div className="flex justify-between text-gray-600">
                 <span>Total Items</span>
                 <span>{totalItems}</span>
               </div>
               <div className="flex justify-between text-gray-600">
                 <span>Price per Item</span>
                 <span>₹{selectedShop.pricePerItem}</span>
               </div>
               <div className="flex justify-between font-medium text-lg pt-3 border-t">
                 <span>Total Amount</span>
                 <span>₹{totalAmount}</span>
               </div>
             </div>
           </div>

           {/* Continue Button */}
           <button 
             onClick={handleSchedulePickup}
             className={`w-full py-3 rounded-lg font-medium ${
               totalItems > 0 
                 ? 'bg-blue-600 text-white hover:bg-blue-700' 
                 : 'bg-gray-100 text-gray-400 cursor-not-allowed'
             }`}
             disabled={totalItems === 0}
           >
             Continue to Book Order
           </button>
         </>
       )}
     </main>
   </div>
 );
};