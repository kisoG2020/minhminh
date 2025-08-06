import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Trophy, Gamepad2, Sparkles } from 'lucide-react';

const LoveGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setGameOver(false);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsPlaying(false);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const catchHeart = () => {
    if (isPlaying) {
      setScore(prev => prev + 10);
    }
  };

  const getScoreMessage = () => {
    if (score >= 100) return "Tuyệt vời! Em là người yêu hoàn hảo nhất! 💕";
    if (score >= 70) return "Rất tốt! Tình yêu của chúng ta thật đặc biệt! ❤️";
    if (score >= 40) return "Khá tốt! Hãy cố gắng thêm nhé! 💖";
    return "Cố lên! Tình yêu cần sự kiên nhẫn! 💝";
  };

  return (
    <motion.div 
      className="love-game"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="game-header">
        <motion.h1 
          className="game-title"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Gamepad2 className="title-icon" />
          Trò chơi tình yêu
        </motion.h1>
        <motion.p 
          className="game-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Bắt lấy những trái tim để thể hiện tình yêu của em!
        </motion.p>
      </div>

      <div className="game-stats">
        <motion.div 
          className="stat"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Trophy className="stat-icon" />
          <span>Điểm: {score}</span>
        </motion.div>
        <motion.div 
          className="stat"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Star className="stat-icon" />
          <span>Thời gian: {timeLeft}s</span>
        </motion.div>
      </div>

      <div className="game-area">
        {!isPlaying && !gameOver && (
          <motion.div 
            className="game-start"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Heart className="start-icon" />
            <h2>Bắt đầu trò chơi</h2>
            <p>Click vào trái tim để ghi điểm!</p>
            <motion.button
              className="start-button"
              onClick={startGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Bắt đầu
            </motion.button>
          </motion.div>
        )}

        {gameOver && (
          <motion.div 
            className="game-over"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Trophy className="game-over-icon" />
            <h2>Kết thúc trò chơi!</h2>
            <p className="final-score">Điểm cuối: {score}</p>
            <p className="score-message">{getScoreMessage()}</p>
            <motion.button
              className="restart-button"
              onClick={startGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Chơi lại
            </motion.button>
          </motion.div>
        )}

        {isPlaying && (
          <motion.div 
            className="game-heart"
            onClick={catchHeart}
            whileHover={{ scale: 1.2 }}
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
            <Heart className="heart-icon" />
          </motion.div>
        )}
      </div>

      <div className="game-instructions">
        <motion.div 
          className="instructions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          <Sparkles className="instructions-icon" />
          <div>
            <h3>Hướng dẫn chơi:</h3>
            <ul>
              <li>Click vào trái tim để ghi điểm</li>
              <li>Mỗi click = 10 điểm</li>
              <li>Thời gian: 30 giây</li>
              <li>Cố gắng bắt được nhiều trái tim nhất!</li>
            </ul>
          </div>
        </motion.div>
      </div>

      <div className="love-message">
        <motion.div 
          className="message-container"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Heart className="message-icon" />
          <p>
            "Trong trò chơi tình yêu này, em luôn là người chiến thắng trong trái tim anh. 
            Mỗi click của em là một nhịp đập yêu thương."
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoveGame; 