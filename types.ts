export enum UserRole {
  STUDENT = 'Student',
  MODERATOR = 'Moderator',
  ADMIN = 'Admin'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  authorName: string;
  categoryId: string;
  title: string;
  content: string;
  upvotes: number;
  viewCount: number;
  createdAt: string;
  commentCount: number;
}

export type ViewState = 'FEED' | 'ANALYTICS' | 'POST_DETAIL' | 'PROFILE';

export interface AnalyticsData {
  postsByCategory: { name: string; value: number; color: string }[];
  dailyActivity: { date: string; posts: number; comments: number }[];
  topContributors: { name: string; engagement: number }[];
}