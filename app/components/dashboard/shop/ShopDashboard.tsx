'use client';

import { useState, useEffect } from 'react';
import { Home, Package, Settings } from 'lucide-react';
import { TopNav } from '../../../common/TopNav';
import { StatusBadge } from '../../../common/StatusBadge';
import { Order } from '@/app/types';
import { ShopOrders } from './ShopOrders';
import { ShopSettings } from './ShopSettings';
import { toast } from 'react-hot-toast';
import { apiService } from '@/app/services/api';

interface DashboardStats {
  todayOrders: number;
  pending: number;
  completed: number;
}

export const ShopDashboard = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'orders' | 'settings'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    todayOrders: 0,
    pending: 0,
    completed: 0
  });

  // Fetch orders and calculate stats
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/shop/orders');
      const orders = response.data;
      
      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = orders.filter((order: any) => {
        const orderDate = new Date(order.created_at.$date).toISOString().split('T')[0];
        return orderDate === today;
      }).length;

      const pendingOrders = orders.filter((order: any) => 
        order.status === 'pending').length;
      const completedOrders = orders.filter((order: any) => 
        order.status === 'completed').length;

      // Format orders for display
      const formattedOrders = orders.map((order: any) => ({
        id: order.id,
        customerName: order.customerName,
        status: order.status,
        pickup_date: new Date(order.pickup_date).toLocaleDateString(),
        // pickup_time: new Date(order.pickup_time).toLocaleTimeString([], { 
        //   hour: '2-digit', 
        //   minute: '2-digit' 
        // }),
        items: order.items,
        totalAmount: order.totalAmount,
        pickup_address: order.pickup_address || {}
      }));

      setOrders(formattedOrders);
      setStats({
        todayOrders,
        pending: pendingOrders,
        completed: completedOrders
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle status updates
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      await apiService.put(`/shop/orders/${orderId}/status`, 
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleAccept = (orderId: string) => {
    updateOrderStatus(orderId, 'inProgress');
  };

  const handleDecline = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled');
  };

  const handleComplete = (orderId: string) => {
    updateOrderStatus(orderId, 'completed');
  };

  if (currentView === 'orders') {
    return <ShopOrders onNavigate={setCurrentView} />;
  }

  if (currentView === 'settings') {
    return <ShopSettings onNavigate={setCurrentView} />;
  }

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
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
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

                    {/* Address Section */}
                    <div className="mb-4 border-t pt-4">
                      <p className="text-sm text-gray-600 mb-2">Pickup Address:</p>
                      <p className="text-sm">
                        {order.pickup_address.street}
                        {order.pickup_address.landmark && `, ${order.pickup_address.landmark}`}
                      </p>
                      <p className="text-sm">
                        {order.pickup_address.city}
                        {order.pickup_address.state && `, ${order.pickup_address.state}`} - 
                        {order.pickup_address.pincode}
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Pickup Date</p>
                          <p className="font-medium">{order.pickup_date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Amount</p>
                          <p className="font-medium">₹{order.totalAmount}</p>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
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
          )}
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