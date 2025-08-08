import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Calendar, Clock, Sparkles, Star, Gift, Coffee } from 'lucide-react';
import './LoveCounter.css';

const LoveCounter = () => {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Ngày bắt đầu yêu (có thể thay đổi)
  const loveStartDate = new Date('2024-12-16T00:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = now - loveStartDate;

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTime({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: 'Ngày', value: time.days, icon: Calendar },
    { label: 'Giờ', value: time.hours, icon: Clock },
    { label: 'Phút', value: time.minutes, icon: Clock },
    { label: 'Giây', value: time.seconds, icon: Clock }
  ];

  const memorableMoments = [
    {
      icon: Star,
      title: 'Lần đầu gặp nhau',
      description: 'Khoảnh khắc định mệnh khi ánh mắt chúng ta gặp nhau',
      date: '16/12/2024'
    },
    {
      icon: Coffee,
      title: 'Buổi hẹn đầu tiên',
      description: 'Những câu chuyện và tiếng cười đầu tiên',
      date: '20/12/2024'
    },
    {
      icon: Gift,
      title: 'Món quà đầu tiên',
      description: 'Những món quà nhỏ nhưng chứa đựng tình yêu lớn',
      date: '25/12/2024'
    }
  ];

  return (
    <motion.div 
      className="love-counter"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="counter-header">
        <motion.div 
          className="heart-container"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Heart className="big-heart" />
        </motion.div>
        
        <motion.h1 
          className="counter-title"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          Chúng ta đã yêu nhau
        </motion.h1>
        <motion.p 
          className="counter-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Từ ngày {loveStartDate.toLocaleDateString('vi-VN')}
        </motion.p>
      </div>

      <div className="counter-grid">
        {timeUnits.map((unit, index) => {
          const IconComponent = unit.icon;
          return (
            <motion.div 
              key={index}
              className="time-unit"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="time-value">
                <motion.span
                  key={unit.value}
                  initial={{ scale: 1.2, color: "#ec4899" }}
                  animate={{ scale: 1, color: "#be185d" }}
                  transition={{ duration: 0.3 }}
                >
                  {unit.value.toString().padStart(2, '0')}
                </motion.span>
              </div>
              <div className="time-label">
                <IconComponent className="time-icon" />
                <span>{unit.label}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="love-message">
        <motion.div 
          className="message-container"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Sparkles className="message-icon" />
          <p>
            "Mỗi giây phút bên em là một món quà quý giá nhất mà anh có được. 
            Thời gian trôi qua nhưng tình yêu của anh dành cho em sẽ mãi mãi không đổi thay."
          </p>
        </motion.div>
      </div>

      <div className="memorable-moments-section">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Những khoảnh khắc đáng nhớ 💫
        </motion.h2>
        <div className="memorable-moments">
          {memorableMoments.map((moment, index) => {
            const IconComponent = moment.icon;
            return (
              <motion.div 
                key={index}
                className="memorable-moment"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <div className="moment-icon">
                  <IconComponent className="moment-icon-svg" />
                </div>
                <div className="moment-content">
                  <h3 className="moment-title">{moment.title}</h3>
                  <p className="moment-description">{moment.description}</p>
                  <span className="moment-date">{moment.date}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default LoveCounter;