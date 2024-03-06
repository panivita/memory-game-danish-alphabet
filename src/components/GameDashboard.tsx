import React, { useEffect, useState } from 'react';
import Data from '../data/data';
import Card from './Card';

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

  const startNewGame = () => {
    setTimeout(() => {
      const randomOrderArray = Data.sort(() => 0.5 - Math.random()).slice(0, 6);
      const randomLetters = randomOrderArray.concat(randomOrderArray);
      console.log(randomLetters);
      setCardsArray(randomLetters);
      setMoves(0);
      setFirstCard(null);
      setSecondCard(null);
      setWon(0);
    }, 1200);
  };

  const handleSelectedCards = (item: ICard, index: number) => {
    const itemWithIndex = {...item, index: index}
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

  return (
    <div className='container'>
      <div className='header'>
        <h1>Memory Game</h1>
      </div>
      <div className='board'>
        {cardsArray.map((item: ICard, index) => {
          console.log(item, firstCard, secondCard, item.matched)
          return(
          <Card
            item={item}
            key={index}
            handleSelectedCards={handleSelectedCards}
            toggled={index === firstCard?.index || index === secondCard?.index || item.matched === true}
            stopflip={stopFlip}
            index={index}
          />
        )})}
      </div>

      {won !== 6 ? (
        <div className='comments'>Moves : {moves}</div>
      ) : (
        <div className='comments'>You Won in {moves} moves</div>
      )}
      <button className='button' onClick={startNewGame}>
        New Game
      </button>
    </div>
  );
};

export default GameBoard;
