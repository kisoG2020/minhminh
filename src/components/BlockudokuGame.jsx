"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, Heart, Sparkles } from 'lucide-react';
import './BlockudokuGame.css';

// Proper Blockudoku block shapes - more balanced and playable
const BLOCK_SHAPES = [
  [[1]], // Single block
  [[1, 1]], // 2-block horizontal
  [[1], [1]], // 2-block vertical
  [[1, 1, 1]], // 3-block horizontal
  [[1], [1], [1]], // 3-block vertical
  [[1, 1], [1, 1]], // 2x2 square
  [[1, 1, 1], [1, 0, 0]], // L-shape
  [[1, 1, 1], [0, 0, 1]], // Reverse L-shape
  [[1, 0, 0], [1, 1, 1]], // L-shape rotated
  [[0, 0, 1], [1, 1, 1]], // Reverse L-shape rotated
  [[1, 1, 0], [0, 1, 1]], // Z-shape
  [[0, 1, 1], [1, 1, 0]], // S-shape
  [[1, 1, 1], [0, 1, 0]], // T-shape
  [[0, 1, 0], [1, 1, 1]], // T-shape rotated
  [[1, 0], [1, 0], [1, 1]], // L-shape small
  [[0, 1], [0, 1], [1, 1]], // Reverse L-shape small
];

