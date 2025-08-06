import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Heart, Calendar, MapPin, X } from 'lucide-react';

const PhotoAlbum = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Dữ liệu ảnh mẫu (có thể thay thế bằng ảnh thật)
  const photos = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop',
      title: 'Lần đầu gặp nhau',
      date: '16/12/2024',
      location: 'Hà Nội',
      description: 'Khoảnh khắc đầu tiên chúng ta gặp nhau'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&h=300&fit=crop',
      title: 'Buổi hẹn đầu tiên',
      date: '20/12/2024',
      location: 'Quán cà phê',
      description: 'Những phút giây ngọt ngào đầu tiên'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop',
      title: 'Du lịch cùng nhau',
      date: '25/12/2024',
      location: 'Đà Nẵng',
      description: 'Chuyến du lịch đầu tiên của chúng ta'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&h=300&fit=crop',
      title: 'Sinh nhật em',
      date: '10/01/2025',
      location: 'Nhà em',
      description: 'Sinh nhật đầu tiên anh được ở bên em'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop',
      title: 'Dã ngoại cuối tuần',
      date: '15/01/2025',
      location: 'Công viên',
      description: 'Những khoảnh khắc vui vẻ bên nhau'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&h=300&fit=crop',
      title: 'Lễ tình yêu',
      date: '14/02/2025',
      location: 'Nhà hàng',
      description: 'Valentine đầu tiên của chúng ta'
    }
  ];

  return (
    <motion.div 
      className="photo-album"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="album-header">
        <motion.h1 
          className="album-title"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Image className="title-icon" />
          Album ảnh của chúng ta
        </motion.h1>
        <motion.p 
          className="album-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Những khoảnh khắc đẹp nhất được lưu giữ tại đây
        </motion.p>
      </div>

      <div className="album-stats">
        <motion.div 
          className="stat"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Heart className="stat-icon" />
          <span>{photos.length} kỷ niệm</span>
        </motion.div>
        <motion.div 
          className="stat"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Calendar className="stat-icon" />
          <span>2024 - Hiện tại</span>
        </motion.div>
      </div>

      <div className="photo-grid">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            className="photo-item"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="photo-image">
              <img src={photo.src} alt={photo.title} />
              <div className="photo-overlay">
                <Heart className="overlay-icon" />
              </div>
            </div>
            <div className="photo-info">
              <h3>{photo.title}</h3>
              <div className="photo-meta">
                <span className="photo-date">
                  <Calendar className="meta-icon" />
                  {photo.date}
                </span>
                <span className="photo-location">
                  <MapPin className="meta-icon" />
                  {photo.location}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal xem ảnh */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="photo-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="modal-close"
                onClick={() => setSelectedPhoto(null)}
              >
                <X />
              </button>
              
              <div className="modal-image">
                <img src={selectedPhoto.src} alt={selectedPhoto.title} />
              </div>
              
              <div className="modal-info">
                <h2>{selectedPhoto.title}</h2>
                <p className="modal-description">{selectedPhoto.description}</p>
                <div className="modal-meta">
                  <span>
                    <Calendar className="meta-icon" />
                    {selectedPhoto.date}
                  </span>
                  <span>
                    <MapPin className="meta-icon" />
                    {selectedPhoto.location}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="album-footer">
        <motion.div 
          className="footer-message"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Heart className="footer-icon" />
          <p>
            "Mỗi bức ảnh là một câu chuyện, mỗi khoảnh khắc là một kỷ niệm. 
            Cảm ơn em đã cho anh những kỷ niệm đẹp nhất trong cuộc đời."
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PhotoAlbum; 