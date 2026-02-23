import React, { useEffect, useState } from 'react';
import { Post, Category } from '../types';
import { CATEGORIES, fetchPosts } from '../services/dbService';
import { MessageCircle, ThumbsUp, Eye, Plus, Search } from 'lucide-react';

interface FeedProps {
  onPostClick: (post: Post) => void;
  onCreatePost: () => void;
}

export const Feed: React.FC<FeedProps> = ({ onPostClick, onCreatePost }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const data = await fetchPosts();
    setPosts(data);
    setLoading(false);
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'ALL' || post.categoryId === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (catId: string) => {
    const cat = CATEGORIES.find(c => c.id === catId);
    return cat ? cat.color : '#94a3b8';
  };

  const getCategoryName = (catId: string) => {
    return CATEGORIES.find(c => c.id === catId)?.name || 'General';
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header & Controls */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Discussion Forum</h2>
            <p className="text-slate-500 mt-1">Join the conversation with your peers</p>
          </div>
          <button 
            onClick={onCreatePost}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            New Post
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'ALL' 
                  ? 'bg-slate-800 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Topics
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id 
                    ? 'text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                style={{ backgroundColor: selectedCategory === cat.id ? cat.color : undefined }}
              >
                {cat.name}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search discussions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Post List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading discussions...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">No discussions found matching your criteria.</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div 
              key={post.id}
              onClick={() => onPostClick(post)}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="px-2.5 py-0.5 rounded text-xs font-semibold text-white"
                      style={{ backgroundColor: getCategoryColor(post.categoryId) }}
                    >
                      {getCategoryName(post.categoryId)}
                    </span>
                    <span className="text-slate-400 text-xs">Posted by {post.authorName} • {new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                    {post.content}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-slate-400 text-sm border-t border-slate-100 pt-3 mt-1">
                <div className="flex items-center gap-1.5">
                  <ThumbsUp size={16} />
                  <span>{post.upvotes}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle size={16} />
                  <span>{post.commentCount} Comments</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye size={16} />
                  <span>{post.viewCount} Views</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};