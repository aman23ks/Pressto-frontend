'use client';

import { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { apiService } from '@/app/services/api';
import { toast } from 'react-hot-toast';
import { 
 Package, 
 User, 
 ChevronRight, 
 Bell, 
 Phone, 
 Mail, 
 Shield, 
 HelpCircle,
 LogOut,
 Map
} from 'lucide-react';
import { TermsPage } from './TermsPage';
import HelpSupport from './HelpSupport';

interface SettingsProps {
 onNavigate: (view: 'dashboard' | 'orders' | 'settings') => void;
}

export const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
 const [notifications, setNotifications] = useState(true);
 const { user, logout } = useAuth();
 const [isLoggingOut, setIsLoggingOut] = useState(false);
 const [showTerms, setShowTerms] = useState(false);
 const [showHelpSupport, setShowHelpSupport] = useState(false);

 const handleLogout = async () => {
   try {
     setIsLoggingOut(true);
     const token = localStorage.getItem('token');
     await apiService.post('/auth/logout', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }}
     );
     logout(); // Clear auth context
     toast.success('Successfully logged out');
   } catch (error) {
     console.error('Logout failed:', error);
     toast.error('Failed to logout. Please try again.');
   } finally {
     setIsLoggingOut(false);
   }
 };

 const menuItems = [
   {
     title: 'Profile',
     description: 'Manage your personal information',
     icon: User,
     action: () => console.log('Navigate to profile')
   },
   {
     title: 'Addresses',
     description: 'Manage your saved addresses',
     icon: Map,
     action: () => console.log('Navigate to addresses')
   },
   {
     title: 'Notifications',
     description: notifications ? 'Notifications are enabled' : 'Notifications are disabled',
     icon: Bell,
     action: () => setNotifications(!notifications),
     toggle: true,
     enabled: notifications
   },
   {
     title: 'Contact Us',
     description: 'Get help or send feedback',
     icon: Phone,
     action: () => setShowHelpSupport(true)
   },
   {
     title: 'About',
     description: 'Terms of service and privacy policy',
     icon: HelpCircle,
     action: () => setShowTerms(true)
   }
 ];

  if (showTerms) {
    return <TermsPage onBack={() => setShowTerms(false)} />;
  }

  if (showHelpSupport) {
    return (
      <HelpSupport 
        onBack={() => setShowHelpSupport(false)}
        userDetails={{
          name: user?.name ?? '',
          email: user?.email ?? '',
          phone: user?.phone ?? ''
        }}
      />
    );
  }

 return (
   <div className="min-h-screen bg-white">
     <div className="fixed top-0 left-0 right-0 bg-white border-b z-10">
       <div className="max-w-7xl mx-auto px-6 py-4">
         <h1 className="text-xl font-bold">Settings</h1>
       </div>
     </div>

     <div className="pt-24 pb-20">
       <div className="max-w-7xl mx-auto px-6">
         {/* Profile Card */}
         <div className="bg-white border rounded-xl p-6 mb-6">
           <div className="flex items-center">
             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
               <User className="h-8 w-8 text-blue-600" />
             </div>
             <div className="ml-4">
               <h2 className="text-lg font-semibold">{user?.name || 'User'}</h2>
               <p className="text-gray-600">{user?.phone || 'No phone added'}</p>
             </div>
           </div>
         </div>

         {/* Settings Menu */}
         <div className="space-y-4">
           {menuItems.map((item, index) => (
             <button
               key={index}
               onClick={item.action}
               className="w-full bg-white border rounded-xl p-4 hover:border-gray-300 transition-colors text-left flex items-center justify-between"
             >
               <div className="flex items-center">
                 <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                   <item.icon className="h-5 w-5 text-gray-600" />
                 </div>
                 <div className="ml-4">
                   <h3 className="font-medium">{item.title}</h3>
                   <p className="text-sm text-gray-600">{item.description}</p>
                 </div>
               </div>
               {item.toggle ? (
                 <div 
                   className={`w-11 h-6 rounded-full p-1 transition-colors ${
                     item.enabled ? 'bg-blue-600' : 'bg-gray-200'
                   }`}
                 >
                   <div 
                     className={`w-4 h-4 rounded-full bg-white transition-transform ${
                       item.enabled ? 'transform translate-x-5' : ''
                     }`} 
                   />
                 </div>
               ) : (
                 <ChevronRight className="h-5 w-5 text-gray-400" />
               )}
             </button>
           ))}

           {/* Logout Button */}
           <button 
             onClick={handleLogout}
             disabled={isLoggingOut}
             className="w-full bg-white border border-red-200 rounded-xl p-4 hover:border-red-300 transition-colors text-left flex items-center text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <LogOut className="h-5 w-5 mr-3" />
             <span>{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
           </button>
         </div>

         {/* App Version */}
         <div className="mt-8 text-center">
           <p className="text-sm text-gray-500">Version 1.0.0</p>
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
           onClick={() => onNavigate('orders')}
           className="flex flex-col items-center text-gray-400 hover:text-gray-600"
         >
           <Package className="h-5 w-5" />
           <span className="text-xs mt-1">Orders</span>
         </button>
         <button 
           className="flex flex-col items-center text-blue-600"
         >
           <Package className="h-5 w-5" />
           <span className="text-xs mt-1">Settings</span>
         </button>
       </div>
     </div>
   </div>
 );
};