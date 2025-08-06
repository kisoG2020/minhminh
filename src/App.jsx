import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Calendar, 
  Image, 
  Gamepad2, 
  MessageSquare, 
  Music,
  Home,
  Sparkles
} from 'lucide-react';
import './App.css';

// Components
import Dashboard from './components/Dashboard';
import LoveCounter from './components/LoveCounter';
import PhotoAlbum from './components/PhotoAlbum';
import LoveGame from './components/LoveGame';
import LoveLetter from './components/LoveLetter';
import MusicPlayer from './components/MusicPlayer';
import BubbleEffect from './components/BubbleEffect';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'counter', icon: Calendar, label: 'Đếm ngày yêu' },
    // { id: 'album', icon: Image, label: 'Album ảnh' },
    { id: 'game', icon: Gamepad2, label: 'Trò chơi' },
    { id: 'letter', icon: MessageSquare, label: 'Thư tình' },
    { id: 'music', icon: Music, label: 'Âm nhạc' }
  ];

  const handleNavigate = (page) => {
    // Map page names to tab IDs
    const pageToTabMap = {
      'love-counter': 'counter',
      'photo-album': 'album',
      'love-letter': 'letter',
      'music-player': 'music'
    };
    
    const targetTab = pageToTabMap[page];
    if (targetTab) {
      setActiveTab(targetTab);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'counter':
        return <LoveCounter />;
      // case 'album':
      //   return <PhotoAlbum />;
      case 'game':
        return <LoveGame />;
      case 'letter':
        return <LoveLetter />;
      case 'music':
        return <MusicPlayer />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app">
      {/* Hiệu ứng bong bóng */}
      <BubbleEffect />
      
      {/* Sidebar Navigation */}
      <motion.div 
        className="sidebar"
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="sidebar-header">
          <div className="logo">
            <Heart className="heart-icon" />
            <span>Khánh & Minh</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <motion.button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconComponent className="nav-icon" />
                <span>{item.label}</span>
                {activeTab === item.id && (
                  <motion.div
                    className="active-indicator"
                    layoutId="activeIndicator"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="love-status">
            <Sparkles className="sparkle-icon" />
            <span>Forever Love</span>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.main 
        className="main-content"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {renderContent()}
      </motion.main>
    </div>
  );
}

export default App;
