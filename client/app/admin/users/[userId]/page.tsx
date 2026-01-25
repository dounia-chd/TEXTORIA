'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Crown,
  FileText,
  Image,
  Star,
  Edit,
  Trash2,
  Activity,
  Shield,
  Clock,
  TrendingUp
} from 'lucide-react';

interface UserDetail {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  subscription?: {
    plan: string;
    status: string;
    currentUsage: number;
    monthlyLimit: number;
    startDate: string;
  };
  generations: Array<{
    id: string;
    type: string;
    category: string;
    prompt: string;
    content: string;
    createdAt: string;
  }>;
  _count: {
    generations: number;
    favorites: number;
  };
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(response.data);
    } catch (error) {
      console.error('Failed to load user data:', error);
      toast.error('Failed to load user data');
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (action: string) => {
    try {
      const token = localStorage.getItem('token');
      
      if (action === 'toggle-status') {
        await axios.patch(`http://localhost:5000/api/admin/users/${userId}/toggle-status`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('User status updated');
        loadUserData();
      } else if (action === 'delete') {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
          await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          toast.success('User deleted successfully');
          router.push('/admin');
        }
      }
    } catch (error) {
      console.error('User action failed:', error);
      toast.error('Action failed');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'MODERATOR': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'ENTERPRISE': return 'bg-purple-100 text-purple-800';
      case 'PREMIUM': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
          <p className="text-gray-600">The user you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/admin')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Admin</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">User Details</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleUserAction('toggle-status')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  user.isActive 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {user.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => handleUserAction('delete')}
                className="px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Member since</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: Activity },
              { id: 'generations', name: 'Generations', icon: FileText },
              { id: 'subscription', name: 'Subscription', icon: Crown }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Generations</p>
                  <p className="text-2xl font-bold text-gray-900">{user._count.generations}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Favorites</p>
                  <p className="text-2xl font-bold text-gray-900">{user._count.favorites}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Account Status</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="md:col-span-3 bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                {user.generations.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No recent activity</p>
                ) : (
                  <div className="space-y-4">
                    {user.generations.slice(0, 5).map((generation) => (
                      <div key={generation.id} className="flex items-center space-x-3">
                        {generation.type === 'TEXT' ? (
                          <FileText className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Image className="h-5 w-5 text-green-500" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{generation.category}</p>
                          <p className="text-sm text-gray-500">{generation.prompt}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-900">{generation.type}</p>
                          <p className="text-sm text-gray-500">{formatDate(generation.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'generations' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">All Generations</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {user.generations.length === 0 ? (
                <div className="p-6 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No generations found</p>
                </div>
              ) : (
                user.generations.map((generation) => (
                  <div key={generation.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {generation.type === 'TEXT' ? (
                          <FileText className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Image className="h-5 w-5 text-green-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{generation.category}</p>
                          <p className="text-sm text-gray-500">{generation.prompt}</p>
                          <p className="text-xs text-gray-400">{formatDate(generation.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">{generation.type}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            {user.subscription ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Subscription Details</h3>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPlanColor(user.subscription.plan)}`}>
                    {user.subscription.plan}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Plan</p>
                    <p className="text-lg font-semibold text-gray-900">{user.subscription.plan}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <p className="text-lg font-semibold text-gray-900">{user.subscription.status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Usage</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {user.subscription.currentUsage} / {user.subscription.monthlyLimit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Start Date</p>
                    <p className="text-lg font-semibold text-gray-900">{formatDate(user.subscription.startDate)}</p>
                  </div>
                </div>

                {/* Usage Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Monthly Usage</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {Math.round((user.subscription.currentUsage / user.subscription.monthlyLimit) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((user.subscription.currentUsage / user.subscription.monthlyLimit) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No subscription found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



