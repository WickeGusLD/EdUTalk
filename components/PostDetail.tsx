import React, { useEffect, useState } from 'react';
import { Post, Comment } from '../types';
import { CATEGORIES, createComment, fetchCommentsByPostId, getCurrentUser } from '../services/dbService';
import { ArrowLeft, MessageSquare, Send, ThumbsUp, User as UserIcon } from 'lucide-react';

interface PostDetailProps {
  post: Post;
  onBack: () => void;
}

export const PostDetail: React.FC<PostDetailProps> = ({ post, onBack }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadComments = async () => {
      const data = await fetchCommentsByPostId(post.id);
      setComments(data);
    };
    loadComments();
  }, [post.id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    const user = getCurrentUser();
    const comment = await createComment(user.id, post.id, newComment);
    setComments([...comments, comment]);
    setNewComment('');
    setIsSubmitting(false);
  };

  const getCategoryName = (catId: string) => CATEGORIES.find(c => c.id === catId)?.name;
  const getCategoryColor = (catId: string) => CATEGORIES.find(c => c.id === catId)?.color;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Feed
      </button>

      {/* Main Post */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-4">
             <span 
                className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: getCategoryColor(post.categoryId) }}
              >
                {getCategoryName(post.categoryId)}
              </span>
              <span className="text-slate-400 text-sm">• {new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">{post.title}</h1>
          
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                <UserIcon size={20}/>
            </div>
            <div>
                <div className="font-semibold text-slate-800">{post.authorName}</div>
                <div className="text-xs text-slate-500">Original Poster</div>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed mb-8">
            {post.content}
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-lg border border-slate-200 transition-colors">
                <ThumbsUp size={18} />
                <span className="font-medium">{post.upvotes} Upvotes</span>
            </button>
             <div className="flex items-center gap-2 text-slate-500 px-4 py-2">
                <MessageSquare size={18} />
                <span>{comments.length} Comments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Discussion</h3>
        
        {/* Comment Input */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
            <form onSubmit={handleSubmitComment}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Add to the discussion</label>
                    <textarea 
                        className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                        rows={3}
                        placeholder="Share your thoughts..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                </div>
                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isSubmitting || !newComment.trim()}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                        <Send size={16} />
                    </button>
                </div>
            </form>
        </div>

        {/* Comment List */}
        <div className="space-y-4">
            {comments.map(comment => (
                <div key={comment.id} className="bg-white p-6 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="font-semibold text-slate-800">{comment.authorName}</div>
                            <span className="text-slate-400 text-xs">• {new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <p className="text-slate-600">{comment.content}</p>
                </div>
            ))}
            
            {comments.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                    No comments yet. Be the first to share your thoughts!
                </div>
            )}
        </div>
      </div>
    </div>
  );
};