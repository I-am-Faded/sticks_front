import React, { useEffect, useState, useRef, useCallback } from 'react';
import Square from './square';
import utilStyles from '../../styles/square.module.css'
import { useWebSocket } from '../../webSocket/websocketContext';
import Modal from '../main/modal.js';


const GameBoard = ({numRows, numColumns, ws, roomId, isConnected, sessionId, currentTurn, playerId, moves, typeBoard}) => {
  // {numRows, numSquaresInRow}

  const [clickedEdges, setClickedEdges] = useState({});;
  const [completedMoves, setCompletedMoves] = useState([]); 
  const [nextSquareLeftEdgeClicked, setNextSquareLeftEdgeClicked] = useState({});
  const [prewSquareBottomEdgeClicked, setPrewSquareBottomEdgeClicked] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {

  }, [typeBoard]);

  // const wsRef = useRef(ws);  // Храним WebSocket в ref

  // useEffect(() => {
  //   const savedMoves = JSON.parse(localStorage.getItem('completedMoves'));
  //   if (savedMoves) {
  //     setCompletedMoves(savedMoves);
  //   }
  // }, []);
  // useEffect(() => {
  //   localStorage.setItem('completedMoves', JSON.stringify(completedMoves));
  // }, [completedMoves]);
  
  // const handleEdgeClick = (rowIndex, columnIndex, direction) => {
  //   const edgeId = `edge-${rowIndex}-${columnIndex}-${direction}`;
  //   setClickedEdges((prevEdges) => ({
  //     ...prevEdges,
  //     [edgeId]: true,
  //   })); 
  //   const message = {
  //     type: 'edge-clicked',
  //     rowIndex,
  //     columnIndex,
  //     direction,
  //   };
  //   ws.send(message);
  // };

  // useEffect(() => {

  //   const handleMessage = (message) => {
  //     // console.log('Message handler invoked:', message);
  //     // if (message.type ==='createId'){
  //     //   setPlayerId(message.playerId);
  //     //   setCurrentTurn(message.currentTurn);
  //     // }      
  
  //     if (message.type === 'player-move') {
  //       console.log('maked move');

  //       handleMove(message.move);
  //       // setCurrentTurn(message.currentTurn);
  //     } else if (message.type === 'sync-moves') {
  //       message.move.forEach((move) =>{ handleMove(move)});
  //       // setPlayerId(message.playerId);
  //       // setCurrentTurn(message.currentTurn);
  //       // console.log('syncmoves'); 
  //     } else {
  //       console.log('Unknown message type:', message.type);
  //   }
  //   };

  //   // Устанавливаем обработчик сообщений
    
  //   ws.onMessage(handleMessage);
    
  //   // синхронизация с другими игроками
  //   // ws.send({type: 'createId',  roomId});
  //   // if(ws){

  //   ws.send({
  //     type: 'sync-moves',
  //     roomId,
  //   })
    
  // // }
  // //   // Очистка эффекта (снятие обработчика сообщений) при размонтировании
  //   return () => {
  //     ws.removeMessageHandler(handleMessage);
  //     console.log('WebSocket message handler removed');
  //   };
  // }, [ws]);
  useEffect(() => {
    moves.forEach((move) => handleMove(move));
  }, [moves]);

  const handleMove = useCallback((move) => {

    setCompletedMoves((prevMoves) => [...prevMoves, move]);
    const { rowIndex, columnIndex, direction } = move;
    const key = `${rowIndex}-${columnIndex}`;
    setClickedEdges((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [direction]: true,
      },
    }));
    if (direction === 'left') {
      updateNextSquareLeftEdgeClicked(rowIndex, columnIndex);
    } else if (direction === 'bottom') {
      updatePrewSquareBottomEdgeClicked(rowIndex, columnIndex);
    }
  }, []);
  
  // useEffect(() => {
  //   if (isConnected && sessionId) {
     
  //   ws.send({
  //     type: 'getNickName',
  //     roomId, 
  //   })
  //   ws.send({
  //     type: 'sync-moves',
  //     roomId,
  //   })
 
  //   }
  // }, [isConnected, sessionId]); 


//   const handleMove = (move) => {
//     setCompletedMoves((prevMoves) => [...prevMoves, move]);
//     const { rowIndex, columnIndex, direction } = move;
//     const key = `${rowIndex}-${columnIndex}`;
//     setClickedEdges((prev) => ({

//       ...prev,
//       [key]: {
//         ...prev[key],
//         [direction]: true,
//       },
  
//     }));

