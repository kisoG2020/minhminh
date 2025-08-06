import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Pause, SkipBack, SkipForward, Heart, Volume2 } from 'lucide-react';

const MusicPlayer = () => {
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio());

  const songs = [
    {
      id: 1,
      title: "Bầu trời mới",
      artist: " Da LAB, Minh Tốc & Lam",
      duration: "4:22",
      cover: "/bautroimoi.jpg",
      description: "Bài hát về tình yêu hoàn hảo của chúng ta",
      url: "/bautroimoi.mp3" // Thêm đường dẫn mp3 tại đây
    },
    {
      id: 2,
      title: "Lễ Đường",
      artist: "Kai Đinh",
      duration: "4:09",
      cover: "/leduong.jpg",
      description: "Tình yêu vô điều kiện dành cho em",
      url: "/leduong.mp3"
    }
  ];

  useEffect(() => {
    const audio = audioRef.current;
    
    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.volume = volume / 100;

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [currentSong, volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.src = songs[currentSong].url;
      audio.volume = volume / 100;
      audio.play();
      setIsPlaying(true);
    }
  };

  const nextSong = () => {
    const nextIndex = (currentSong + 1) % songs.length;
    setCurrentSong(nextIndex);
    if (isPlaying) {
      audioRef.current.src = songs[nextIndex].url;
      audioRef.current.play();
    }
  };

  const prevSong = () => {
    const prevIndex = (currentSong - 1 + songs.length) % songs.length;
    setCurrentSong(prevIndex);
    if (isPlaying) {
      audioRef.current.src = songs[prevIndex].url;
      audioRef.current.play();
    }
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      className="music-player"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="music-header">
        <motion.h1 
          className="music-title"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Music className="title-icon" />
          Âm nhạc tình yêu
        </motion.h1>
        <p className="music-subtitle">
          Những bài hát đặc biệt dành riêng cho em ❤️
        </p>
      </div>

      <motion.div 
        className="player-container"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="now-playing">
          <motion.div 
            className="album-cover"
            animate={{ 
              rotate: isPlaying ? 360 : 0,
            }}
            transition={{ 
              duration: 20,
              repeat: isPlaying ? Infinity : 0,
              ease: "linear"
            }}
          >
            <img src={songs[currentSong].cover || "/placeholder.svg"} alt={songs[currentSong].title} />
          </motion.div>

          <div className="song-info">
            <motion.h2 
              className="song-title"
              key={currentSong}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {songs[currentSong].title}
            </motion.h2>
            <motion.p 
              className="song-artist"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {songs[currentSong].artist}
            </motion.p>
            <motion.p 
              className="song-description"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {songs[currentSong].description}
            </motion.p>
          </div>
        </div>

        <div className="progress-container">
          <div className="progress-bar" onClick={handleProgressClick}>
            <motion.div 
              className="progress-fill"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className="time-display">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-controls">
          <motion.button
            className="control-btn"
            onClick={prevSong}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <SkipBack />
          </motion.button>

          <motion.button
            className="play-btn"
            onClick={togglePlay}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={isPlaying ? { 
              boxShadow: [
                "0 10px 30px rgba(255, 107, 157, 0.5)",
                "0 15px 40px rgba(255, 107, 157, 0.8)",
                "0 10px 30px rgba(255, 107, 157, 0.5)"
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isPlaying ? <Pause /> : <Play />}
          </motion.button>

          <motion.button
            className="control-btn"
            onClick={nextSong}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <SkipForward />
          </motion.button>
        </div>

        <div className="volume-control">
          <Volume2 className="volume-icon" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => {
              setVolume(e.target.value);
              audioRef.current.volume = e.target.value / 100;
            }}
            className="volume-slider"
          />
          <span className="volume-value">{volume}%</span>
        </div>
      </motion.div>

      <div className="playlist">
        <h3>Danh sách bài hát yêu thích</h3>
        <div className="song-list">
          {songs.map((song, index) => (
            <motion.div
              key={song.id}
              className={`song-item ${currentSong === index ? 'active' : ''}`}
              onClick={() => {
                setCurrentSong(index);
                if (isPlaying) {
                  audioRef.current.src = song.url;
                  audioRef.current.play();
                }
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 15 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="song-cover">
                <img src={song.cover || "/placeholder.svg"} alt={song.title} />
                {currentSong === index && isPlaying && (
                  <motion.div
                    className="playing-indicator"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Play />
                  </motion.div>
                )}
              </div>
              <div className="song-details">
                <h4>{song.title}</h4>
                <p>{song.artist}</p>
                <span className="song-duration">{song.duration}</span>
              </div>
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              >
                <Heart className="like-icon" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="music-quote">
        <motion.div 
          className="quote-container"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Music className="quote-icon" />
          <p>
            "Âm nhạc là ngôn ngữ của tình yêu. Mỗi bài hát đều chứa đựng 
            những cảm xúc đặc biệt mà anh muốn gửi đến em. Hãy cùng anh lắng nghe 
            và cảm nhận tình yêu qua từng giai điệu nhé! 💕"
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MusicPlayer;
