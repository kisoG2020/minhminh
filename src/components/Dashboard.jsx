import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Calendar, Image, MessageSquare, Music, Star, Sparkles, Clock, Gift, Coffee, Moon, Sun, MapPin } from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ onNavigate }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentQuote, setCurrentQuote] = useState(0);
  const [lovePercentage, setLovePercentage] = useState(0);

  const loveDate = new Date('2024-12-16');
  const today = new Date();
  const daysInLove = Math.floor((today - loveDate) / (1000 * 60 * 60 * 24));
  const hoursInLove = Math.floor((today - loveDate) / (1000 * 60 * 60));
  const minutesInLove = Math.floor((today - loveDate) / (1000 * 60));

  // Love quotes rotation
  const loveQuotes = [
    {
      text: "Tình yêu không phải là tìm kiếm một người hoàn hảo, mà là học cách nhìn một người không hoàn hảo một cách hoàn hảo. Em chính là sự hoàn hảo trong mắt anh!",
      author: "Khánh ❤️ Minh"
    },
    {
      text: "Trong vô vàn những ngôi sao trên bầu trời, anh chỉ cần một ngôi sao duy nhất - đó chính là em, người thắp sáng cả thế giới của anh.",
      author: "Tình yêu vĩnh cửu"
    },
    {
      text: "Mỗi ngày bên em là một món quà, mỗi giây phút với em là một phép màu. Anh yêu em không chỉ vì em là ai, mà vì anh trở thành ai khi ở bên em.",
      author: "Từ trái tim anh"
    },
    {
      text: "Nếu tình yêu là một bài hát, thì em chính là giai điệu đẹp nhất. Nếu tình yêu là một câu chuyện, thì em là happy ending mà anh luôn mong đợi.",
      author: "Lời yêu thương"
    }
  ];

  const stats = [
    { 
      icon: Calendar, 
      label: 'Ngày yêu nhau', 
      value: `${daysInLove}`, 
      unit: 'ngày',
      color: '#ec4899',
      description: 'Kể từ ngày đầu tiên'
    },
    { 
      icon: Clock, 
      label: 'Giờ bên nhau', 
      value: `${hoursInLove.toLocaleString()}`, 
      unit: 'giờ',
      color: '#f472b6',
      description: 'Thời gian quý báu'
    },
    { 
      icon: Heart, 
      label: 'Tình yêu', 
      value: `${lovePercentage}`, 
      unit: '%',
      color: '#be185d',
      description: 'Và vẫn đang tăng'
    },
    { 
      icon: Star, 
      label: 'Kỷ niệm đẹp', 
      value: '∞', 
      unit: 'memories',
      color: '#db2777',
      description: 'Không thể đếm được'
    }
  ];

  const quickActions = [
    {
      icon: Calendar,
      title: 'Đếm ngày yêu',
      description: 'Xem chúng ta đã yêu nhau bao lâu rồi',
      gradient: 'from-pink-400 to-rose-400',
      emoji: '📅',
      page: 'love-counter'
    },
    {
      icon: Image,
      title: 'Album ảnh',
      description: 'Những khoảnh khắc đẹp nhất của chúng ta',
      gradient: 'from-purple-400 to-pink-400',
      emoji: '📸',
      page: 'photo-album'
    },
    {
      icon: MessageSquare,
      title: 'Thư tình',
      description: 'Những lời yêu thương từ trái tim anh',
      gradient: 'from-rose-400 to-pink-400',
      emoji: '💌',
      page: 'love-letter'
    },
    {
      icon: Music,
      title: 'Âm nhạc',
      description: 'Playlist tình yêu dành riêng cho em',
      gradient: 'from-pink-400 to-purple-400',
      emoji: '🎵',
      page: 'music-player'
    }
  ];

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Rotate quotes every 8 seconds
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % loveQuotes.length);
    }, 8000);

    return () => clearInterval(quoteTimer);
  }, []);

  // Animate love percentage
  useEffect(() => {
    const timer = setInterval(() => {
      setLovePercentage(prev => {
        if (prev < 100) return prev + 1;
        return 100;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: 'Chào buổi sáng', icon: Sun, emoji: '🌅' };
    if (hour < 18) return { text: 'Chào buổi chiều', icon: Sun, emoji: '☀️' };
    return { text: 'Chào buổi tối', icon: Moon, emoji: '🌙' };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  const handleActionClick = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <motion.div 
      className="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header với greeting động */}
      <div className="dashboard-header">
        <motion.div
          className="greeting-container"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="greeting-time">
            <GreetingIcon className="greeting-icon" />
            <span>{greeting.text} {greeting.emoji}</span>
            <span className="current-time">
              {currentTime.toLocaleTimeString('vi-VN', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>
        </motion.div>

        <motion.h1 
          className="dashboard-title"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Chào mừng về nhà, Minh yêu! 💕
        </motion.h1>
        
        <motion.p 
          className="dashboard-subtitle"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Nơi lưu giữ những kỷ niệm đẹp nhất của chúng ta ✨
        </motion.p>
      </div>

      {/* Love Quote với animation */}
      <div className="love-quote">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQuote}
            className="quote-container"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="quote-header">
              <Heart className="quote-icon" />
              <div className="quote-indicators">
                {loveQuotes.map((_, index) => (
                  <div 
                    key={index}
                    className={`quote-dot ${index === currentQuote ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>
            <p className="quote-text">{loveQuotes[currentQuote].text}</p>
            <span className="quote-author">— {loveQuotes[currentQuote].author}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Stats Grid với animations đẹp */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div 
              key={index}
              className="stat-card"
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1 + 0.6,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <div className="stat-icon-container">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                >
                  <IconComponent 
                    className="stat-icon" 
                    style={{ color: stat.color }}
                  />
                </motion.div>
                <div className="stat-glow" style={{ backgroundColor: stat.color + '20' }} />
              </div>
              
              <div className="stat-content">
                <div className="stat-value-container">
                  <motion.h3 
                    className="stat-value"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1 + 1,
                      type: "spring"
                    }}
                  >
                    {stat.value}
                  </motion.h3>
                  <span className="stat-unit">{stat.unit}</span>
                </div>
                <p className="stat-label">{stat.label}</p>
                <span className="stat-description">{stat.description}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <Sparkles className="section-icon" />
          Khám phá thế giới tình yêu của chúng ta 💖
        </motion.h2>
        
        <div className="actions-grid">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <motion.div 
                key={index}
                className="action-card"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 1.4 + index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleActionClick(action.page)}
                style={{ cursor: 'pointer' }}
              >
                <div className="action-header">
                  <div className="action-emoji">{action.emoji}</div>
                  <motion.div
                    className="action-icon-container"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      delay: index * 0.5
                    }}
                  >
                    <IconComponent className="action-icon" />
                  </motion.div>
                </div>
                
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
                
                <div className="action-hover-effect">
                  <span>Khám phá ngay →</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Love Counter Live */}
      <motion.div 
        className="live-counter"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2.0 }}
      >
        <div className="counter-header">
          <Heart className="counter-icon" />
          <h3>Tình yêu đang đếm từng giây...</h3>
        </div>
        <div className="counter-display">
          <div className="counter-item">
            <span className="counter-value">{minutesInLove.toLocaleString()}</span>
            <span className="counter-label">phút</span>
          </div>
          <div className="counter-separator">💕</div>
          <div className="counter-item">
            <span className="counter-value">{Math.floor(minutesInLove * 60).toLocaleString()}</span>
            <span className="counter-label">giây</span>
          </div>
        </div>
        <p className="counter-message">
          Mỗi giây trôi qua là một giây anh yêu em nhiều hơn! 💖
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;