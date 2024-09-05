import { useState, useEffect } from 'react';

export const useKeyPress = (targetKey) => {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const downHandler = ({ key }) => {
      if (key === targetKey) {
        setIsPressed(true);
      }
    };

    const upHandler = ({ key }) => {
      if (key === targetKey) {
        setIsPressed(false);
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return isPressed;
};