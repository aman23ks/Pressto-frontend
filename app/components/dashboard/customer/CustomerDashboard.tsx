'use client';

import { useState, useEffect } from 'react';
import { Package, Search, Bell, User } from 'lucide-react';
import { StatusBadge } from '../../../common/StatusBadge';
import { NewOrder } from './NewOrder';
import { Orders } from './Orders';
import { Settings } from './Settings';
import { OrderStatus } from '@/app/types';
import { apiService } from '@/app/services/api';
import { toast } from 'react-hot-toast';

type ViewType = 'dashboard' | 'new-order' | 'orders' | 'settings';

interface OrderItem {
  type: string;
  count: number;
}

interface DashboardOrder {
  id: string;
  shopName: string;
  items: OrderItem[];
  status: OrderStatus;
  pickup_time: string;
  delivery_time: string;
  total_amount: number;
  pickup_address?: {
    street?: string;
    landmark?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  created_at: string;
}

interface Profile {
  name: string;
  email: string;
  phone: string;
}

const TopNav = () => (
  <div className="fixed top-0 left-0 right-0 border-b bg-white z-10">
    <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Package className="h-6 w-6 text-blue-600" />
        <span className="text-xl font-semibold">IronEase</span>
      </div>
      <div className="flex items-center gap-4">
        <Bell className="h-5 w-5 text-gray-600 cursor-pointer" />
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-gray-600" />
          <span className="text-sm">Customer</span>
        </div>
      </div>
    </div>
  </div>
);

export const CustomerDashboard = () => {
  const [view, setView] = useState<ViewType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOrders, setActiveOrders] = useState<DashboardOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchActiveOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/customer/orders?type=active');
      
      const formattedOrders = response.data.map((order: any) => ({
        ...order,
        pickup_time: new Date(order.pickup_time).toLocaleString([], {
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit'
        }),
        delivery_time: new Date(order.delivery_time).toLocaleString([], {
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit'
        }),
        created_at: new Date(order.created_at.$date).toLocaleDateString()
      }));

      setActiveOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await apiService.get('/customer/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to fetch profile');
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchActiveOrders();
  }, []);

  const getTotalItems = (items: OrderItem[]) => 
    items.reduce((acc, item) => acc + item.count, 0);

  const filteredOrders = activeOrders.filter(order =>
    order.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (view === 'new-order') {
    return <NewOrder onBack={() => setView('dashboard')} />;
  }

  if (view === 'orders') {
    return <Orders onNavigate={setView} />;
  }
  
  if (view === 'settings') {
    return <Settings onNavigate={setView} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <TopNav />
      
      <div className="pt-16 pb-20 h-screen overflow-y-auto">
        <main className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mt-8 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {profile?.name || 'User'}
            </h1>
            <p className="text-gray-600 mt-1">What would you like to do today?</p>
          </div>

          {/* Quick Action */}
          <div className="mb-8">
            <button 
              onClick={() => setView('new-order')}
              className="w-full flex flex-col p-8 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition-colors"
            >
              <Package className="h-8 w-8 mb-4" />
              <h3 className="text-lg font-semibold mb-1">Book an Order</h3>
              <p className="text-sm text-blue-100">Get your clothes ironed</p>
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Active Orders */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Active Orders</h3>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <div 
                      key={order.id} 
                      className="bg-white border rounded-xl p-6 hover:border-gray-300 transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{order.shopName}</h4>
                          <p className="text-sm text-gray-600">Order #{order.id}</p>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>

                      {/* Items List */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Items:</p>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <p key={index} className="text-sm">
                              {item.count}x {item.type}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                        <span>Total: {getTotalItems(order.items)} items</span>
                        <span>₹{order.total_amount}</span>
                      </div>

                      <div className="border-t pt-4">
                        <div className="grid grid-cols-2 gap-6 text-sm">
                          <div>
                            <p className="text-gray-600">Pickup</p>
                            <p className="font-medium">{order.pickup_time}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Delivery</p>
                            <p className="font-medium">{order.delivery_time}</p>
                          </div>
                        </div>

                        {order.pickup_address && (
                          <div className="mt-4 text-sm">
                            <p className="text-gray-600">Pickup Address:</p>
                            <p className="mt-1">
                              {order.pickup_address.street}
                              {order.pickup_address.landmark && `, ${order.pickup_address.landmark}`}
                            </p>
                            <p>
                              {order.pickup_address.city}
                              {order.pickup_address.state && `, ${order.pickup_address.state}`} - 
                              {order.pickup_address.pincode}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white border rounded-xl">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No active orders</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-7xl mx-auto px-6 flex justify-around py-3">
          <button 
            onClick={() => setView('dashboard')}
            className={`flex flex-col items-center ${
              view === 'dashboard' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <Package className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button 
            onClick={() => setView('orders')}
            className="flex flex-col items-center text-gray-400 hover:text-gray-600"
          >
            <Package className="h-5 w-5" />
            <span className="text-xs mt-1">Orders</span>
          </button>
          <button 
            onClick={() => setView('settings')}
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