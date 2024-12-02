'use client';

import { useState } from 'react';
import { Package, Search } from 'lucide-react';
import { TopNav } from '../../../common/TopNav';
import { StatusBadge } from '../../../common/StatusBadge';
import { OrderStatus } from '@/app/types';

interface ShopOrdersProps {
  onNavigate: (view: 'dashboard' | 'orders' | 'settings') => void;
}

interface Order {
  id: string;
  customerName: string;
  items: { type: string; count: number }[];
  status: OrderStatus;
  pickupTime: string;
  totalAmount: string;
  date: string;
}

export const ShopOrders = ({ onNavigate }: ShopOrdersProps) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'inProgress' | 'completed'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const orders: Order[] = [
    {
      id: "ORD001",
      customerName: "John Doe",
      items: [
        { type: "Shirts", count: 3 },
        { type: "Pants", count: 2 }
      ],
      status: "completed",
      pickupTime: "2:00 PM",
      totalAmount: "₹250",
      date: "Today"
    },
    {
      id: "ORD002",
      customerName: "Jane Smith",
      items: [
        { type: "Dresses", count: 2 },
        { type: "Shirts", count: 1 }
      ],
      status: "inProgress",
      pickupTime: "3:30 PM",
      totalAmount: "₹180",
      date: "Today"
    }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      (activeTab === 'pending' && order.status === 'pending') ||
      (activeTab === 'inProgress' && order.status === 'inProgress') ||
      (activeTab === 'completed' && order.status === 'completed');

    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav userType="Shop Owner" onNotificationClick={() => {}} />

      {/* Tabs */}
      <div className="fixed top-16 left-0 right-0 bg-white border-b z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-6">
            {(['pending', 'inProgress', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 text-sm font-medium relative ${
                  activeTab === tab ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                {tab === 'inProgress' ? 'In Progress' : 
                  tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <div key={order.id} className="bg-white border rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">{order.customerName}</h3>
                    <p className="text-sm text-gray-600">Order #{order.id}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Items:</p>
                  {order.items.map((item, index) => (
                    <p key={index} className="text-sm">
                      {item.count}x {item.type}
                    </p>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Pickup Time</p>
                      <p className="font-medium">{order.pickupTime}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-medium">{order.totalAmount}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No orders found</p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-7xl mx-auto flex justify-around py-3">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="text-gray-400 flex flex-col items-center hover:text-gray-600"
          >
            <Package className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          <button 
            className="text-blue-600 flex flex-col items-center"
          >
            <Package className="h-5 w-5" />
            <span className="text-xs mt-1">Orders</span>
          </button>
          <button 
            onClick={() => onNavigate('settings')}
            className="text-gray-400 flex flex-col items-center hover:text-gray-600"
          >
            <Package className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};