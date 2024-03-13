/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Data from '../data/data';
import Card from './Card';
import confetti from 'canvas-confetti';
import { getStorageValue } from '../utils/getStorageValue';

interface ICard {
  id: number;
  name: string;
  img: string;
  matched: boolean;
  index?: number;
}

const GameBoard = () => {
  const [cardsArray, setCardsArray] = useState<Array<ICard>>([]);
  const [moves, setMoves] = useState(0);
  const [firstCard, setFirstCard] = useState<ICard | null>(null);
  const [secondCard, setSecondCard] = useState<ICard | null>(null);
  const [stopFlip, setStopFlip] = useState(false);
  const [won, setWon] = useState(0);
  const [bestScore, setBestScore] = useState(getStorageValue('bestScore') || Number.POSITIVE_INFINITY);
  let requestId: number;

  const frame = () => {
    const end = Date.now() + 500;
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });

    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });
    if (won === 0) return;
    if (Date.now() < end) {
      requestId = requestAnimationFrame(frame);
      return;
    }
  };

  const startNewGame = () => {
    setTimeout(() => {
      const randomOrderArray = Data.sort(() => 0.5 - Math.random()).slice(0, 6);
      const randomLetters = randomOrderArray.concat(randomOrderArray);
      cancelAnimationFrame(requestId);
      setCardsArray(randomLetters);
      setMoves(0);
      setFirstCard(null);
      setSecondCard(null);
      setWon(0);
    }, 1200);
  };

  const handleSelectedCards = (item: ICard, index: number) => {
    const itemWithIndex = { ...item, index: index };
    if (firstCard !== null && firstCard.index !== index) {
      setSecondCard(itemWithIndex);
    } else {
      setFirstCard(itemWithIndex);
    }
  };

  useEffect(() => {
    if (firstCard && secondCard) {
      setStopFlip(true);
      if (firstCard.name === secondCard.name) {
        setCardsArray((prevArray) => {
          return prevArray.map((unit) => {
            if (unit.name === firstCard.name) {
              return { ...unit, matched: true };
            } else {
              return unit;
            }
          });
        });
        setWon((preVal) => preVal + 1);
        removeSelection();
      } else {
        setTimeout(() => {
          removeSelection();
        }, 1000);
      }
    }
  }, [firstCard, secondCard]);

  const removeSelection = () => {
    setFirstCard(null);
    setSecondCard(null);
    setStopFlip(false);
    setMoves((prevValue) => prevValue + 1);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (won === 6) {
      frame();
      const highScore = Math.min(moves, bestScore);
      setBestScore(highScore);
      localStorage.setItem('bestScore', JSON.stringify(highScore));
    }
  }, [frame, won]);

  return (
    <div className='container'>
      <div className='header'>
        <h1>Memory Game</h1>
      </div>
      <div className='board'>
        {cardsArray.map((item: ICard, index) => (
          <Card
            item={item}
            key={index}
            handleSelectedCards={handleSelectedCards}
            toggled={index === firstCard?.index || index === secondCard?.index || item.matched === true}
            stopflip={stopFlip}
            index={index}
          />
        ))}
      </div>
      <div className='comments-container'>
        {won !== 6 ? (
          <div className='comments'>Moves: {moves}</div>
        ) : (
          <div className='comments'>You Won in {moves} moves</div>
        )}
        {bestScore > 0 && bestScore !== Infinity && <div className='comments'>Best Score: {bestScore}</div>}
      </div>
      <button className='button' onClick={startNewGame}>
        New Game
      </button>
    </div>
  );
};

export default GameBoard;
