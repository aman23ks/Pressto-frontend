// components/common/StatusBadge.tsx
'use client';

interface StatusBadgeProps {
  status: 'pending' | 'accepted' | 'pickedUp' | 'inProgress' | 'completed' | 'delivered' | 'cancelled';
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusColors: Record<StatusBadgeProps['status'], string> = {
    'pending': "bg-yellow-100 text-yellow-800",
    'accepted': "bg-blue-100 text-blue-800",
    'pickedUp': "bg-purple-100 text-purple-800",
    'inProgress': "bg-indigo-100 text-indigo-800",
    'completed': "bg-green-100 text-green-800",
    'delivered': "bg-teal-100 text-teal-800",
    'cancelled': "bg-red-100 text-red-800"
  };

  const statusDisplay: Record<StatusBadgeProps['status'], string> = {
    'pending': "Pending",
    'accepted': "Accepted",
    'pickedUp': "Picked Up",
    'inProgress': "In Progress",
    'completed': "Completed",
    'delivered': "Delivered",
    'cancelled': "Cancelled"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
      {statusDisplay[status]}
    </span>
  );
};