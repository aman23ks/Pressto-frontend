'use client';

import { useState } from 'react';
import { Package, ArrowLeft, ChevronRight, Search } from 'lucide-react';
import { StatusBadge } from '../../../common/StatusBadge';
import { OrderStatus } from '@/app/types';

interface Order {
  id: string;
  shopName?: string;
  date: string;
  items: number;
  status: OrderStatus;
  totalAmount: string;
  pickupTime?: string;
  deliveryTime?: string;
}

interface OrdersProps {
  onNavigate: (view: 'dashboard' | 'orders' | 'settings') => void;
}

export const Orders: React.FC<OrdersProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const orders: Order[] = [
    {
      id: "ORD001",
      shopName: "Premium Pressers",
      date: "Today",
      items: 5,
      status: "inProgress",
      totalAmount: "₹250",
      pickupTime: "2:00 PM",
      deliveryTime: "Tomorrow, 10:00 AM"
    },
    {
      id: "ORD002",
      shopName: "Swift Iron Services",
      date: "Yesterday",
      items: 3,
      status: "pending",
      totalAmount: "₹150",
      pickupTime: "Tomorrow, 11:00 AM",
      deliveryTime: "Tomorrow, 6:00 PM"
    },
    {
      id: "ORD003",
      date: "2 days ago",
      items: 4,
      status: "completed",
      totalAmount: "₹200"
    },
    {
      id: "ORD004",
      date: "3 days ago",
      items: 4,
      status: "completed",
      totalAmount: "₹200"
    }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'active' ? 
      ['pending', 'inProgress'].includes(order.status) : 
      order.status === 'completed';
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-xl font-bold">Orders</h1>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 pt-2">
          <div className="flex space-x-6 border-b">
            <button
              onClick={() => setActiveTab('active')}
              className={`pb-3 px-2 text-sm font-medium ${
                activeTab === 'active'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600'
              }`}
            >
              Active Orders
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`pb-3 px-2 text-sm font-medium ${
                activeTab === 'completed'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600'
              }`}
            >
              Order History
            </button>
          </div>
        </div>
      </div>

      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-white border rounded-xl p-6 hover:border-gray-300 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {order.shopName || `Order #${order.id}`}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {order.date} • {order.items} items
                      </p>
                    </div>
                    {activeTab === 'active' ? (
                      <StatusBadge status={order.status} />
                    ) : (
                      <span className="text-gray-600">₹{order.totalAmount}</span>
                    )}
                  </div>
                  
                  {activeTab === 'active' && order.pickupTime && order.deliveryTime && (
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-2 gap-6 text-sm">
                        <div>
                          <p className="text-gray-600">Pickup</p>
                          <p className="font-medium">{order.pickupTime}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Delivery</p>
                          <p className="font-medium">{order.deliveryTime}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No orders found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-7xl mx-auto px-6 flex justify-around py-3">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="flex flex-col items-center text-gray-400 hover:text-gray-600"
          >
            <Package className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button 
            className="flex flex-col items-center text-blue-600"
          >
            <Package className="h-5 w-5" />
            <span className="text-xs mt-1">Orders</span>
          </button>
          <button 
            onClick={() => onNavigate('settings')}
            className="flex flex-col items-center text-gray-400 hover:text-gray-600"
          >
            <Package className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};