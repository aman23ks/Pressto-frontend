'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Send, Mail, Bug, HelpCircle, History,
  Clock, CheckCircle, AlertCircle, XCircle, ChevronDown 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiService } from '@/app/services/api';

interface HelpSupportProps {
  onBack: () => void;
  userDetails?: {
    name: string;
    email: string;
    phone?: string;
  };
}

type QueryType = 'bug' | 'feature' | 'general' | 'account';
type StatusType = 'open' | 'in_progress' | 'resolved' | 'closed';
type FilterType = 'all' | StatusType;

interface FormData {
  type: QueryType;
  subject: string;
  message: string;
  name: string;
  email: string;
  phone: string;
}

interface Ticket {
  _id: string;
  type: QueryType;
  subject: string;
  message: string;
  status: StatusType;
  created_at: string;
}

const TicketHistory: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await apiService.get('/support/tickets');
      setTickets(response.data);
    } catch (error) {
      toast.error('Failed to fetch support tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <AlertCircle className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'closed':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'bug':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'feature':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'account':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'resolved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'closed':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Filter Bar */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Support Tickets</h2>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Tickets</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <button
              onClick={fetchTickets}
              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <History className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="divide-y">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <div key={ticket._id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getTypeStyles(ticket.type)} border`}>
                      {ticket.type}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles(ticket.status)} border`}>
                      {getStatusIcon(ticket.status)}
                      {ticket.status}
                    </span>
                  </div>
                  <div 
                    className="cursor-pointer"
                    onClick={() => setSelectedTicket(selectedTicket === ticket._id ? null : ticket._id)}
                  >
                    <h3 className="text-base font-medium text-gray-900 truncate pr-4">
                      {ticket.subject}
                    </h3>
                    <div className="mt-1 text-sm text-gray-500">
                      {new Date(ticket.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className={`mt-2 text-sm text-gray-600 ${selectedTicket === ticket._id ? '' : 'line-clamp-2'}`}>
                      {ticket.message}
                    </div>
                    {ticket.message.length > 150 && (
                      <button
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicket(selectedTicket === ticket._id ? null : ticket._id);
                        }}
                      >
                        {selectedTicket === ticket._id ? 'Show less' : 'Show more'}
                        <ChevronDown 
                          className={`h-4 w-4 transform transition-transform ${
                            selectedTicket === ticket._id ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Mail className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">No tickets found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? "You haven't created any support tickets yet."
                : `No ${filter} tickets found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const HelpSupport: React.FC<HelpSupportProps> = ({ onBack, userDetails }) => {
  const [formData, setFormData] = useState<FormData>({
    type: 'general',
    subject: '',
    message: '',
    name: userDetails?.name || '',
    email: userDetails?.email || '',
    phone: userDetails?.phone || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const queryTypes = [
    { id: 'bug', label: 'Report a Bug', icon: Bug, color: 'text-red-500' },
    { id: 'feature', label: 'Feature Request', icon: HelpCircle, color: 'text-blue-500' },
    { id: 'general', label: 'General Query', icon: Mail, color: 'text-green-500' },
    { id: 'account', label: 'Account Related', icon: HelpCircle, color: 'text-purple-500' }
  ];

  const validateForm = (): boolean => {
    if (!formData.subject.trim()) {
      toast.error('Please enter a subject');
      return false;
    }
    if (!formData.message.trim()) {
      toast.error('Please enter your message');
      return false;
    }
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email are required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await apiService.post('/support/tickets', formData);
      
      setFormData({
        type: 'general',
        subject: '',
        message: '',
        name: userDetails?.name || '',
        email: userDetails?.email || '',
        phone: userDetails?.phone || ''
      });

      toast.success('Your message has been sent successfully');
      setShowHistory(true);

    } catch (error: any) {
      console.error('Support ticket error:', error);
      toast.error(error.response?.data?.error || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <h1 className="text-xl font-semibold">Help & Support</h1>
            </div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <History className="h-4 w-4" />
              {showHistory ? 'New Ticket' : 'View History'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 pt-20 pb-12">
        {!showHistory ? (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">How can we help you?</h2>

            {/* Query Type Selection */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {queryTypes.map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: id as QueryType })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.type === id 
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`h-6 w-6 ${color} mb-2`} />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>

            {/* Support Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={5}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>

            {/* Contact Information */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Other ways to reach us</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <span>resolvemyqueries@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <TicketHistory />
        )}
      </div>
    </div>
  );
};

export default HelpSupport;