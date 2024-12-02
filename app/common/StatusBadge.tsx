'use client';

import { OrderStatus } from '@/app/types';

export const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    received: "bg-blue-100 text-blue-800",
    inProgress: "bg-purple-100 text-purple-800",
    ready: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};