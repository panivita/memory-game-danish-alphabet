type CardProps = {
  item: {
    name: string;
    img: string;
  };
  handleSelectedCards: any;
  toggled: boolean;
  stopflip: boolean;
  index: number;
};

const Card = ({ item, handleSelectedCards, toggled, stopflip, index }: CardProps) => {
  return (
    <div className='item'>
      <div className={toggled ? 'toggled' : ''}>
        <img className='face' src={item.img} alt={`letter-${item.name}`} />
        <div className='back' onClick={() => !stopflip && handleSelectedCards(item, index)} />
      </div>
    </div>
  );
};

export default Card;
