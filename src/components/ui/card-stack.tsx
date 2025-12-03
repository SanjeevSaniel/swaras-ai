'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

let interval: any;

type Card = {
  id: number;
  content: React.ReactNode;
};

export const CardStack = ({
  items,
  offset,
  scaleFactor,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState<Card[]>(items);

  const startFlipping = useCallback(() => {
    interval = setInterval(() => {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards]; // create a copy of the array
        newArray.unshift(newArray.pop()!); // move the last element to the front
        return newArray;
      });
    }, 5000);
  }, []);

  useEffect(() => {
    startFlipping();
    return () => clearInterval(interval);
  }, [startFlipping]);

  const handleCardClick = () => {
    setCards((prevCards: Card[]) => {
      const newArray = [...prevCards];
      newArray.unshift(newArray.pop()!);
      return newArray;
    });
    // Reset timer on manual interaction
    clearInterval(interval);
    startFlipping();
  };

  return (
    <div
      className='relative h-80 w-full md:h-80 md:w-96'
      onClick={handleCardClick}>
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className='absolute bg-white h-80 w-full md:h-80 md:w-96 rounded-3xl p-4 shadow-xl border border-neutral-200 shadow-black/[0.1] flex flex-col justify-between cursor-pointer hover:shadow-2xl transition-shadow duration-200'
            style={{
              transformOrigin: 'top center',
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
              zIndex: cards.length - index, // decrease z-index for the cards that are behind
            }}>
            {card.content}
          </motion.div>
        );
      })}
    </div>
  );
};
