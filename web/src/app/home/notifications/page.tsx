'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  MessageCircle, 
  Heart, 
  AlertTriangle, 
  Check, 
  X, 
  Users, 
  Clock, 
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
import { NotificationType, NotificationsResponse } from '@/types/post';
import { useRouter } from 'next/navigation';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const scrollPositionRef = useRef<number>(0);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  const fetchNotifications = async (page: number, reset = false) => {
    // Save current scroll position before loading
    if (!reset) {
      scrollPositionRef.current = window.scrollY;
    }
    
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;

      const params = new URLSearchParams({
        page: page.toString(),
      });

      const res = await fetch(`${baseUrl}/notifications/?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data: NotificationsResponse = await res.json();
        if (reset) {
          setNotifications(data.notifications || []);
          // Scroll to top only when resetting (search/filter)
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          // Append new notifications without resetting, ensuring no duplicates
          setNotifications(prev => {
            const existingIds = new Set(prev.map(n => n.id));
            const newNotifications = (data.notifications || []).filter(n => !existingIds.has(n.id));
            return [...prev, ...newNotifications];
          });
          
          // Restore scroll position after loading more notifications
          setTimeout(() => {
            window.scrollTo({ top: scrollPositionRef.current, behavior: 'auto' });
          }, 100);
        }
        setHasNextPage(data.next);
        setTotalUnread(data.unreadCount || 0);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;

      const res = await fetch(`${baseUrl}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId ? { ...n, is_read: true } : n
          )
        );
        setTotalUnread(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case 'reply':
        return <MessageCircle className="w-5 h-5 text-green-600" />;
      case 'like-post':
      case 'like-comment':
      case 'like-job-post':
        return <Heart className="w-5 h-5 text-red-600" />;
      case 'post-blocked':
      case 'job-blocked':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'post-unblocked':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'post-deleted':
      case 'job-deleted':
        return <X className="w-5 h-5 text-red-600" />;
      case 'sent-connection-request':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'connection-accepted':
        return <Check className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationTitle = (type: string) => {
    switch (type) {
      case 'comment':
        return 'New Comment';
      case 'reply':
        return 'New Reply';
      case 'like-post':
        return 'Post Liked';
      case 'like-comment':
        return 'Comment Liked';
      case 'like-job-post':
        return 'Job Post Liked';
      case 'post-blocked':
        return 'Post Blocked';
      case 'job-blocked':
        return 'Job Post Blocked';
      case 'post-unblocked':
        return 'Post Unblocked';
      case 'post-deleted':
        return 'Post Deleted';
      case 'job-deleted':
        return 'Job Post Deleted';
      case 'sent-connection-request':
        return 'Connection Request';
      case 'connection-accepted':
        return 'Connection Accepted';
      default:
        return 'Notification';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(() => {
    return true; // No search or filter applied
  }); 

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        className="relative z-10 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.button
                onClick={() => router.back()}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Notifications
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">
                  View and manage your notifications
                </p>
              </div>
            </div>
            <motion.div
              className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs sm:text-sm font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Bell className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              {totalUnread} Unread
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <motion.div 
              className="flex items-center justify-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                <span className="text-gray-600">Loading notifications...</span>
              </div>
            </motion.div>
          ) : filteredNotifications.length === 0 ? (
            <motion.div 
              className="bg-white rounded-2xl p-12 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-500">Try adjusting your search or filters to see more results.</p>
            </motion.div>
          ) : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={`${notification.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md ${
                  !notification.is_read ? 'ring-2 ring-blue-500/20 bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                      {notification.user.profile_image_url ? (
                        <Image
                          src={notification.user.profile_image_url}
                          alt={notification.user.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                          <span className="text-lg font-semibold text-purple-600">
                            {notification.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {getNotificationIcon(notification.type)}
                      <span className="font-semibold text-gray-900">
                        {getNotificationTitle(notification.type)}
                      </span>
                      {!notification.is_read && (
                        <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          Unread
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {notification.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(notification.created_at)}</span>
                      </div>
                      
                      {!notification.is_read && (
                        <motion.button
                          onClick={() => markAsRead(notification.id)}
                          className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-xl font-medium transition-colors duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Mark as Read
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        {hasNextPage && (
          <motion.div 
            className="flex items-center justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.button
              onClick={() => fetchNotifications(currentPage + 1, false)}
              disabled={!hasNextPage}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Load More Notifications
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage; 