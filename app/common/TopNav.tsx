'use client';

import { Bell, Store, User } from 'lucide-react';

interface TopNavProps {
  userType: string;
  onNotificationClick: () => void;
}

export const TopNav = ({ userType, onNotificationClick }: TopNavProps) => (
  <div className="bg-white border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <Store className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold">IronEase</span>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={onNotificationClick}>
            <Bell className="h-6 w-6 text-gray-500" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <span className="text-sm font-medium">{userType}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);