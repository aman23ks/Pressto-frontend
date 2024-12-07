'use client';

import { useState, useEffect } from 'react';
import { Package, Search, Settings } from 'lucide-react';
import { TopNav } from '../../../common/TopNav';
import { StatusBadge } from '../../../common/StatusBadge';
import { OrderStatus } from '@/app/types';
import { apiService } from '@/app/services/api';
import { toast } from 'react-hot-toast';

interface ShopOrdersProps {
  onNavigate: (view: 'dashboard' | 'orders' | 'settings') => void;
}

interface Order {
  id: string;
  customerName: string;
  items: { type: string; count: number }[];
  status: OrderStatus;
  pickup_date: string;
  // pickup_time: string;
  totalAmount: number;
  created_at: string;
  pickup_address: {
    street?: string;
    landmark?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

export const ShopOrders = ({ onNavigate }: ShopOrdersProps) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'inProgress' | 'completed'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/shop/orders');
      
      // Format the orders data
      const formattedOrders = response.data.map((order: any) => ({
        id: order.id,
        customerName: order.customerName,
        items: order.items,
        status: order.status,
        pickup_date: order.pickup_date,
        // pickup_time: new Date(order.pickup_time).toLocaleTimeString([], {
        //   hour: '2-digit',
        //   minute: '2-digit'
        // }),
        totalAmount: order.totalAmount,
        created_at: new Date(order.created_at.$date).toLocaleDateString(),
        pickup_address: order.pickup_address || {}
      }));

      setOrders(formattedOrders);
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

  // Handle order status updates
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await apiService.put(`/shop/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated successfully');
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

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

      <main className="max-w-7xl mx-auto px-4 pt-20 pb-20">
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
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <div key={order.id} className="bg-white border rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium">{order.customerName}</h3>
                      <p className="text-sm text-gray-600">
                        Order #{order.id} • {order.created_at}
                      </p>
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
                    <div className="flex justify-between items-center">
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
                      <div className="flex gap-3 mt-4">
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'inProgress')}
                          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg hover:bg-gray-200"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    
                    {order.status === 'inProgress' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                      >
                        Mark as Completed
                      </button>
                    )}
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
        )}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-7xl mx-auto flex justify-around py-3">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="text-gray-400 flex flex-col items-center hover:text-gray-600"
          >
            <Package size={20} />
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          <button 
            className="text-blue-600 flex flex-col items-center"
          >
            <Package size={20} />
            <span className="text-xs mt-1">Orders</span>
          </button>
          <button 
            onClick={() => onNavigate('settings')}
            className="text-gray-400 flex flex-col items-center hover:text-gray-600"
          >
            <Settings size={20} />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};