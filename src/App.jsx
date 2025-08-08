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
  Sparkles,
  Menu,
  X,
  Clock,
  HeartPulse,
  Camera,
  Gamepad,
  Mail,
  Headphones,
  AlignJustify
} from 'lucide-react';
import './App.css';

// Components
import Dashboard from './components/Dashboard';
import LoveCounter from './components/LoveCounter';
import PhotoAlbum from './components/PhotoAlbum';
import BlockudokuGame from './components/BlockudokuGame';
import LoveLetter from './components/LoveLetter';
import MusicPlayer from './components/MusicPlayer';
import BubbleEffect from './components/BubbleEffect';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Trang chủ', emoji: '🏠' },
    { id: 'counter', icon: Clock, label: 'Đếm ngày yêu', emoji: '💕' },
    // { id: 'album', icon: Camera, label: 'Album ảnh', emoji: '📸' },
    { id: 'game', icon: Gamepad, label: 'Trò chơi', emoji: '🎮' },
    { id: 'letter', icon: Mail, label: 'Thư tình', emoji: '💌' },
    { id: 'music', icon: Headphones, label: 'Âm nhạc', emoji: '🎵' }
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
        return <BlockudokuGame />;
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
      
      {/* Header - Luôn hiển thị */}
      <motion.div 
        className="app-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <div className="logo">
            <HeartPulse className="heart-icon" />
            <span>Khánh & Minh</span>
          </div>
          
          {/* Toggle Button */}
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarVisible(!sidebarVisible)}
          >
            {sidebarVisible ? <X size={24} /> : <AlignJustify size={24} />}
          </button>
        </div>
      </motion.div>
      
      {/* Sidebar Navigation */}
      <div className={`sidebar ${sidebarVisible ? 'visible' : 'hidden'}`}>
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <motion.button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <div className="nav-item-content">
                  <div className="nav-icon-container">
                    <IconComponent className="nav-icon" />
                    <span className="nav-emoji">{item.emoji}</span>
                  </div>
                  <span className="nav-label">{item.label}</span>
                </div>
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
      </div>

      {/* Main Content */}
      <motion.main 
        className={`main-content ${sidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {renderContent()}
      </motion.main>
    </div>
  );
}

export default App;
