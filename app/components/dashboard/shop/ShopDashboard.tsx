'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, DollarSign, TrendingUp, Clock, Settings, Home, Store, Bell, User } from 'lucide-react';
import { apiService } from '@/app/services/api';
import { toast } from 'react-hot-toast';
import { TopNav } from '../../../common/TopNav';
import { ShopOrders } from './ShopOrders';
import { ShopSettings } from './ShopSettings';

type ViewType = 'dashboard' | 'orders' | 'settings';

interface DashboardStats {
  overview: {
    completedOrders: number;
    newOrders: number;
    processingOrders: number;
    readyOrders: number;
    totalOrders: number;
    totalRevenue: number
  }
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

// Utility function for currency formatting
const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const getStatusColor = (status: string): { bg: string; text: string; dot: string } => {
  const statusMap: { [key: string]: { bg: string; text: string; dot: string } } = {
    'pending': {
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      dot: 'bg-yellow-400'
    },
    'inprogress': {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      dot: 'bg-blue-400'
    },
    'accepted': {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      dot: 'bg-indigo-400'
    },
    'completed': {
      bg: 'bg-green-50',
      text: 'text-green-600',
      dot: 'bg-green-400'
    },
    'delivered': {
      bg: 'bg-teal-50',
      text: 'text-teal-600',
      dot: 'bg-teal-400'
    },
    'cancelled': {
      bg: 'bg-red-50',
      text: 'text-red-600',
      dot: 'bg-red-400'
    }
  };

  return statusMap[status.toLowerCase()] || {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    dot: 'bg-gray-400'
  };
};

export const ShopDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(`/shop/dashboard-stats?timeframe=${timeframe}`);
      console.log("---------response--------")
      console.log(response)
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="h-[140px] bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold mt-1">{stats.overview.totalOrders}</p>
                <p className="text-xs text-gray-500 mt-1">All time orders</p>
              </div>
            </div>
          </div>

          <div className="h-[140px] bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-xl">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold mt-1">{stats.overview.totalRevenue}</p>
                <p className="text-xs text-gray-500 mt-1">Total earnings</p>
              </div>
            </div>
          </div>

          <div className="h-[140px] bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-xl">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                <p className="text-2xl font-bold mt-1">{stats.overview.completedOrders}</p>
                <p className="text-xs text-gray-500 mt-1">Successfully delivered</p>
              </div>
            </div>
          </div>

          <div className="h-[140px] bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-50 rounded-xl">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Orders To Be Completed</p>
                <p className="text-2xl font-bold mt-1">{stats.overview.processingOrders +  stats.overview.newOrders}</p>
                <p className="text-xs text-gray-500 mt-1">Awaiting action</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm h-[400px]">
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
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        timeframe === t
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.revenueByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                      labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', {
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
            </div>
          </div>

          {/* Order Status */}
          <div className="h-[400px] bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">Order Status</h3>
                <p className="text-sm text-gray-600">Current distribution</p>
              </div>
            </div>
            <div className="space-y-4 mt-4">
              {stats.ordersByStatus.map((status) => {
                const colors = getStatusColor(status.status);
                return (
                  <div
                    key={status.status}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg pb-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                      <span className="font-medium capitalize">{status.status}</span>
                    </div>
                    <span className={`font-bold ${colors.text}`}>{status.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Popular Services */}
        <div className="mt-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Popular Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.topServices.map((service, index) => (
                <div
                  key={service.name}
                  className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      index === 0 ? 'bg-yellow-100 text-yellow-600' :
                      index === 1 ? 'bg-blue-100 text-blue-600' :
                      index === 2 ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.count} orders</p>
                    </div>
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
          {[
            { view: 'dashboard', icon: Home, label: 'Dashboard' },
            { view: 'orders', icon: Package, label: 'Orders' },
            { view: 'settings', icon: Settings, label: 'Settings' }
          ].map(({ view, icon: Icon, label }) => (
            <button
              key={view}
              onClick={() => setCurrentView(view as ViewType)}
              className={`flex flex-col items-center transition-colors ${
                currentView === view ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;