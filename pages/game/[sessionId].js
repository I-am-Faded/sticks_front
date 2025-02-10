import { useEffect,useState, useRef, useContext, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useWebSocket } from '../../webSocket/websocketContext';
import Link from 'next/link';
import WebSocketClient from '../../webSocket/webSocketClient';
import GameBoard from '../../components/game/gameBoard';
import styles from './room.module.css';
import GoogleAds from '../../components/main/googleAds';

const GameSession = () => {


  // useEffect(() => {
  //   document.body.classList.add(styles.body);

  //   // Очистка класса при размонтировании компонента
  //   return () => {
  //     document.body.classList.remove(styles.body);
  //   };
  // }, []);

  const router = useRouter();
  const { sessionId } = router.query;
  // const ws = new WebSocketClient();
  // const wsRef = useRef(null); // Храним WebSocket в ref, чтобы он не пересоздавался
  // const [wsReady, setWsReady] = useState(false); // Добавляем состояние для отслеживания готовности WebSocket
  const wsClient= useWebSocket();

  const [isConnected, setIsConnected] = useState(false); // Для отслеживания статуса соединения
  const [nickName, setNickName] = useState([])
  const [currentTurn, setCurrentTurn] = useState(0);
  const [playerId, setPlayerId] = useState(null);
  const [moves, setMoves] = useState([]);
  const [score, setScore] =useState([]);
  // const [typeBoard, setTypeBoard] = useState('square');
  const [numRows, setNumRowns] = useState(15);
  const [numColumns, setNumColumns] = useState(15);
  const [gameWiner, setGameWiner] = useState(null);
  const [copied, setCopied] = useState(false);
  // const [playerSessionId, setPlayerSessionId] = useState(null);

  const typeBoardRef = useRef();



//  const handleOpen = useCallback(() => {
//       console.log('WebSocket connection established');
//       setIsConnected(true); // Соединение установлено
//     },[]); 
    
  // wsClient.connect((message) => {
  //   // Обработка полученных сообщений
   
  // });

  const handleMessage = useCallback((message) => {
    if (message.type === 'getNickName' || message.type==='new-player-joined') {
      setScore(message.score);
      setNickName(message.nickName);
      console.log('got nicname', message.nickName, 'got score', message.score[1]);
      }
      else if(message.type==='game-end'){
        setGameWiner(message.topPlayers.map(player => player.nickName));
      
      }
    else if(message.type === 'sync-moves') {
      if(message.typeBoard&& !typeBoardRef.current){
      // setTypeBoard(message.typeBoard);

        typeBoardRef.current = message.typeBoard;  // Сохраняем typeBoard в useRef только один раз

      }
      if(message.move){
      message.move.forEach((move) =>{ setMoves((prevMoves) => [...prevMoves, move])});
      }
      setNumColumns(message.numColumns);
      setNumRowns(message.numRows);
      setPlayerId(message.playerId);
      setCurrentTurn(message.currentTurn);
    } else if (message.type === 'player-move') {
      setCurrentTurn(message.currentTurn);
      setScore(message.score);
      setMoves((prevMoves) => [...prevMoves, message.move]); // Добавление нового хода
    }
  }, []);
  const playerSessionId = typeof window !== 'undefined' ? sessionStorage.getItem('playerSessionId') : null;
    
  const handleOpen = () => {
    if (sessionId && playerSessionId) {
      console.log('WebSocket connection established');
      

      // Отправляем синхронизацию, как только соединение установлено и есть sessionId
      wsClient.send({
        type: 'sync-moves',
        roomId: sessionId,
        playerSessionId: playerSessionId,
      });

      // Отправляем запрос на получение никнеймов
      wsClient.send({
        type: 'getNickName',
        roomId: sessionId,
      });
    } else {
      console.log('Session ID or playerSessionId is missing');
    }
  };
  useEffect(()=>{
    // const storedWinners = localStorage.getItem('gameWiner');
    // if (storedWinners) {
    //   setGameWiner(JSON.parse(storedWinners));
    // }
    // let playerSessionId = sessionStorage.getItem('playerSessionId');
   
      // if (!sessionId) {
      //   console.log('sessionId is not available yet');
      //   return; // Ждем, пока sessionId станет доступным
      // }
    // console.log(playerSessionId);
    if (!wsClient || !sessionId) return; // Проверка, что WebSocket и sessionId существуют

    
    
    // if (!playerSessionId) {
    //   console.log('Player session ID not found');
    //   return;
    // }

   
    // const checkPlayerSession = () => {
    //   // Проверяем наличие playerSessionId в sessionStorage
    //   const storedSessionId = typeof window !== 'undefined' ? sessionStorage.getItem('playerSessionId') : null;

    //   if (storedSessionId) {
    //     setPlayerSessionId(storedSessionId);
    //   } else {
    //     console.log('Player session ID не найден в sessionStorage');
    //   }
    // };

    // checkPlayerSession();
    // const intervalId = setInterval(() => {
    //   if (!playerSessionId) {
    //     console.log('Попытка повторного запроса playerSessionId...');
    //     checkPlayerSession();
    //   }
    // }, 5000);  
    if (!isConnected && sessionId && playerSessionId) {
      // Отправка синхронизации, когда соединение готово
      setIsConnected(true);
      wsClient.send({
        type: 'getNickName',
        roomId: sessionId,
      });
      
      wsClient.send({
        type: 'sync-moves',
        roomId: sessionId,
        playerSessionId: playerSessionId,
      });
      console.log('Sync moves sent to server (from useEffect)');
    }
    if (isConnected) {
      wsClient.onOpen(handleOpen); // Устанавливаем обработчик для события открытия соединения
    } 
    // if(sessionId && wsClient ){
    //   console.log('WebSocket connection established');
    //   setIsConnected(true);
    //   wsClient.send({
    //     type: 'getNickName',
    //     roomId : sessionId,
    //   });
    //   console.log('send sync moves to server native')
  
    //   wsClient.send({
    //     type:'sync-moves',
    //     roomId : sessionId,
    //     playerSessionId: playerSessionId ,
    //   })
    // }

    // wsClient.onOpen(handleOpen); // Устанавливаем обработчик для события открытия соединения
    
    wsClient.onMessage(handleMessage);
    

 
   

    const handleRouteChange = (url) => {
      // if (wsClient) {
      //   wsClient.disconnect();
      //   console.log('WebSocket closed on route change');
      // }
      if (url === '/'&& wsClient.isConnected) {  // Только если уходим на главную
        console.log('WebSocket закрывается, так как уходим на главную');
        wsClient.disconnect();
      }
    };
  
    // Подписываемся на изменение маршрута
    router.events.on('routeChangeStart', handleRouteChange);
   
  // }
  return () => {
    console.log("Cleaning up WebSocket...");
    // wsClient.removeMessageHandler(handleMessage); // Очищаем обработчик при выходе со страницы
    wsClient.removeMessageHandler(handleMessage); // Очищаем обработчик
    // wsClient.disconnect();

    router.events.off('routeChangeStart', handleRouteChange);

    // wsClient.disconnect();
  };
}, [wsClient, sessionId,isConnected, handleMessage]);

const showWinner = (gameWiner) =>{
  if(gameWiner){
    if(gameWiner.length ==2){return (<p className={styles.winner}>draw between {gameWiner.join(', ')}</p>)}
    else if(gameWiner.length > 2){return(<p className={styles.winner}>game winners {...gameWiner}</p>)}
   else {return (<p className={styles.winner}>game winner {gameWiner}</p>)}
  }
  
}



  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Сбрасываем состояние через 2 секунды
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

// useEffect(() => {
//   // if (typeof window !== 'undefined') {
//   //   // Ваш код, использующий window
//   //   window.onbeforeunload = function() {
//   //     if (wsClient) {
//   //       console.log('disconnnenenct')
//   //       wsClient.disconnect();
//   //     }
//   //   };
//   // }
 
//   return () => {
//     if (wsClient) {
//     }
//   };
// }, [router.events]);


// useEffect(() => {
//   if (isConnected && sessionId) {
//     // Отправляем сообщение на сервер для получения никнеймов
//     wsClient.send({
//       type: 'get-Nick-Name',
//       roomId: sessionId,
//     });
   
//   }
// }, [isConnected, sessionId]); // Выполняется, когда WebSocket-соединение установлено и есть sessionId

  // setInterval(() => {
  //   console.log(playerId, currentTurn)
  // }, 4000);
  // Возвращаем JSX для вашей страницы
 
  return (
    typeBoardRef.current ?

    <div className={styles.container}>
      <div className={styles.nicknameWrapper}>
        {nickName.map((nick, index) => (
          <div
            key={index}
            className={`${styles.nickname} ${
              currentTurn === index ? styles.activeNickname : ''
            } ${styles[`player${index + 1}`]}`}
          >
            {nickName.find(x=> x[0]==index)[1] ||'noName'} {/* Отображаем "Waiting...", если никнейм не задан */}
            <div
             key={index}
           >{score.find(x=>x[0]==index)[1]}</div>
          </div>
          
        ))}
      </div>
      {/* Содержимое вашей страницы */}

    
        <p>
        Session ID: <b onClick={handleCopy}style={{
            maxWidth: '100%',        // Ограничиваем максимальную ширину
            overflow: 'hidden',      // Скрываем текст, который не помещается
            textOverflow: 'ellipsis', // Добавляем многоточие
            whiteSpace: 'nowrap',    // Запрещаем перенос текста
            cursor: 'pointer',       // Курсор в виде указателя
            color: 'blue',           // Цвет текста
           }}> {sessionId}</b> 
        {copied && <span> Copied to clipboard!</span>} 
        </p>
        <Link className={styles.homeButton} href={'/'}>Home</Link>
        {gameWiner && showWinner(gameWiner)}
        {/* {nickName && <div>nickName:{nickName}</div>} */}

        

        {/* <button onClick={handleSendMessage}>Send Message to Server</button> */}
        <GameBoard 
        ws={wsClient}
        sessionId = {sessionId}
        isConnected = {isConnected}
        roomId={sessionId}
        currentTurn={currentTurn}
        playerId={playerId}
        moves={moves}
        typeBoard={typeBoardRef.current}
        numRows={numRows}
        numColumns={numColumns}
        />
      <GoogleAds />

    </div>

    : <div>Loading</div>
  );
};


export default GameSession;