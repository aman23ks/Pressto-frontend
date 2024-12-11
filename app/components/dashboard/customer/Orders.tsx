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

type TabType = 'New' | 'Processing' | 'Ready' | 'History';

const TAB_STATUS_MAP: Record<TabType, OrderStatus[]> = {
  'New': ['pending'],
  'Processing': ['accepted', 'pickedUp', 'inProgress'],
  'Ready': ['completed'],
  'History': ['delivered', 'cancelled']
};

const STATUS_INFO: Record<OrderStatus, { text: string; color: string }> = {
  'pending': { text: 'Waiting for shop confirmation', color: 'text-yellow-600' },
  'accepted': { text: 'Order accepted, arranging pickup', color: 'text-blue-600' },
  'pickedUp': { text: 'Items picked up', color: 'text-purple-600' },
  'inProgress': { text: 'Your clothes are being ironed', color: 'text-indigo-600' },
  'completed': { text: 'Ready for delivery', color: 'text-green-600' },
  'delivered': { text: 'Order delivered', color: 'text-teal-600' },
  'cancelled': { text: 'Order cancelled', color: 'text-red-600' }
};

export const Orders: React.FC<OrdersProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TabType>('New');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Remove type parameter to get all orders
      const response = await apiService.get('/customer/orders');
      
      const formattedOrders = response.data.map((order: any) => ({
        ...order,
        pickup_date: new Date(order.pickup_date).toLocaleDateString(),
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

  const getOrderCountsByTab = (orders: Order[]) => {
    return Object.entries(TAB_STATUS_MAP).reduce((acc, [tab, statuses]) => ({
      ...acc,
      [tab]: orders.filter(order => statuses.includes(order.status)).length
    }), {} as Record<TabType, number>);
  };

  const getFilteredOrders = () => {
    return orders.filter(order => {
      const matchesSearch = 
        order.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter based on active tab statuses
      const matchesTab = TAB_STATUS_MAP[activeTab].includes(order.status);
      
      return matchesSearch && matchesTab;
    });
  };

  const getTotalItems = (items: OrderItem[]) => 
    items.reduce((acc, item) => acc + item.count, 0);

  const filteredOrders = getFilteredOrders();
  const orderCounts = getOrderCountsByTab(orders);
  const tabs: TabType[] = ['New', 'Processing', 'Ready', 'History'];

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-xl font-bold">Orders</h1>
        </div>

      {/* Tabs */}
      <div className="fixed top-16 left-0 right-0 bg-white border-b z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 text-sm font-medium relative flex items-center capitalize
                  ${activeTab === tab ? 'text-blue-600' : 'text-gray-600'}`}
              >
                <span className="mr-2">{tab}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs
                  ${activeTab === tab 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {orderCounts[tab]}
                </span>
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>
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
                  className="bg-white border rounded-xl p-6 hover:border-gray-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{order.shopName}</h4>
                      <p className="text-sm text-gray-600">
                        Order #{order.id} • {order.created_at}
                      </p>
                      <p className={`text-sm mt-1 ${STATUS_INFO[order.status].color}`}>
                        {STATUS_INFO[order.status].text}
                      </p>
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
                        <p className="text-gray-600">Pickup Date</p>
                        <p className="font-medium">{order.pickup_date}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Order Date</p>
                        <p className="font-medium">{order.created_at}</p>
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