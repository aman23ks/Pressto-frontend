import { useState, useEffect } from 'react';
import { Package, Search, Settings } from 'lucide-react';
import { TopNav } from '../../../common/TopNav';
import { StatusBadge } from '../../../common/StatusBadge';
import { apiService } from '@/app/services/api';
import { toast } from 'react-hot-toast';

type OrderStatus = 'pending' | 'accepted' | 'pickedUp' | 'inProgress' | 'completed' | 'delivered' | 'cancelled';
type TabType = 'new' | 'processing' | 'ready' | 'history';

interface Order {
  id: string;
  customerName: string;
  items: { type: string; count: number; }[];
  status: OrderStatus;
  pickup_date: string;
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

interface OrdersResponse {
  orders: Order[];
  counts: Record<TabType, number>;
}

interface ShopOrdersProps {
  onNavigate: (view: 'dashboard' | 'orders' | 'settings') => void;
}

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  'pending': ['accepted', 'cancelled'],
  'accepted': ['pickedUp', 'cancelled'],
  'pickedUp': ['inProgress', 'cancelled'],
  'inProgress': ['completed', 'cancelled'],
  'completed': ['delivered'],
  'delivered': [],
  'cancelled': []
};

const STATUS_INFO: Record<OrderStatus, { text: string; color: string }> = {
  'pending': { text: 'New order request', color: 'text-yellow-600' },
  'accepted': { text: 'Order accepted, awaiting pickup', color: 'text-blue-600' },
  'pickedUp': { text: 'Items picked up', color: 'text-purple-600' },
  'inProgress': { text: 'Processing order', color: 'text-indigo-600' },
  'completed': { text: 'Ready for delivery', color: 'text-green-600' },
  'delivered': { text: 'Order delivered', color: 'text-teal-600' },
  'cancelled': { text: 'Order cancelled', color: 'text-red-600' }
};

export const ShopOrders = ({ onNavigate }: ShopOrdersProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderCounts, setOrderCounts] = useState<Record<TabType, number>>({
    new: 0,
    processing: 0,
    ready: 0,
    history: 0
  });
  const [loading, setLoading] = useState(true);

  const formatDate = (dateInput: any): string => {
    try {
      // If it's a plain string date (like "2024-12-20"), return it directly
      if (typeof dateInput === 'string' && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateInput;
      }
  
      // Handle MongoDB date format
      if (dateInput && typeof dateInput === 'object' && '$date' in dateInput) {
        return new Date(dateInput.$date).toISOString().split('T')[0];
      }
  
      // Handle regular date strings or Date objects
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid Date');
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.warn('Error formatting date:', dateInput, error);
      return 'Invalid Date';
    }
  };
  
  // Then, update the getFilteredOrders function
  const getFilteredOrders = () => {
    return orders.filter(order => {
      // Search filter
      const matchesSearch = 
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Date filter
      let matchesDate = true;
      if (selectedDate) {
        try {
          const orderDateStr = formatDate(order.pickup_date);
          if (orderDateStr === 'Invalid Date') return false;
          matchesDate = orderDateStr === selectedDate;
        } catch (error) {
          console.warn('Error comparing dates:', error);
          matchesDate = false;
        }
      }
  
      return matchesSearch && matchesDate;
    });
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<OrdersResponse>('/shop/orders');
      
      const allOrders = response.data.orders;
      const counts = {
        new: allOrders.filter(order => order.status === 'pending').length,
        processing: allOrders.filter(order => ['accepted', 'pickedUp', 'inProgress'].includes(order.status)).length,
        ready: allOrders.filter(order => order.status === 'completed').length,
        history: allOrders.filter(order => ['delivered', 'cancelled'].includes(order.status)).length
      };
      
      setOrderCounts(counts);
      const filteredOrders = filterOrdersByTab(allOrders, activeTab);
      setOrders(filteredOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrdersByTab = (allOrders: Order[], tab: TabType) => {
    switch (tab) {
      case 'new':
        return allOrders.filter(order => order.status === 'pending');
      case 'processing':
        return allOrders.filter(order => ['accepted', 'pickedUp', 'inProgress'].includes(order.status));
      case 'ready':
        return allOrders.filter(order => order.status === 'completed');
      case 'history':
        return allOrders.filter(order => ['delivered', 'cancelled'].includes(order.status));
      default:
        return allOrders;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await apiService.put(`/shop/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  const getActionButtons = (order: Order) => {
    const availableTransitions = STATUS_TRANSITIONS[order.status];
    
    switch (order.status) {
      case 'pending':
        return (
          <div className="flex gap-3 mt-4">
            {availableTransitions.includes('accepted') && (
              <button 
                onClick={() => updateOrderStatus(order.id, 'accepted')}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Accept Order
              </button>
            )}
            {availableTransitions.includes('cancelled') && (
              <button 
                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg hover:bg-gray-200"
              >
                Decline
              </button>
            )}
          </div>
        );
      case 'accepted':
        return availableTransitions.includes('pickedUp') && (
          <button 
            onClick={() => updateOrderStatus(order.id, 'pickedUp')}
            className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
          >
            Mark as Picked Up
          </button>
        );
      case 'pickedUp':
        return availableTransitions.includes('inProgress') && (
          <button 
            onClick={() => updateOrderStatus(order.id, 'inProgress')}
            className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            Start Processing
          </button>
        );
      case 'inProgress':
        return availableTransitions.includes('completed') && (
          <button 
            onClick={() => updateOrderStatus(order.id, 'completed')}
            className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Mark as Ready
          </button>
        );
      case 'completed':
        return availableTransitions.includes('delivered') && (
          <button 
            onClick={() => updateOrderStatus(order.id, 'delivered')}
            className="w-full mt-4 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700"
          >
            Mark as Delivered
          </button>
        );
      default:
        return null;
    }
  };

  const filteredOrders = getFilteredOrders();
  const tabs: TabType[] = ['new', 'processing', 'ready', 'history'];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav userType="Shop Owner" onNotificationClick={() => {}} />

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

      <main className="max-w-7xl mx-auto px-4 pt-20 pb-20">
        <div className="mb-6 space-y-4">
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
          
          <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="text-gray-600 font-medium">Filter by Pickup Date</div>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Clear Filter
                <span className="ml-2">×</span>
              </button>
            )}
          </div>
        </div>

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
                        Order #{order.id} • {formatDate(order.created_at)}
                      </p>
                      <p className={`text-sm mt-1 ${STATUS_INFO[order.status].color}`}>
                        {STATUS_INFO[order.status].text}
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
                        <p className="font-medium">{formatDate(order.pickup_date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="font-medium">₹{order.totalAmount}</p>
                      </div>
                    </div>
                    
                    {getActionButtons(order)}
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
