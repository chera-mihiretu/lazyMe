import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Clock, MessageCircle, Heart, AlertTriangle, Users, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { NotificationType, NotificationsResponse } from '@/types/post';
import { useRouter } from 'next/navigation';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;

      const res = await fetch(`${baseUrl}/notifications/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data: NotificationsResponse = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
        setHasNextPage(data.next);
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
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-600" />;
      case 'reply':
        return <MessageCircle className="w-4 h-4 text-green-600" />;
      case 'like-post':
      case 'like-comment':
      case 'like-job-post':
        return <Heart className="w-4 h-4 text-red-600" />;
      case 'post-blocked':
      case 'job-blocked':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'post-unblocked':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'post-deleted':
      case 'job-deleted':
        return <X className="w-4 h-4 text-red-600" />;
      case 'sent-connection-request':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'connection-accepted':
        return <Check className="w-4 h-4 text-green-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
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

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <motion.button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="w-5 h-5" />
        
        {/* Red Dot for Unread Notifications */}
        {unreadCount > 0 && (
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <span className="text-white text-xs font-bold">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </motion.div>
        )}
      </motion.button>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <>
            <motion.div
              className="absolute right-0 top-full mt-2 w-96 max-h-96 bg-white rounded-2xl border border-gray-200 shadow-2xl z-50 overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <motion.button
                  onClick={() => setShowDropdown(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-gray-500" />
                </motion.button>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <Bell className="w-12 h-12 mb-2 text-gray-300" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                          !notification.is_read ? 'bg-blue-50/50' : ''
                        }`}
                        onClick={() => {}}
                      >
                        <div className="flex items-start gap-3">
                          {/* User Avatar */}
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                              {notification.user.profile_image_url ? (
                                <Image
                                  src={notification.user.profile_image_url}
                                  alt={notification.user.name}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                                  <span className="text-sm font-semibold text-purple-600">
                                    {notification.user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Notification Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {getNotificationIcon(notification.type)}
                              <span className="font-semibold text-sm text-gray-900">
                                {getNotificationTitle(notification.type)}
                              </span>
                              {!notification.is_read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                              {notification.content}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{formatDate(notification.created_at)}</span>
                              </div>
                              
                              {!notification.is_read && (
                                <motion.button
                                  className="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-xs font-medium transition-colors duration-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Mark as read
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* View More Button */}
                {hasNextPage && (
                  <motion.div
                    className="p-3 border-t border-gray-100"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <motion.button
                      onClick={() => {
                        setShowDropdown(false);
                        router.push('/home/notifications');
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>View More Notifications</span>
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-100 bg-gray-50">
                  <div className="text-center">
                    <span className="text-xs text-gray-500">
                      {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowDropdown(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
