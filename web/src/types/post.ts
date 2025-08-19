export interface User {
  id: string;
  name: string;
  email: string;
  google_id: string;
  school?: string;
  school_id?: string;
  university_id?: string;
  department?: string;
  department_id?: string;
  follow_count: number;
  acedemic_year: number;
  profile_image_url?: string;
  is_teacher: boolean;
  blue_badge: boolean;
  is_complete?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  post_attachments: string[];
  is_announcement: boolean;
  is_validated: boolean;
  is_flagged: boolean;
  likes: number;
  comments: number;
  created_at: string;
  liked?: boolean; // Whether the current user liked this post
}

export interface NotificationType {
  id: string;
  user: User;
  to: User;
  type: string;
  content: string;
  is_read: boolean;
  created_at: string;
  content_id?: string;
}

export interface NotificationsResponse {
  next: boolean;
  notifications: NotificationType[];
  page: number;
  unreadCount: number;
}