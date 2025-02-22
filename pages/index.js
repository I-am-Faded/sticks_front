import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import  {useWebSocket}  from '../webSocket/websocketContext';
import WebSocketClient from '../webSocket/webSocketClient';
import Input from '../components/main/input';
import Header from '../components/main/header';
import styles from '../styles/Home.module.css';
import Head from 'next/head';
import GameSettings from '../components/main/createSetting';
import Image from 'next/image';
import { v4 as uuid } from 'uuid';
import GoogleAds from '../components/main/googleAds';
import useTranslation from 'next-translate/useTranslation';


const Index = () => {
  const { t } = useTranslation('common');  // 'common' - это namespace
  

  // useEffect(() => {
  //   document.body.classList.add(styles.body);

  //   // Очистка класса при размонтировании компонента
  //   return () => {
  //     document.body.classList.remove(styles.body);
  //   };
  // }, []);
  const MIN_ROWS_COLUMNS = 4;
  const MAX_ROWS_COLUMNS = 15;
  
  const [nickName, setNickName] = useState('player1');
  const [roomId, setRoomId] = useState('');
  const [playerSessionId, setPlayerSessionId] = useState();
  const [settings, setSettings] = useState({ numRows: 15, numColumns: 15, playersCount: 2, clickedCard: "diamond", });
  const [isClickedSettings,setIsClickedSettings]=useState(true);
  const [warningMessage, setWarningMessage] = useState(false);

  const router = useRouter();
  const wsClient = useWebSocket();
  // const ws = new WebSocketClient();
 
  useEffect(() => {
    
    // const playerSessionId = localStorage.getItem('playerSessionId');

    // if (!playerSessionId) {      
    //   playerSessionId = generateUniqueSessionId();
    //   localStorage.setItem('playerSessionId', playerSessionId);
    // }
    function generateUniqueSessionId() {
      return uuid()
    }

    // Получение идентификатора сессии из localStorage
    function getSessionId() {
      let sessionId = sessionStorage.getItem('playerSessionId');
      if (!sessionId) {
        sessionId = generateUniqueSessionId();
        sessionStorage.setItem('playerSessionId', sessionId);
      }
      return sessionId;
    }

    // Устанавливаем playerSessionId в состояние
    const sessionId = getSessionId();
    setPlayerSessionId(sessionId);
    
    // wsClient.connect();
    const handleMessage = (message) => {
      console.log('Message received on Index page:', message);

      if (message.type === 'room-created') {
        const roomId = message.roomId;
        router.push(`/game/${roomId}`);
      } else if (message.type === 'room-joined') {
        const roomId = message.roomId;
        router.push(`/game/${roomId}`);
      } else if (message.type === 'room-error') {
        const errorMessage = message.message;
        alert(`Room error: ${errorMessage}`);
      }
    };

    if (wsClient) {
      wsClient.onMessage(handleMessage);
    }

    return () => {
      if (wsClient) {
        
        wsClient.removeMessageHandler(handleMessage); // Очищаем обработчик при выходе со страницы
      }
    };
  }, [wsClient]);
     
//   ws.connect((message) => {
//     // Обработка полученных сообщений
//     if (message.type === 'room-created') {
//       const roomId = message.roomId;
//       router.push(`/game/${roomId}`);
//     } else if (message.type === 'room-joined') {
//       const roomId = message.roomId;
//       router.push(`/game/${roomId}`);
//     } else if (message.type === 'room-error') {
//       const errorMessage = message.message;
//       console.error(`Room error: ${errorMessage}`);
//     } else if (message.type === 'new-player-joined') {
//     console.log('New player joined');
    
//    }
//    else if (message.type === 'player-move') {
//     console.log('Player made a move:', message.move);
// }
//   });

  // const requestNickName = {
  //   nickName : nickName
  // }

  // const createRoom =()=>{
  //   fetch('http://localhost:4000/create',{
  //     method: 'POST',
  //     headers: {'Content-type': 'application/json'},
  //     body: JSON.stringify(requestNickName)
  //   }).then(response => {
  //     // Проверка статуса ответа
  //     if (!response.ok) {
  //       throw new Error(`Ошибка HTTP: ${response.status}`);
  //     }
  //     // Преобразование ответа в JSON
  //     return response.json();
  //   }).then(data=>{
  //     router.push(`/game/${data.sessionId}`)
  //   })
  // } 

  // const joinRoom = async () => {
  //   try {
  //     const response = await fetch('http://localhost:4000/api/join-room', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ roomId, nickName }),
  //     });

  //     const result = await response.json();

  //     if (result.success) {
  //       // Успешное присоединение, переход на страницу игры или другие действия
  //       router.push(`/game/${roomId}`)
  //     }
  //   } catch (error) {
  //     console.error('Error joining room:', error);
  //   }
  // };

  // const ws = new WebSocket('ws://localhost:4000');
 
  // ws.onmessage = (event) => {
  //   const message = JSON.parse(event.data);

  //   if (message.type === 'room-created') {
  //     const roomId = message.roomId;
      
  //     // Перенаправление на страницу комнаты с использованием Next.js Router
  //     router.push(`/game/${roomId}`);
  //   } else
  //   if (message.type === 'room-joined') {
  //     // Обработка успешного присоединения к комнате
  //     const roomId = message.roomId;
  //     console.log(`room joined ${roomId}`)
  //     router.push(`/game/${roomId}`)
  //     // Далее можно что-то делать с roomId, например, обновлять состояние игры
  //   } else if (message.type === 'room-error') {
  //     // Обработка ошибки
  //     const errorMessage = message.message;
  //     console.error(`Room error: ${errorMessage}`);
  //   } else if (message.type === 'new-player-joined') {
  //     // Обработка события, когда новый игрок присоединяется
  //     console.log('New player joined');
  //   }
  // };
 const settingsView=[
  styles.createSetting,
  isClickedSettings? styles.closed : '',
 ].join(' ')
  
 const [togle,setTogle] = useState(false);


 const audioRef = React.useRef(null);

  const settingsOpen = () => {
    if (audioRef.current) {
      audioRef.current.play();

    }
    setIsClickedSettings(!isClickedSettings);
    setTogle(true);
    setTimeout(() => {
      setTogle(false);
    }, 1500);

    // const message = {
    //   type: 'create-room',
    //   nickName : settings.nickName,
    //   playersCount: settings.playersCount,
    //   playerSessionId: playerSessionId,
    //   numRows: settings.numRows,
    //   numColumns: settings.numColumns,
    //   typeBoard: settings.clickedCard,
    // };
    // if (wsClient) {  // Проверяем, что wsClient не null
    //   wsClient.send(message);
    // } else {
    //   console.error('WebSocket connection is not established');
    // }
  };

  const createRoom = () => {
    if(settings.numRows >= MIN_ROWS_COLUMNS && settings.numRows <= MAX_ROWS_COLUMNS && settings.numColumns>=MIN_ROWS_COLUMNS && settings.numColumns <=MAX_ROWS_COLUMNS){

    const message = {
        type: 'create-room',
        nickName : nickName,
        playersCount: settings.playersCount,
        playerSessionId: playerSessionId,
        numRows: Number(settings.numRows),
        numColumns: Number(settings.numColumns),
        typeBoard: settings.clickedCard,
      };
      if (wsClient) {  // Проверяем, что wsClient не null
        wsClient.send(message);
      } else {
        console.error('WebSocket connection is not established');
      }
    }
    else{
      setWarningMessage(true)
   
    }
  }
  const joinRoom = () => {
    const message = {
      type: 'join-room',
      roomId: roomId, // Замените на код комнаты, введенный пользователем
      nickName: nickName, // Замените на имя игрока, введенное пользователем
      playerSessionId: playerSessionId,

    };
  
    wsClient.send(message);
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    console.log('Updated settings:', newSettings);
    // Здесь можно отправить настройки на сервер или использовать их в логике игры
  };


  return (
    <div className={styles.body}>
      <div className={styles.container}>
       <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="F4V7ZD5Ytr9N-y0ctKveLvTyKa5-S1snJh565wwoL3Q" />
        {/* Основные мета-теги */}

        <meta name="description" content="online game for 2-4 player. Click on the edges of the squares to collect all four sides of the square to get a point." />
        <meta name="keywords" content="sticks game, online game, multiplayer, game with friends, game for frinds, 2 players, 4 players, flash game, competitive, игры,  крестики-нолики, мультиплеер " />
        <meta name="author" content="Im_Fadead" />

        {/* Open Graph (для соцсетей) */}
        <meta property="og:title" content="Sticks" />
        <meta property="og:description" content="online game for 2-4 player." />
        <meta property="og:image" content="/header.png" />
        <meta property="og:url" content="https://sticks-front.vercel.app/" />
        <meta property="og:type" content="website" />

        {/* Twitter Card (если сайт делится в Twitter) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sticks" />
        <meta name="twitter:description" content="online game for 2-4 player." />
        <meta name="twitter:image" content="/header.png" />

        {/* Указание языка страницы */}
        <meta httpEquiv="Content-Language" content="en, ru" />

        {/* Favicon (иконка сайта) */}
        <link rel="icon" href="/favicon.ico" />
        <title>{t('home page')}</title>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4788836396603422"
     crossorigin="anonymous"></script>
      </Head>
      
      
      <Header />
      <div className={styles.container}>
        <label>
          {t('nickname')}
          <Input
                minWidth={110}
                type="text"
                value={nickName}
                onChange={(e) => {setNickName(e.target.value)}}
              />
        </label>      
      </div>
      <form >

      <div className={styles.nav}>
        <label>
          {t('room code')}
          <Input
            minWidth={110}
            type="text"
            value={roomId}
            onChange={(e) => {setRoomId(e.target.value)}}
          />
        </label>
        <button type="button" onClick={joinRoom}>
          {t('join room')}
        </button> 

        <button type="button" onClick={createRoom}>
          {t('create room')}
        </button>

        <button type="button" className={styles.settingsButton} onClick={settingsOpen}>
          <Image className={[styles.gearIcon, togle? styles.gearIconActive : ''].join(' ')} src="/settings.png" width={24} height={24} alt="Settings"/>
          <audio ref={audioRef} src="/clickSound.mp3" preload="auto" />
          {/* <img src="/settings.png" alt="Settings" className={styles.gearIcon} /> */}
          
        </button>
      </div>

        <div className={settingsView} >
         
          <GameSettings
           onSettingsChange={handleSettingsChange}
           warningMessage={warningMessage} 
           MIN_ROWS_COLUMNS={MIN_ROWS_COLUMNS}
           MAX_ROWS_COLUMNS={MAX_ROWS_COLUMNS}
           setWarningMessage={setWarningMessage}
           t={t}
          />

        

        </div>
        
      </form>

      </div>
      <GoogleAds />
    </div>
    
  );
};


export default Index;