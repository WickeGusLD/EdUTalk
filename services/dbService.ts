import { Post, User, Comment, Category, UserRole, AnalyticsData } from '../types';

// Mock Data Storage (Simulating SQL Tables)
const USERS: User[] = [
  { id: 'u1', name: 'Alice Chen', role: UserRole.STUDENT, avatarUrl: 'https://picsum.photos/seed/u1/40/40' },
  { id: 'u2', name: 'Dr. Robert Smith', role: UserRole.MODERATOR, avatarUrl: 'https://picsum.photos/seed/u2/40/40' },
  { id: 'u3', name: 'James Wilson', role: UserRole.STUDENT, avatarUrl: 'https://picsum.photos/seed/u3/40/40' },
  { id: 'u4', name: 'Sarah Lee', role: UserRole.ADMIN, avatarUrl: 'https://picsum.photos/seed/u4/40/40' },
];

export const CATEGORIES: Category[] = [
  { id: 'c1', name: 'Computer Science', color: '#3b82f6' },
  { id: 'c2', name: 'Mathematics', color: '#ef4444' },
  { id: 'c3', name: 'Campus Life', color: '#10b981' },
  { id: 'c4', name: 'Career Advice', color: '#f59e0b' },
];

let POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u1',
    authorName: 'Alice Chen',
    categoryId: 'c1',
    title: 'Help with SQL Join optimization',
    content: 'I am struggling to optimize a query joining three large tables. Does anyone have resources on indexing strategies?',
    upvotes: 12,
    viewCount: 145,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    commentCount: 3
  },
  {
    id: 'p2',
    userId: 'u3',
    authorName: 'James Wilson',
    categoryId: 'c3',
    title: 'Best coffee spots near the library?',
    content: 'Finals week is coming up and I need a reliable caffeine source open late.',
    upvotes: 45,
    viewCount: 300,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    commentCount: 8
  },
  {
    id: 'p3',
    userId: 'u2',
    authorName: 'Dr. Robert Smith',
    categoryId: 'c1',
    title: 'Announcement: Guest Lecture on AI Ethics',
    content: 'Please join us this Friday in Hall B for a talk by industry leaders on the ethics of generative AI.',
    upvotes: 89,
    viewCount: 500,
    createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    commentCount: 12
  },
  {
    id: 'p4',
    userId: 'u1',
    authorName: 'Alice Chen',
    categoryId: 'c2',
    title: 'Calculus III Study Group',
    content: 'Looking for 2-3 people to study for the upcoming midterm. We meet at the Student Center.',
    upvotes: 5,
    viewCount: 40,
    createdAt: new Date(Date.now() - 10000000).toISOString(),
    commentCount: 1
  }
];

let COMMENTS: Comment[] = [
  { id: 'cm1', postId: 'p1', userId: 'u2', authorName: 'Dr. Robert Smith', content: 'Make sure you are indexing the foreign keys.', createdAt: new Date(Date.now() - 80000000).toISOString() },
  { id: 'cm2', postId: 'p2', userId: 'u1', authorName: 'Alice Chen', content: 'The Bean Hive is great and open until midnight.', createdAt: new Date(Date.now() - 40000000).toISOString() }
];

// Service Methods (Simulating Async SQL Queries)

export const fetchPosts = async (): Promise<Post[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...POSTS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())), 300);
  });
};

export const fetchPostById = async (postId: string): Promise<Post | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(POSTS.find(p => p.id === postId)), 200);
  });
};

export const fetchCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(COMMENTS.filter(c => c.postId === postId)), 200);
  });
};

export const createPost = async (userId: string, categoryId: string, title: string, content: string): Promise<Post> => {
  return new Promise((resolve) => {
    const user = USERS.find(u => u.id === userId);
    const newPost: Post = {
      id: `p${Date.now()}`,
      userId,
      authorName: user?.name || 'Unknown',
      categoryId,
      title,
      content,
      upvotes: 0,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      commentCount: 0
    };
    POSTS = [newPost, ...POSTS];
    resolve(newPost);
  });
};

export const createComment = async (userId: string, postId: string, content: string): Promise<Comment> => {
   return new Promise((resolve) => {
    const user = USERS.find(u => u.id === userId);
    const newComment: Comment = {
      id: `cm${Date.now()}`,
      postId,
      userId,
      authorName: user?.name || 'Unknown',
      content,
      createdAt: new Date().toISOString()
    };
    COMMENTS = [...COMMENTS, newComment];
    
    // Update post comment count
    const postIndex = POSTS.findIndex(p => p.id === postId);
    if(postIndex > -1) {
        POSTS[postIndex] = { ...POSTS[postIndex], commentCount: POSTS[postIndex].commentCount + 1 };
    }
    
    resolve(newComment);
   });
};

export const fetchAnalytics = async (): Promise<AnalyticsData> => {
  return new Promise((resolve) => {
    // 1. Posts by Category
    const postsByCategory = CATEGORIES.map(cat => ({
      name: cat.name,
      value: POSTS.filter(p => p.categoryId === cat.id).length,
      color: cat.color
    }));

    // 2. Daily Activity (Simulated Last 7 Days)
    const dailyActivity = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      
      // Random mock data for visual variation + real data if matches date
      const realPosts = POSTS.filter(p => p.createdAt.startsWith(dateStr)).length;
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        posts: Math.floor(Math.random() * 5) + realPosts,
        comments: Math.floor(Math.random() * 15) + (realPosts * 2)
      };
    });

    // 3. Top Contributors
    const userEngagement: Record<string, number> = {};
    POSTS.forEach(p => {
        userEngagement[p.authorName] = (userEngagement[p.authorName] || 0) + 5; // 5 pts per post
    });
    COMMENTS.forEach(c => {
        userEngagement[c.authorName] = (userEngagement[c.authorName] || 0) + 1; // 1 pt per comment
    });

    const topContributors = Object.entries(userEngagement)
        .map(([name, engagement]) => ({ name, engagement }))
        .sort((a, b) => b.engagement - a.engagement)
        .slice(0, 5);

    resolve({
      postsByCategory,
      dailyActivity,
      topContributors
    });
  });
};

export const getCurrentUser = (): User => USERS[0]; // Simulating logged in user