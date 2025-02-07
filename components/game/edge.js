import utilStyles from '../../styles/edge.module.css';
import { useState } from 'react';

const Edge = ({isSides, onClick, direction ,isFirstRow, id, isClicked}) => {
  // const [isClicked, setIsClicked] = useState(false);
  const handleClick = () => {
    if (!isClicked) {
    
      // Вызов функции onClick, если палочка еще не была нажата
      // onClick && 
      onClick(id);
    }
  };

  const edgeClasses = [
    utilStyles.edge,
    utilStyles[`edge-${direction}`],
    isClicked ? utilStyles.clicked : '', // Добавляем класс "checked", если isClicked === true
    isFirstRow ? utilStyles[`first_${direction}`] : '' ,// Дополнительный класс для первой строки
    isSides ? utilStyles.sides : '' // Дополнительный класс для первой строки
  ].join(' '); //объединяем классы в строку

  return (
    <div className={edgeClasses} onClick={handleClick}>

    </div>
  );
};

export default Edge;
