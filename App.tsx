import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Feed } from './components/Feed';
import { PostDetail } from './components/PostDetail';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { CreatePostModal } from './components/CreatePostModal';
import { ViewState, Post } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('FEED');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Routing Logic
  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setCurrentView('POST_DETAIL');
  };

  const handleBackToFeed = () => {
    setSelectedPost(null);
    setCurrentView('FEED');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'FEED':
        return (
          <Feed 
            onPostClick={handlePostClick} 
            onCreatePost={() => setIsCreateModalOpen(true)} 
          />
        );
      case 'POST_DETAIL':
        return selectedPost ? (
          <PostDetail post={selectedPost} onBack={handleBackToFeed} />
        ) : (
          <Feed onPostClick={handlePostClick} onCreatePost={() => setIsCreateModalOpen(true)} />
        );
      case 'ANALYTICS':
        return <AnalyticsDashboard />;
      case 'PROFILE':
        return (
          <div className="flex items-center justify-center h-full text-slate-400">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-600 mb-2">User Profile</h2>
                <p>Profile management coming soon.</p>
            </div>
          </div>
        );
      default:
        return <div>Not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar currentView={currentView === 'POST_DETAIL' ? 'FEED' : currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 ml-64 min-h-screen transition-all duration-300">
        {renderContent()}
      </main>

      {isCreateModalOpen && (
        <CreatePostModal 
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            // If in feed, it might trigger reload if we lifted state up, but for now just close
            // Ideally Feed should auto-refresh or we pass a callback to refresh
            window.location.reload(); // Simple hack to refresh feed for demo
          }}
        />
      )}
    </div>
  );
};

export default App;