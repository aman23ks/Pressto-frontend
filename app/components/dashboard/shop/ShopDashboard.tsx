// app/components/dashboard/shop/ShopDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, TrendingUp, Users, DollarSign, Settings, Home } from 'lucide-react';
import { apiService } from '@/app/services/api';
import { toast } from 'react-hot-toast';
import { TopNav } from '../../../common/TopNav';
import { ShopOrders } from './ShopOrders';
import { ShopSettings } from './ShopSettings';

interface DashboardStats {
 totalOrders: number;
 totalRevenue: number;
 completedOrders: number;
 pendingOrders: number;
 revenueByDay: {
   date: string;
   revenue: number;
 }[];
 ordersByStatus: {
   status: string;
   count: number;
 }[];
 topServices: {
   name: string;
   count: number;
 }[];
}

// interface ShopDashboardProps {
//   onNavigate: (view: 'dashboard' | 'orders' | 'settings') => void;
//   currentView: 'dashboard' | 'orders' | 'settings';  // Add this line
// }

export const ShopDashboard = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'orders' | 'settings'>('dashboard');
 const [stats, setStats] = useState<DashboardStats | null>(null);
 const [loading, setLoading] = useState(true);
 const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');

 const fetchStats = async () => {
   try {
     setLoading(true);
     const response = await apiService.get(`/shop/dashboard-stats?timeframe=${timeframe}`);
     setStats(response.data);
   } catch (error) {
     toast.error('Failed to fetch dashboard statistics');
     console.error(error);
   } finally {
     setLoading(false);
   }
 };

 useEffect(() => {
   fetchStats();
 }, [timeframe]);

 if (loading) {
   return (
     <div className="min-h-screen bg-gray-50">
       <TopNav userType="Shop Owner" onNotificationClick={() => {}} />
       <div className="flex justify-center items-center h-[calc(100vh-64px)]">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
       </div>
     </div>
   );
 }

 if (!stats) return null;

 if (currentView === 'orders') {
  return <ShopOrders onNavigate={setCurrentView} />;
}