//     if (direction === 'left') {
//       updateNextSquareLeftEdgeClicked(rowIndex, columnIndex);
//     } else if (direction === 'bottom') {
//       updatePrewSquareBottomEdgeClicked(rowIndex, columnIndex);
//     }
// // console.log(clickedEdges)
// //       const isCompleted = checkSquareCompletion(rowIndex, columnIndex, direction);
// //       if (isCompleted) {
// //         alert('ход завершил квадрат');
// //       }

//   };
  const closeModal = () => {
    setIsModalOpen(false); // Закрываем модальное окно
  };
  const audioRef= React.useRef(null)

  const handleEdgeClick = (rowIndex, columnIndex, direction) => {
    if (audioRef.current) {
      audioRef.current.volume = 0.35 ;

      audioRef.current.play();

    }
    if (currentTurn != playerId) {
     
      // alert('Сейчас не ваш ход!');
      setIsModalOpen(true); // Открываем модальное окно
      return;
    }

    const move = { rowIndex, columnIndex, direction };
  
    ws.send({
      type: 'player-move',
      roomId,
      move,
    });

  }
  // Функция для обновления состояния нажатых сторон соседних квадратов
  const updateNextSquareLeftEdgeClicked = (rowIndex, columnIndex) => {
    // Проверяем, не последний ли квадрат в ряду
  

      const key = `${rowIndex}-${columnIndex - 1}-left`;
      setNextSquareLeftEdgeClicked((prevEdges) => ({
        ...prevEdges,
        [key]: true,
      }));
  
   
  };
  
  const updatePrewSquareBottomEdgeClicked = useCallback((rowIndex, columnIndex) => {
    if(typeBoard =='square'){
      const key =  `${rowIndex+1}-${columnIndex}-bottom` ;
      setPrewSquareBottomEdgeClicked((prevEdges) => ({
        ...prevEdges,
        [key]: true,
      }))
    }
    else if(typeBoard =='diamond') {
        const key = rowIndex +1 < Math.floor(numRows/2) ?
        `${rowIndex + 1}-${columnIndex+1}-bottom`
        :
        rowIndex+1 > Math.ceil(numRows/2)?
        `${rowIndex + 1}-${columnIndex-1}-bottom`
        :
        `${rowIndex+1}-${columnIndex}-bottom` ;
        setPrewSquareBottomEdgeClicked((prevEdges) => ({
          ...prevEdges,
          [key]: true,
        }))
    };
  

  },[typeBoard])




  const generateRowConfig = (numRows) => {
    const rows = [];

    for (let i = 1; i <= Math.ceil(numRows/2); i++) {
      if (i==Math.ceil(numRows/2) && numRows %2 ==0 ){rows.push(i*2 )}

      else if(i==Math.ceil(numRows/2)){rows.push(i*2 -1)}

      else if(numRows%2==0){
      rows.push(i * 2 ); // Верхняя часть ромба
      }
      else{
        rows.push(i * 2 +1); // Верхняя часть ромба
      }
    }
    for (let i = Math.floor(numRows/2); i >= 1; i--) {
       if(i==Math.floor(numRows/2) && numRows%2 ==0 ){rows.push(i*2)}
       else if(numRows%2==0){
      rows.push(i * 2 ); // Нижняя часть ромба
      }
      else{rows.push(i*2+1)}
    }

    return rows;
  };


  const rowConfig = generateRowConfig(numRows);

  // const checkSquareCompletion = (rowIndex, columnIndex, direction) => {
  //   const key = `${rowIndex}-${columnIndex}`;
  //   const edges = clickedEdges[key] || {}; // Плучаем нажатые стороны текущего квадрата
  // // console.log('cheksquare', edges.bottom,edges.top,edges.left, edges.right)
  //   // Проверяем завершение текущего квадрата
  //   const isCurrentSquareCompleted =  
  //     rowIndex == 0 ? edges.bottom && edges.top && edges.left && (edges.nextSquareLeftEdgeClicked || edges.right)
  //     :edges.left && edges.bottom && edges.prewSquareBottomEdgeClicked && (edges.nextSquareLeftEdgeClicked || edges.right);
    

  //   // Флаг для проверки завершения соседнего квадрата
  //   let isNeighborSquareCompleted = false;
  
  //   // Проверяем соседний квадрат в зависимости от нажатой стороны
  //   if (direction === 'left' && columnIndex > 0) {
  //     const leftKey = `${rowIndex}-${columnIndex - 1}`;
  //     const leftEdges = clickedEdges[leftKey] || {};
  //     isNeighborSquareCompleted = rowIndex == 0 ? leftEdges.bottom && leftEdges.top && leftEdges.left && (leftEdges.nextSquareLeftEdgeClicked || leftEdges.right)
  //     :leftEdges.left && leftEdges.bottom && leftEdges.prewSquareBottomEdgeClicked && (leftEdges.nextSquareLeftEdgeClicked || leftEdges.right);
  //   }
  
  //   if (direction === 'bottom' && rowIndex < numRows - 1) {
  //     const bottomKey = `${rowIndex + 1}-${columnIndex}`;
  //     const bottomEdges = clickedEdges[bottomKey] || {};
  //     isNeighborSquareCompleted = rowIndex == 0 ? bottomEdges.bottom && bottomEdges.top && bottomEdges.left && (bottomEdges.nextSquareLeftEdgeClicked || bottomEdges.right)
  //     :bottomEdges.left && bottomEdges.bottom && bottomEdges.prewSquareBottomEdgeClicked && (bottomEdges.nextSquareLeftEdgeClicked || bottomEdges.right);
  //   }
  
  //   // Если завершён хотя бы один квадрат (текущий или соседний)
  //   return isCurrentSquareCompleted || isNeighborSquareCompleted;
  // };
  // setInterval(() => {
  //   console.log(playerId, currentTurn)
  // }, 4000);
  // Возвращаем JSX для вашей страницы
  return (
    typeBoard == 'square' ? (<div className={utilStyles.board}>
    {
      
    Array.from({ length: numRows }, (_, rowIndex) => (
      <div key={rowIndex} className={utilStyles.row}>
        {Array.from({ length: numColumns }, (_, columnIndex) => {
          const key = `${rowIndex}-${columnIndex}`;
          return(
            
          <Square
            // className={utilStyles.boardCell}
            key={`${rowIndex}-${columnIndex}`}
            // rowIndex={rowIndex}
            // columnIndex={columnIndex}
            currentTurn ={currentTurn}
            isFirstRow={rowIndex === 0}
            isLastInRow={columnIndex === numColumns-1}
            prewSquareBottomEdgeClicked ={prewSquareBottomEdgeClicked[`${rowIndex}-${columnIndex}-bottom`]}
            nextSquareLeftEdgeClicked={nextSquareLeftEdgeClicked[`${rowIndex}-${columnIndex}-left`]}
            onClick={(direction) => handleEdgeClick(rowIndex, columnIndex, direction)}
            edgesClickedFromServer={clickedEdges[key] || {}}
            // onClick={(direction) =>  direction == 'left' ? updateNextSquareLeftEdgeClicked(rowIndex, columnIndex): direction == 'bottom'? updatePrewSquareBottomEdgeClicked(rowIndex, columnIndex): false}
          />)}
        )}
      </div>
    ))}
     <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>Ошибка!</h2>
        <p>Вы сделали ход не в свою очередь.</p>
      </Modal>
      <audio ref={audioRef} src="/clickSound.mp3" preload="auto" />

  </div>
    )
  :
  (

 <div className={utilStyles.boardDiamond}>
  {rowConfig.map((numSquares, rowIndex) => (
    
    <div 
      key={rowIndex} 
      className={utilStyles.row} 
      style={{ marginLeft: `-${29*numSquares/2}px` }} // Смещение для создания ромбовидной структуры
    >
      {Array.from({ length: numSquares }, (_, columnIndex) => {
        const key = `${rowIndex}-${columnIndex}`;
        return (
          <Square
            key={key}
            currentTurn={currentTurn}
            isFirstRow={rowIndex === 0}
            isSides={(rowIndex +1 <= Math.floor(numRows/2)&&columnIndex === 0)|| (rowIndex +1 <= Math.floor(numRows/2)&&columnIndex ==numSquares-1)}
            isLastInRow={columnIndex === numSquares - 1}
            prewSquareBottomEdgeClicked={prewSquareBottomEdgeClicked[`${rowIndex}-${columnIndex}-bottom`]}
            nextSquareLeftEdgeClicked={nextSquareLeftEdgeClicked[`${rowIndex}-${columnIndex}-left`]}
            onClick={(direction) => handleEdgeClick(rowIndex, columnIndex, direction)}
            edgesClickedFromServer={clickedEdges[key] || {}}
          />
        );
      })}
    </div>
  ))}
   <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>Ошибка!</h2>
        <p>Вы сделали ход не в свою очередь.</p>
      </Modal>
      <audio ref={audioRef} src="/clickSound.mp3" preload="auto" />

  </div>
  ))
};
 
export default GameBoard;
