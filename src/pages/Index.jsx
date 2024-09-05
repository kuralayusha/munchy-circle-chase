import React from 'react';
import GameArea from '../components/GameArea';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">Circle Growth Game</h1>
      <p className="text-xl text-gray-600 mb-4">
        Use WASD keys to move. Eat red squares to grow. Reach 700 points to win!
      </p>
      <GameArea />
    </div>
  );
};

export default Index;