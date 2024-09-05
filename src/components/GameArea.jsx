import React, { useState, useEffect, useCallback } from 'react';
import { useKeyPress } from '../hooks/useKeyPress';

// Game constants (easily adjustable)
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 800;
const INITIAL_PLAYER_SIZE = 2;
const FOOD_SIZE = 1;
const GROWTH_RATE = 1;
const MOVE_SPEED = 5;
const WINNING_SCORE = 700;

const GameArea = () => {
  const [playerPos, setPlayerPos] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
  const [playerSize, setPlayerSize] = useState(INITIAL_PLAYER_SIZE);
  const [food, setFood] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const wPressed = useKeyPress('w');
  const aPressed = useKeyPress('a');
  const sPressed = useKeyPress('s');
  const dPressed = useKeyPress('d');

  const spawnFood = useCallback(() => {
    const newFood = {
      x: Math.random() * (GAME_WIDTH - FOOD_SIZE),
      y: Math.random() * (GAME_HEIGHT - FOOD_SIZE),
    };
    setFood(prevFood => [...prevFood, newFood]);
  }, []);

  const movePlayer = useCallback(() => {
    setPlayerPos(prev => {
      let newX = prev.x;
      let newY = prev.y;
      if (wPressed) newY = Math.max(0, newY - MOVE_SPEED);
      if (sPressed) newY = Math.min(GAME_HEIGHT - playerSize, newY + MOVE_SPEED);
      if (aPressed) newX = Math.max(0, newX - MOVE_SPEED);
      if (dPressed) newX = Math.min(GAME_WIDTH - playerSize, newX + MOVE_SPEED);
      return { x: newX, y: newY };
    });
  }, [wPressed, aPressed, sPressed, dPressed, playerSize]);

  const checkCollision = useCallback(() => {
    const playerRadius = playerSize / 2;
    setFood(prevFood => prevFood.filter(f => {
      const dx = f.x - (playerPos.x + playerRadius);
      const dy = f.y - (playerPos.y + playerRadius);
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < playerRadius + FOOD_SIZE / 2) {
        setScore(prev => prev + 1);
        setPlayerSize(prev => prev + GROWTH_RATE);
        return false;
      }
      return true;
    }));
  }, [playerPos, playerSize]);

  useEffect(() => {
    if (score >= WINNING_SCORE) {
      setGameOver(true);
    }
  }, [score]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (!gameOver) {
        movePlayer();
        checkCollision();
        if (Math.random() < 0.1) spawnFood();
      }
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [movePlayer, checkCollision, spawnFood, gameOver]);

  return (
    <div className="relative" style={{ width: GAME_WIDTH, height: GAME_HEIGHT, border: '1px solid black' }}>
      {food.map((f, index) => (
        <div
          key={index}
          className="absolute bg-red-500"
          style={{
            left: f.x,
            top: f.y,
            width: FOOD_SIZE,
            height: FOOD_SIZE,
          }}
        />
      ))}
      <div
        className="absolute bg-blue-500 rounded-full"
        style={{
          left: playerPos.x,
          top: playerPos.y,
          width: playerSize,
          height: playerSize,
        }}
      />
      <div className="absolute top-2 left-2 text-lg font-bold">
        Score: {score}
      </div>
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-4xl font-bold">
          Game Over! You Win!
        </div>
      )}
    </div>
  );
};

export default GameArea;