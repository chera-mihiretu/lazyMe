export interface User {
  id: string;
  name: string;
  email: string;
  google_id: string;
  school: string;
  follow_count: number;
  department: string;
  acedemic_year: number;
  profile_image_url: string;
  is_teacher: boolean;
  blue_badge: boolean;
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