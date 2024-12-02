'use client';

import { useState } from 'react';
import { Home, Package, Settings } from 'lucide-react';
import { TopNav } from '../../../common/TopNav';
import { StatusBadge } from '../../../common/StatusBadge';
import { Order } from '@/app/types';
import { ShopOrders } from './ShopOrders';
import { ShopSettings } from './ShopSettings';

interface DashboardStats {
  todayOrders: number;
  pending: number;
  completed: number;
}

export const ShopDashboard = () => {
  // View State
  const [currentView, setCurrentView] = useState<'dashboard' | 'orders' | 'settings'>('dashboard');

  // Stats State
  const [stats, setStats] = useState<DashboardStats>({
    todayOrders: 12,
    pending: 5,
    completed: 7
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD001",
      customerName: "John Doe",
      items: [
        { type: "Shirts", count: 3 },
        { type: "Pants", count: 2 }
      ],
      status: "pending",
      pickupTime: "2:00 PM",
      totalAmount: "₹250"
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
      totalAmount: "₹180"
    }
  ]);

  // Handle Order Status Update
  const updateStatus = (orderId: string, newStatus: 'pending' | 'inProgress' | 'completed' | 'cancelled') => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          // Update stats based on status change
          if (newStatus === 'completed' && order.status !== 'completed') {
            setStats(prev => ({
              ...prev,
              completed: prev.completed + 1,
              pending: Math.max(0, prev.pending - 1)
            }));
          } else if (newStatus === 'cancelled' && order.status === 'pending') {
            setStats(prev => ({
              ...prev,
              pending: Math.max(0, prev.pending - 1)
            }));
          }
          return { ...order, status: newStatus };
        }
        return order;
      })
    );
  };

  // Handle Order Actions
  const handleAccept = (orderId: string) => {
    updateStatus(orderId, 'inProgress');
    setStats(prev => ({
      ...prev,
      pending: Math.max(0, prev.pending - 1)
    }));
  };

  const handleDecline = (orderId: string) => {
    updateStatus(orderId, 'cancelled');
    setStats(prev => ({
      ...prev,
      pending: Math.max(0, prev.pending - 1)
    }));
  };

  const handleComplete = (orderId: string) => {
    updateStatus(orderId, 'completed');
    setStats(prev => ({
      ...prev,
      completed: prev.completed + 1
    }));
  };

  // Render different views based on currentView state
  if (currentView === 'orders') {
    return <ShopOrders onNavigate={setCurrentView} />;
  }

  if (currentView === 'settings') {
    return <ShopSettings onNavigate={setCurrentView} />;
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav userType="Shop Owner" onNotificationClick={() => {}} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border p-4">
            <p className="text-gray-600 text-sm">Today's Orders</p>
            <p className="text-2xl font-bold mt-1">{stats.todayOrders}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-2xl font-bold mt-1">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-gray-600 text-sm">Completed</p>
            <p className="text-2xl font-bold mt-1">{stats.completed}</p>
          </div>
        </div>

        {/* New Orders */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">New Orders</h2>
          <div className="space-y-4">
            {orders.length > 0 ? (
              orders.map(order => (
                <div key={order.id} className="bg-white rounded-xl border p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium">{order.customerName}</h3>
                      <p className="text-sm text-gray-600">Order #{order.id}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Items:</p>
                    <div className="space-y-1">
                      {Array.isArray(order.items) && order.items.map((item, index) => (
                        <p key={index} className="text-sm">
                          {item.count}x {item.type}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Pickup Time</p>
                        <p className="font-medium">{order.pickupTime}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="font-medium">{order.totalAmount}</p>
                      </div>
                    </div>
                    
                    {/* Action Buttons based on status */}
                    {order.status === 'pending' && (
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleAccept(order.id)}
                          className="flex-1 bg-blue-600 text-white py-3 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleDecline(order.id)}
                          className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {order.status === 'inProgress' && (
                      <button 
                        onClick={() => handleComplete(order.id)}
                        className="w-full bg-green-600 text-white py-3 rounded-lg text-sm hover:bg-green-700 transition-colors"
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No new orders</p>
              </div>
            )}
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