const BlockudokuGame = () => {
  const [grid, setGrid] = useState(() => Array(9).fill(null).map(() => Array(9).fill(0)));
  const [score, setScore] = useState(0);
  const [currentBlocks, setCurrentBlocks] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [previewPosition, setPreviewPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const gridRef = useRef(null);
  const dragImageRef = useRef(null);
  const lastTouchUpdateRef = useRef(0);

  // Generate balanced blocks
  const generateBlocks = useCallback(() => {
    const blocks = [];
    for (let i = 0; i < 3; i++) {
      const randomShape = BLOCK_SHAPES[Math.floor(Math.random() * BLOCK_SHAPES.length)];
      blocks.push({
        id: i,
        shape: randomShape,
        used: false
      });
    }
    return blocks;
  }, []);

  // Initialize game
  const startGame = () => {
    setGrid(Array(9).fill(null).map(() => Array(9).fill(0)));
    setScore(0);
    setCurrentBlocks(generateBlocks());
    setGameOver(false);
    setIsPlaying(true);
    setDraggedBlock(null);
    setPreviewPosition(null);
    setIsDragging(false);
  };

  // Check if block can be placed at position
  const canPlaceBlock = (grid, block, row, col) => {
    for (let r = 0; r < block.length; r++) {
      for (let c = 0; c < block[r].length; c++) {
        if (block[r][c] === 1) {
          const newRow = row + r;
          const newCol = col + c;
          if (newRow >= 9 || newCol >= 9 || newRow < 0 || newCol < 0 || grid[newRow][newCol] === 1) {
            return false;
          }
        }
      }
    }
    return true;
  };

  // Place block on grid
  const placeBlock = (row, col, blockToPlace = draggedBlock) => {
    if (!blockToPlace || !canPlaceBlock(grid, blockToPlace.shape, row, col)) {
      return false;
    }

    const newGrid = grid.map(row => [...row]);
    
    // Place the block
    for (let r = 0; r < blockToPlace.shape.length; r++) {
      for (let c = 0; c < blockToPlace.shape[r].length; c++) {
        if (blockToPlace.shape[r][c] === 1) {
          newGrid[row + r][col + c] = 1;
        }
      }
    }

    // Mark block as used
    const newBlocks = currentBlocks.map(block => 
      block.id === blockToPlace.id ? { ...block, used: true } : block
    );

    setCurrentBlocks(newBlocks);
    setDraggedBlock(null);
    setPreviewPosition(null);
    setIsDragging(false);

    // Check for completed lines and clear them
    const { clearedGrid, linesCleared } = clearCompletedLines(newGrid);
    setGrid(clearedGrid);
    
    // Score: 10 points per block placed + 100 points per line cleared
    const blockPoints = blockToPlace.shape.flat().filter(cell => cell === 1).length * 10;
    const linePoints = linesCleared * 100;
    setScore(prev => prev + blockPoints + linePoints);

    // Generate new blocks if all are used
    if (newBlocks.every(block => block.used)) {
      setCurrentBlocks(generateBlocks());
    }

    return true;
  };

  // Clear completed lines (rows AND columns simultaneously)
  const clearCompletedLines = (grid) => {
    let newGrid = grid.map(row => [...row]);
    let linesCleared = 0;

    // Check for completed rows and columns
    const completedRows = [];
    const completedColumns = [];

    // Find completed rows
    for (let row = 0; row < 9; row++) {
      if (newGrid[row].every(cell => cell === 1)) {
        completedRows.push(row);
      }
    }

    // Find completed columns
    for (let col = 0; col < 9; col++) {
      if (newGrid.every(row => row[col] === 1)) {
        completedColumns.push(col);
      }
    }

    // Only clear if both a row AND a column are completed
    if (completedRows.length > 0 && completedColumns.length > 0) {
      // Clear completed rows
      for (const row of completedRows) {
        newGrid[row] = Array(9).fill(0);
        linesCleared++;
      }

      // Clear completed columns
      for (const col of completedColumns) {
        for (let row = 0; row < 9; row++) {
          newGrid[row][col] = 0;
        }
        linesCleared++;
      }
    }

    return { clearedGrid: newGrid, linesCleared };
  };

  // Create drag image
  const createDragImage = (block, isTouch = false, clientX = 0, clientY = 0) => {
    try {
      // Clean up any existing drag image
      if (dragImageRef.current) {
        document.body.removeChild(dragImageRef.current);
        dragImageRef.current = null;
      }

      const dragImage = document.createElement('div');
      dragImage.className = isTouch ? 'touch-drag-image' : 'drag-image';
      dragImage.id = `drag-image-${block.id}`;

      const blockGrid = document.createElement('div');
      blockGrid.className = 'drag-block-grid';

      block.shape.forEach(row => {
        const rowElement = document.createElement('div');
        rowElement.className = 'drag-block-row';
        row.forEach(cell => {
          const cellElement = document.createElement('div');
          cellElement.className = `drag-block-cell ${cell === 1 ? 'drag-block-cell-filled' : 'drag-block-cell-empty'}`;
          rowElement.appendChild(cellElement);
        });
        blockGrid.appendChild(rowElement);
      });

      dragImage.appendChild(blockGrid);
      document.body.appendChild(dragImage);
      dragImageRef.current = dragImage;

      if (isTouch) {
        dragImage.style.left = `${clientX - 30}px`;
        dragImage.style.top = `${clientY - 30}px`;
      }
    } catch (error) {
      console.error('Error creating drag image:', error);
    }
  };

  // Clean up drag image
  const cleanupDragImage = () => {
    try {
      if (dragImageRef.current) {
        document.body.removeChild(dragImageRef.current);
        dragImageRef.current = null;
      }
    } catch (error) {
      console.error('Error cleaning up drag image:', error);
    }
  };

  // Get grid cell position from coordinates
  const getGridCellPosition = (clientX, clientY) => {
    try {
      if (!gridRef.current) return null;
      const gridRect = gridRef.current.getBoundingClientRect();
      const cellWidth = gridRect.width / 9;
      const cellHeight = gridRect.height / 9;

      const col = Math.floor((clientX - gridRect.left) / cellWidth);
      const row = Math.floor((clientY - gridRect.top) / cellHeight);

      if (row >= 0 && row < 9 && col >= 0 && col < 9) {
        return { row, col };
      }
      return null;
    } catch (error) {
      console.error('Error getting grid cell position:', error);
      return null;
    }
  };

  // Touch handlers
  const handleTouchStart = (e, block) => {
    if (block.used) return;
    
    try {
      e.preventDefault();
      setDraggedBlock(block);
      setIsDragging(true);

      const touch = e.touches[0];
      createDragImage(block, true, touch.clientX, touch.clientY);
    } catch (error) {
      console.error('Error in handleTouchStart:', error);
      setDraggedBlock(null);
      setIsDragging(false);
      cleanupDragImage();
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (!draggedBlock || !dragImageRef.current) return;

    try {
      const touch = e.touches[0];
      const now = performance.now();
      if (now - lastTouchUpdateRef.current < 16) return; // Throttle to ~60fps
      lastTouchUpdateRef.current = now;

      // Update drag image position
      dragImageRef.current.style.left = `${touch.clientX - 30}px`;
      dragImageRef.current.style.top = `${touch.clientY - 30}px`;

      // Update preview position
      const cellPosition = getGridCellPosition(touch.clientX, touch.clientY);
      if (cellPosition && canPlaceBlock(grid, draggedBlock.shape, cellPosition.row, cellPosition.col)) {
        setPreviewPosition(cellPosition);
      } else {
        setPreviewPosition(null);
      }
    } catch (error) {
      console.error('Error in handleTouchMove:', error);
      setPreviewPosition(null);
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    if (!draggedBlock) return;

    try {
      const touch = e.changedTouches[0];
      const cellPosition = getGridCellPosition(touch.clientX, touch.clientY);
      if (cellPosition) {
        placeBlock(cellPosition.row, cellPosition.col);
      }

      cleanupDragImage();
      setDraggedBlock(null);
      setPreviewPosition(null);
      setIsDragging(false);
    } catch (error) {
      console.error('Error in handleTouchEnd:', error);
      cleanupDragImage();
      setDraggedBlock(null);
      setPreviewPosition(null);
      setIsDragging(false);
    }
  };

  // Drag handlers (for desktop)
  const handleDragStart = (e, block) => {
    if (block.used) return;
    
    try {
      setDraggedBlock(block);
      setIsDragging(true);
      
      createDragImage(block);
      e.dataTransfer.setDragImage(dragImageRef.current, 30, 30);
      e.dataTransfer.effectAllowed = 'move';
      
      // Clean up after drag starts
      setTimeout(cleanupDragImage, 0);
    } catch (error) {
      console.error('Error in handleDragStart:', error);
      setDraggedBlock(null);
      setIsDragging(false);
      cleanupDragImage();
    }
  };

  const handleDragOver = (e, row, col) => {
    e.preventDefault();
    if (!draggedBlock) return;
    
    try {
      if (canPlaceBlock(grid, draggedBlock.shape, row, col)) {
        setPreviewPosition({ row, col });
        e.dataTransfer.dropEffect = 'move';
      } else {
        setPreviewPosition(null);
        e.dataTransfer.dropEffect = 'none';
      }
    } catch (error) {
      console.error('Error in handleDragOver:', error);
      setPreviewPosition(null);
    }
  };

  const handleDrop = (e, row, col) => {
    e.preventDefault();
    if (!draggedBlock) return;
    
    try {
      const success = placeBlock(row, col, draggedBlock);
      if (!success) {
        setDraggedBlock(null);
        setPreviewPosition(null);
        setIsDragging(false);
      }
    } catch (error) {
      console.error('Error in handleDrop:', error);
      setDraggedBlock(null);
      setPreviewPosition(null);
      setIsDragging(false);
    }
  };

  const handleDragEnd = () => {
    try {
      cleanupDragImage();
      setDraggedBlock(null);
      setPreviewPosition(null);
      setIsDragging(false);
    } catch (error) {
      console.error('Error in handleDragEnd:', error);
    }
  };

  // Check if any block can be placed
  const canPlaceAnyBlock = useCallback(() => {
    const availableBlocks = currentBlocks.filter(block => !block.used);
    
    for (const block of availableBlocks) {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (canPlaceBlock(grid, block.shape, row, col)) {
            return true;
          }
        }
      }
    }
    return false;
  }, [grid, currentBlocks]);

  // Check game over
  useEffect(() => {
    if (isPlaying && currentBlocks.length > 0 && !canPlaceAnyBlock()) {
      setGameOver(true);
      setIsPlaying(false);
    }
  }, [grid, currentBlocks, canPlaceAnyBlock, isPlaying]);

  // Initialize blocks when game starts
  useEffect(() => {
    if (isPlaying && currentBlocks.length === 0) {
      setCurrentBlocks(generateBlocks());
    }
  }, [isPlaying, currentBlocks.length, generateBlocks]);

  // Check if cell should show preview
  const shouldShowPreview = (row, col) => {
    if (!previewPosition || !draggedBlock) return false;
    
    const { row: previewRow, col: previewCol } = previewPosition;
    
    for (let r = 0; r < draggedBlock.shape.length; r++) {
      for (let c = 0; c < draggedBlock.shape[r].length; c++) {
        if (draggedBlock.shape[r][c] === 1) {
          if (previewRow + r === row && previewCol + c === col) {
            return true;
          }
        }
      }
    }
    return false;
  };

  return (
    <motion.div 
      className="game-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="game-wrapper">
        {/* Header */}
        <motion.div 
          className="header"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="header-title">
            <Heart className="icon-heart" />
            Love Blockudoku
            <Heart className="icon-heart" />
          </h1>
          <p className="header-subtitle">Kéo thả khối để hoàn thành hàng 💕</p>
        </motion.div>

        {/* Score */}
        <motion.div 
          className="score-container"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="score-box">
            <Trophy className="icon-trophy" />
            <span className="score-text">Score: {score}</span>
          </div>
        </motion.div>

        {/* Game Area */}
        <div className="game-area">
          {/* Game Grid */}
          <motion.div 
            className="grid-container"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            ref={gridRef}
          >
            <div className="grid">
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <motion.div
                    key={`${rowIndex}-${colIndex}`}
                    className={`grid-cell ${
                      cell === 1 || shouldShowPreview(rowIndex, colIndex)
                        ? 'cell-filled'
                        : 'cell-empty'
                    } ${
                      shouldShowPreview(rowIndex, colIndex) ? 'cell-preview' : ''
                    } ${
                      (rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? 'cell-border-bottom' : ''
                    } ${
                      (colIndex + 1) % 3 === 0 && colIndex !== 8 ? 'cell-border-right' : ''
                    }`}
                    onDragOver={(e) => handleDragOver(e, rowIndex, colIndex)}
                    onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                    whileHover={{ scale: 1.05 }}
                  />
                ))
              )}
            </div>
          </motion.div>

          {/* Block Selection */}
          <motion.div 
            className="blocks-container"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="blocks-title">
              <Heart className="icon-heart-small" />
              Kéo khối vào lưới
              <Heart className="icon-heart-small" />
            </h3>
            <div className="blocks-list">
              {currentBlocks.map((block) => (
                <motion.div
                  key={block.id}
                  className={`block-item ${
                    block.used 
                      ? 'block-used' 
                      : draggedBlock?.id === block.id
                        ? 'block-dragging'
                        : 'block-available'
                  }`}
                  draggable={!block.used}
                  onDragStart={(e) => handleDragStart(e, block)}
                  onDragEnd={handleDragEnd}
                  onTouchStart={(e) => handleTouchStart(e, block)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  whileHover={!block.used ? { scale: 1.05 } : {}}
                  whileTap={!block.used ? { scale: 0.95 } : {}}
                >
                  <div className="block-grid">
                    {block.shape.map((row, rowIndex) => (
                      <div key={rowIndex} className="block-row">
                        {row.map((cell, colIndex) => (
                          <div
                            key={colIndex}
                            className={`block-cell ${cell === 1 ? 'block-cell-filled' : 'block-cell-empty'}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  {!block.used && (
                    <p className="block-label">Kéo thả</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Dragging Indicator */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              className="dragging-indicator"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              💖 Đang kéo khối tình yêu!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game States */}
        <AnimatePresence>
          {!isPlaying && !gameOver && (
            <motion.div 
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="modal-content"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <Heart className="modal-icon" />
                <h2 className="modal-title">Love Blockudoku!</h2>
                <p className="modal-text">
                  Kéo thả khối để hoàn thành hàng và cột cùng lúc để xóa chúng! 💕
                </p>
                <motion.button
                  className="modal-button"
                  onClick={startGame}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Bắt đầu chơi 💖
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {gameOver && (
            <motion.div 
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="modal-content"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <Heart className="modal-icon" />
                <h2 className="modal-title">Game Over! 💔</h2>
                <p className="modal-text">Điểm cuối:</p>
                <p className="modal-score">{score}</p>
                <motion.button
                  className="modal-button modal-button-replay"
                  onClick={startGame}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw className="icon-replay" />
                  Chơi lại 💕
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        <motion.div 
          className="instructions"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="instructions-content">
            <Sparkles className="icon-sparkles" />
            <div>
              <h3 className="instructions-title">Luật chơi Blockudoku:</h3>
              <ul className="instructions-list">
                <li>• 💖 <strong>Kéo thả:</strong> Kéo khối từ dưới lên lưới</li>
                <li>• 💕 <strong>Xóa đường:</strong> Hoàn thành cả hàng VÀ cột cùng lúc</li>
                <li>• 💗 <strong>Điểm số:</strong> 10 điểm/khối + 100 điểm/đường xóa</li>
                <li>• 💘 <strong>Game over:</strong> Khi không thể đặt thêm khối nào</li>
                <li>• 💝 <strong>Mục tiêu:</strong> Ghi điểm cao nhất có thể!</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BlockudokuGame;