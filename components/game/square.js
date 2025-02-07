import { useState, useEffect } from 'react';
import Edge from './edge';
import utilStyles from '../../styles/square.module.css';
const Square = ({currentTurn, isSides, isFirstRow, isLastInRow,  onClick, nextSquareLeftEdgeClicked, prewSquareBottomEdgeClicked, rowIndex, columnIndex, edgesClickedFromServer }) => {
  const [completedMarker, setCompletedMarker] = useState(null); // Сохраняем маркер завершенного квадрата

  const [edgesClicked, setEdgesClicked] = useState({
    top: false,
    right: false,
    bottom: false,
    left: false,
  });
  useEffect(() => {
    setEdgesClicked(edgesClickedFromServer);
  }, [edgesClickedFromServer]);

  const handleEdgeClick = (direction) => {
    // setEdgesClicked((prevEdges) => ({
    //   ...prevEdges,
    //   [direction]: true,
    // }));
    // Вызываем колбэк onClick, переданный из родительского компонента
   onClick(direction, rowIndex, columnIndex);

  };
  const edgeIsClicked = (direction) => {
    return edgesClicked[direction] 
    || edgesClickedFromServer[direction];
  };
  const isSquareCompleted = () => {
    // Если квадрат находится в первом ряду, мы должны проверить только нажатую нижнюю сторону,
    // так как верхняя сторона для него не является общей с другим квадратом
    if (isFirstRow || isSides ) {
      return edgesClicked.bottom && edgesClicked.top && edgesClicked.left && (nextSquareLeftEdgeClicked || edgesClicked.right) ;
    }
    // else if (typeBoard == 'diamond'){
    //   if()
    // }
    // else if(isFirstRow && isLastInRow){
    //   return edgesClicked.bottom && edgesClicked.top && edgesClicked.left && edgesClicked.right;
    // }
    // Если квадрат не находится в первом ряду, нам нужно также проверить нажатую верхнюю сторону,
   // так как нижняя сторона может быть общей с другим квадратом
    return edgesClicked.left && edgesClicked.bottom && prewSquareBottomEdgeClicked && (nextSquareLeftEdgeClicked || edgesClicked.right);
  };

  const showMarker = (currentTurn) => {
    switch (currentTurn) {
      case 0: return '♥️';
      case 1: return '♣️';
      case 2: return '💵';
      case 3: return '💎';
      default: return null;
    }
  };
  useEffect(() => {
    if (isSquareCompleted() && !completedMarker) {
      setCompletedMarker(showMarker(currentTurn)); // Сохраняем маркер только при первом завершении квадрата
    }
  }, [isSquareCompleted, currentTurn, completedMarker]);
  // Возвращаем JSX для вашей страницы
  return (
   <>
    {isFirstRow?
    <div className={utilStyles.firstRow}>
      <Edge 
      direction={'bottom'} 
      onClick={() => handleEdgeClick('bottom')}
      id={`edge-${rowIndex}-${columnIndex}-bottom`}
      isClicked={edgeIsClicked('bottom')} // Передаем состояние клика
      />
      <Edge 
      isFirstRow ={ true} 
      direction={'left'} 
      onClick={() => handleEdgeClick('left')}
      id={`edge-${rowIndex}-${columnIndex}-left`}
      isClicked={edgeIsClicked('left')} // Передаем состояние клика
      />
      <Edge
      direction={'top'}
      onClick={() => handleEdgeClick('top')}
      id={`edge-${rowIndex}-${columnIndex}-top`}
      isClicked={edgeIsClicked('top')} // Передаем состояние клика
      />
      {isLastInRow && 
      <Edge 
      isFirstRow ={true}
      direction={'right'}
      onClick={() => handleEdgeClick('right')}
      id={`edge-${rowIndex}-${columnIndex}-right`}
      isClicked={edgeIsClicked('right')} // Передаем состояние клика
      />}
      {completedMarker && <div className={utilStyles.marker}>{completedMarker}</div>}
    </div>
    :
    isSides?
    
    <div className={utilStyles.rowSides}>
      <Edge
      direction={'top'}
      onClick={() => handleEdgeClick('top')}
      id={`edge-${rowIndex}-${columnIndex}-top`}
      isClicked={edgeIsClicked('top')} // Передаем состояние клика
      />
      <Edge 
      direction={'bottom'} 
      onClick={() => handleEdgeClick('bottom')}
      isSides={true}
      id={`edge-${rowIndex}-${columnIndex}-bottom`}
      isClicked={edgeIsClicked('bottom')} // Передаем состояние клика
      />
      <Edge 
      direction={'left'} 
      isFirstRow ={true} 
      onClick={() => handleEdgeClick('left')}
      id={`edge-${rowIndex}-${columnIndex}-left`}
      isClicked={edgeIsClicked('left')} // Передаем состояние клика
      />
      {isLastInRow && <Edge 
      direction={'right'} 
      isFirstRow ={true}
      onClick={() => handleEdgeClick('right')}
      id={`edge-${rowIndex}-${columnIndex}-right`}
      isClicked={edgeIsClicked('right')} // Передаем состояние клика
      />}
       {completedMarker && <div className={utilStyles.marker}>{completedMarker}</div>}
    </div>
    :
    <div
     className={utilStyles.container}
     >
      <Edge 
      direction={'bottom'} 
      onClick={() => handleEdgeClick('bottom')}
      id={`edge-${rowIndex}-${columnIndex}-bottom`}
      isClicked={edgeIsClicked('bottom')} // Передаем состояние клика
      />
      <Edge 
      direction={'left'} 
      onClick={() => handleEdgeClick('left')}
      id={`edge-${rowIndex}-${columnIndex}-left`}
      isClicked={edgeIsClicked('left')} // Передаем состояние клика
      />
      {isLastInRow && <Edge 
      direction={'right'} 
      onClick={() => handleEdgeClick('right')}
      id={`edge-${rowIndex}-${columnIndex}-right`}
      isClicked={edgeIsClicked('right')} // Передаем состояние клика
      />}
    {completedMarker && <div className={utilStyles.marker}>{completedMarker}</div>}
    </div>
  }
   </> 
  )
};

export default Square;
