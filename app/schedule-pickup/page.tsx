// app/schedule-pickup/page.tsx
'use client';

import { SchedulePickup } from '@/app/components/dashboard/customer/SchedulePickup';
import { useRouter } from 'next/navigation';

export default function SchedulePickupPage() {
  const router = useRouter();
  
  return (
    <SchedulePickup 
      onBack={() => router.back()}
    />
  );
}