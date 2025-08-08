import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, Sparkles, Send } from 'lucide-react';
import './LoveLetter.css';

const LoveLetter = () => {
  const [currentLetter, setCurrentLetter] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const letters = [
    {
      title: "Thư đầu tiên",
      content: "Minh yêu dấu,\n\nTừ ngày đầu tiên gặp em, trái tim anh đã không còn thuộc về anh nữa. Mỗi ngày trôi qua, tình yêu anh dành cho em lại càng sâu đậm hơn. Em là ánh sáng trong cuộc đời tối tăm của anh, là niềm vui trong những ngày buồn, là động lực để anh cố gắng mỗi ngày.\n\nAnh yêu em, Minh!",
      date: "16/12/2024"
    },
    {
      title: "Những lời yêu thương",
      content: "Em thân yêu,\n\nCó những điều anh muốn nói với em từ rất lâu rồi. Em là người đặc biệt nhất trong cuộc đời anh. Mỗi khi nhìn thấy em cười, cả thế giới của anh như được thắp sáng. Em là người hiểu anh nhất, là người luôn bên cạnh anh trong mọi hoàn cảnh.\n\nCảm ơn em vì đã cho anh cơ hội được yêu em!",
      date: "16/12/2024"
    },
    {
      title: "Lời hứa",
      content: "Minh của anh,\n\nAnh hứa sẽ luôn yêu thương và chăm sóc em. Sẽ là người đàn ông tốt nhất cho em, sẽ bảo vệ em khỏi mọi điều xấu trong cuộc sống. Anh hứa sẽ làm cho em hạnh phúc mỗi ngày, sẽ cùng em xây dựng một tương lai tươi đẹp.\n\nAnh yêu em vô điều kiện!",
      date: "16/12/2024"
    },
    {
      title: "Tương lai của chúng ta",
      content: "Em yêu,\n\nAnh mơ về một tương lai nơi chúng ta cùng nhau. Một ngôi nhà nhỏ, một gia đình hạnh phúc, những đứa con xinh đẹp như em. Anh muốn cùng em đi qua mọi thăng trầm của cuộc sống, chia sẻ mọi niềm vui và nỗi buồn.\n\nEm có muốn cùng anh xây dựng tương lai đó không?",
      date: "16/12/2025"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLetter(prev => (prev + 1) % letters.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [letters.length]);

  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), 3000);
    return () => clearTimeout(timer);
  }, [currentLetter]);

  return (
    <motion.div 
      className="love-letter"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="letter-header">
        <motion.h1 
          className="letter-title"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <MessageSquare className="title-icon" />
          Thư tình của anh
        </motion.h1>
        <motion.p 
          className="letter-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Những lời yêu thương từ trái tim anh dành cho em
        </motion.p>
      </div>

      <div className="letter-container">
        <motion.div 
          className="letter-card"
          key={currentLetter}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <div className="letter-header-info">
            <h2>{letters[currentLetter].title}</h2>
            <span className="letter-date">{letters[currentLetter].date}</span>
          </div>

          <div className="letter-content">
            {letters[currentLetter].content.split('\n').map((line, index) => (
              <motion.p
                key={index}
                className={line.trim() === '' ? 'empty-line' : 'letter-line'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
              >
                {line}
              </motion.p>
            ))}
          </div>

          <div className="letter-signature">
            <Heart className="signature-icon" />
            <span>Với tất cả tình yêu,</span>
            <span className="signature-name">Khánh</span>
          </div>
        </motion.div>
      </div>

      <div className="letter-navigation">
        <div className="nav-dots">
          {letters.map((_, index) => (
            <motion.button
              key={index}
              className={`nav-dot ${currentLetter === index ? 'active' : ''}`}
              onClick={() => setCurrentLetter(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </div>
      </div>

      <div className="letter-actions">
        <motion.button
          className="action-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Send className="action-icon" />
          Gửi thư cho em
        </motion.button>
      </div>

      <div className="love-quote">
        <motion.div 
          className="quote-container"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Sparkles className="quote-icon" />
          <p>
            "Tình yêu không phải là tìm kiếm một người hoàn hảo, 
            mà là học cách nhìn một người không hoàn hảo một cách hoàn hảo."
          </p>
        </motion.div>
      </div>

      <div className="letter-footer">
        <motion.div 
          className="footer-message"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Heart className="footer-icon" />
          <p>
            "Mỗi chữ trong thư này đều chứa đựng tình yêu vô bờ bến của anh dành cho em. 
            Em là người đặc biệt nhất trong cuộc đời anh."
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoveLetter; 