if (currentView === 'settings') {
  return <ShopSettings onNavigate={setCurrentView} />;
}

 return (
   <div className="min-h-screen bg-gray-50">
     <TopNav userType="Shop Owner" onNotificationClick={() => {}} />
     
     <main className="max-w-7xl mx-auto px-4 pt-16 pb-24">
       {/* Summary Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition-shadow">
           <div className="flex items-center gap-4">
             <div className="p-3 bg-blue-100 rounded-lg">
               <Package className="h-6 w-6 text-blue-600" />
             </div>
             <div>
               <p className="text-sm text-gray-600">Total Orders</p>
               <p className="text-2xl font-bold">{stats.totalOrders}</p>
               <p className="text-xs text-gray-500 mt-1">All time orders</p>
             </div>
           </div>
         </div>

         <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition-shadow">
           <div className="flex items-center gap-4">
             <div className="p-3 bg-green-100 rounded-lg">
               <DollarSign className="h-6 w-6 text-green-600" />
             </div>
             <div>
               <p className="text-sm text-gray-600">Revenue</p>
               <p className="text-2xl font-bold">₹{stats.totalRevenue}</p>
               <p className="text-xs text-gray-500 mt-1">Total earnings</p>
             </div>
           </div>
         </div>

         <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition-shadow">
           <div className="flex items-center gap-4">
             <div className="p-3 bg-purple-100 rounded-lg">
               <TrendingUp className="h-6 w-6 text-purple-600" />
             </div>
             <div>
               <p className="text-sm text-gray-600">Completed Orders</p>
               <p className="text-2xl font-bold">{stats.completedOrders}</p>
               <p className="text-xs text-gray-500 mt-1">Delivered orders</p>
             </div>
           </div>
         </div>

         <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition-shadow">
           <div className="flex items-center gap-4">
             <div className="p-3 bg-yellow-100 rounded-lg">
               <Package className="h-6 w-6 text-yellow-600" />
             </div>
             <div>
               <p className="text-sm text-gray-600">Pending Orders</p>
               <p className="text-2xl font-bold">{stats.pendingOrders}</p>
               <p className="text-xs text-gray-500 mt-1">Awaiting action</p>
             </div>
           </div>
         </div>
       </div>

       {/* Revenue Chart */}
       <div className="bg-white p-6 rounded-xl border mt-6 hover:shadow-lg transition-shadow">
         <div className="flex justify-between items-center mb-6">
           <div>
             <h3 className="text-lg font-semibold">Revenue Trend</h3>
             <p className="text-sm text-gray-600">Revenue over time</p>
           </div>
           <div className="flex gap-2">
             {['week', 'month', 'year'].map((t) => (
               <button
                 key={t}
                 onClick={() => setTimeframe(t as 'week' | 'month' | 'year')}
                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                   timeframe === t
                     ? 'bg-blue-600 text-white'
                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                 }`}
               >
                 {t.charAt(0).toUpperCase() + t.slice(1)}
               </button>
             ))}
           </div>
         </div>
         <ResponsiveContainer width="100%" height={300}>
           <LineChart data={stats.revenueByDay}>
             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
             <XAxis 
               dataKey="date" 
               tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                 month: 'short', 
                 day: 'numeric' 
               })}
             />
             <YAxis 
               tickFormatter={(value) => `₹${value}`}
             />
             <Tooltip 
               formatter={(value: number) => [`₹${value}`, 'Revenue']}
               labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { 
                 weekday: 'long',
                 year: 'numeric',
                 month: 'long',
                 day: 'numeric'
               })}
             />
             <Line 
               type="monotone" 
               dataKey="revenue" 
               stroke="#2563eb" 
               strokeWidth={2}
               dot={{ r: 4 }}
               activeDot={{ r: 6 }}
             />
           </LineChart>
         </ResponsiveContainer>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
         {/* Orders by Status */}
         <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition-shadow">
           <h3 className="text-lg font-semibold mb-2">Orders by Status</h3>
           <p className="text-sm text-gray-600 mb-6">Current order status distribution</p>
           <div className="space-y-4">
             {stats.ordersByStatus.map((item) => (
               <div key={item.status} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className={`w-3 h-3 rounded-full ${
                     item.status === 'completed' ? 'bg-green-500' :
                     item.status === 'pending' ? 'bg-yellow-500' :
                     item.status === 'inProgress' ? 'bg-blue-500' :
                     'bg-gray-500'
                   }`} />
                   <span className="capitalize text-gray-700">{item.status}</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="font-semibold">{item.count}</span>
                   <span className="text-sm text-gray-500">orders</span>
                 </div>
               </div>
             ))}
           </div>
         </div>

         {/* Top Services */}
         <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition-shadow">
           <h3 className="text-lg font-semibold mb-2">Popular Services</h3>
           <p className="text-sm text-gray-600 mb-6">Most ordered items</p>
           <div className="space-y-4">
             {stats.topServices.map((service, index) => (
               <div key={service.name} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                     <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                   </div>
                   <span className="text-gray-700">{service.name}</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="font-semibold">{service.count}</span>
                   <span className="text-sm text-gray-500">orders</span>
                 </div>
               </div>
             ))}
           </div>
         </div>
       </div>
     </main>

     {/* Bottom Navigation */}
     <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-7xl mx-auto flex justify-around py-3">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="flex flex-col items-center text-blue-600"
          >
            <Home size={20} />
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          <button 
            onClick={() => setCurrentView('orders')}
            className="flex flex-col items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Package size={20} />
            <span className="text-xs mt-1">Orders</span>
          </button>
          <button 
            onClick={() => setCurrentView('settings')}
            className="flex flex-col items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Settings size={20} />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </div>
   </div>
 );
};