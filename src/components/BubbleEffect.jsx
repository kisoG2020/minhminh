import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './BubbleEffect.css';

const BubbleEffect = () => {
  const [bubbles, setBubbles] = useState([]);
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const createBubble = () => {
      const bubble = {
        id: Date.now() + Math.random(),
        x: Math.random() * window.innerWidth,
        size: Math.random() * 40 + 20,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 2,
      };
      return bubble;
    };

    const createHeart = () => {
      const heart = {
        id: Date.now() + Math.random(),
        x: Math.random() * window.innerWidth,
        duration: Math.random() * 6 + 4,
        delay: Math.random() * 3,
      };
      return heart;
    };

    const addBubble = () => {
      setBubbles(prev => [...prev, 
        createBubble(),
        createBubble(),
        createBubble(),
        createBubble()

      ]);
    };

    const addHeart = () => {
      setHearts(prev => [...prev, 
        createHeart(),
        createHeart(),
        createHeart()
      ]);
    };

    // Create bubbles
    const bubbleInterval = setInterval(addBubble, 4000);
    
    // Create hearts
    const heartInterval = setInterval(addHeart, 2000);

    return () => {
      clearInterval(bubbleInterval);
      clearInterval(heartInterval);
    };
  }, []);

  useEffect(() => {
    const cleanup = setInterval(() => {
      setBubbles(prev => prev.filter(bubble => 
        Date.now() - bubble.id < 15000
      ));
      setHearts(prev => prev.filter(heart => 
        Date.now() - heart.id < 12000
      ));
    }, 2000);

    return () => clearInterval(cleanup);
  }, []);

  return (
    <>
      <div className="bubble-container">
        {bubbles.map(bubble => (
          <motion.div
            key={bubble.id}
            className="bubble"
            style={{
              left: bubble.x,
              width: bubble.size,
              height: bubble.size,
            }}
            initial={{ 
              y: window.innerHeight + 50,
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              y: -100,
              opacity: [0, 0.6, 0.4, 0],
              scale: [0, 1, 1.1, 0],
              x: [0, Math.sin(Date.now() * 0.001) * 50]
            }}
            transition={{
              duration: bubble.duration,
              delay: bubble.delay,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Floating Hearts */}
      <div className="floating-hearts">
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            className="floating-heart"
            style={{
              left: heart.x,
            }}
            initial={{ 
              y: window.innerHeight + 20,
              opacity: 0,
              rotate: 0
            }}
            animate={{ 
              y: -50,
              opacity: [0, 1, 1, 0],
              rotate: [0, 180, 360],
              x: [0, Math.sin(Date.now() * 0.002) * 30]
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              ease: "easeOut"
            }}
          >
            💖
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default BubbleEffect;
