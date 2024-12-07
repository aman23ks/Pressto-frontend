'use client';

import { useState, useEffect } from 'react';
import { Package, Search } from 'lucide-react';
import { StatusBadge } from '../../../common/StatusBadge';
import { OrderStatus } from '@/app/types';
import { apiService } from '@/app/services/api';
import { toast } from 'react-hot-toast';

interface OrderItem {
  type: string;
  count: number;
}

interface Order {
  id: string;
  shopName: string;
  items: OrderItem[];
  status: OrderStatus;
  pickup_date: string;
  // pickup_time: string;
  // delivery_time: string;
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

interface OrdersProps {
  onNavigate: (view: 'dashboard' | 'orders' | 'settings') => void;
}

export const Orders: React.FC<OrdersProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const orderType = activeTab === 'active' ? 'active' : 'history';
      const endpoint = `/customer/orders?type=${orderType}`;
      console.log('Fetching orders:', endpoint);
      
      const response = await apiService.get(endpoint);
      console.log('Response data:', response.data);
      
      const formattedOrders = response.data.map((order: any) => ({
        ...order,
        pickup_date: new Date(order.pickup_date).toLocaleDateString(),
        // pickup_time: order.pickup_time ? new Date(order.pickup_time).toLocaleString([], {
        //   weekday: 'short',
        //   hour: '2-digit',
        //   minute: '2-digit'
        // }) : null,
        // delivery_time: order.delivery_time ? new Date(order.delivery_time).toLocaleString([], {
        //   weekday: 'short',
        //   hour: '2-digit',
        //   minute: '2-digit'
        // }) : null,
        created_at: order.created_at?.$date ? 
          new Date(order.created_at.$date).toLocaleDateString() :
          new Date(order.created_at).toLocaleDateString()
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
  }, [activeTab]);

  const filteredOrders = orders.filter(order =>
    order.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTotalItems = (items: OrderItem[]) => 
    items.reduce((acc, item) => acc + item.count, 0);

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
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-white border rounded-xl p-6 hover:border-gray-300 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{order.shopName}</h4>
                      <p className="text-sm text-gray-600">
                        Order #{order.id} • {order.created_at}
                      </p>
                    </div>
                    {activeTab === 'active' ? (
                      <StatusBadge status={order.status} />
                    ) : (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    )}
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

                  {activeTab === 'active' && (
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-1 gap-6 text-sm">
                        <div>
                          <p className="text-gray-600">Pickup Date</p>
                          <p className="font-medium">{order.pickup_date}</p>
                        </div>
                        {/* Time display commented out */}
                        {/* <div>
                          <p className="text-gray-600">Pickup Time</p>
                          <p className="font-medium">{order.pickup_time}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Delivery Time</p>
                          <p className="font-medium">{order.delivery_time}</p>
                        </div> */}
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