import React, { createContext, useContext, useRef, useEffect, useState } from 'react';
import WebSocketClient from './webSocketClient';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  // const wsClientRef = useRef(null);
  const [wsClient, setWsClient] = useState(null);
  // if (!wsClientRef.current) {
  //   wsClientRef.current = new WebSocketClient();
  // }
  useEffect(() => {
    
      if (!wsClient) {
        const client = new WebSocketClient();
        client.connect();
        setWsClient(client);
      }
  
    // wsClientRef.onOpen(handleOpen);  // Установить обработчик открытия
    // wsClientRef.onClose(handleClose); // Установить обработчик закрытия
  
    // wsClientRef.current.connect(
    // // (message) => {
    // //   console.log('Received message:', message);
    // //   // Тут можно добавить обработку глобальных сообщений, если нужно
    // // }
    // );

  // Функция для обновления сообщений
 
    return () => {
      // Отключаем WebSocket при размонтировании провайдера (например, при закрытии страницы)
      // wsClientRef.current.disconnect();
      wsClient?.disconnect();
    };
  }, [wsClient]);

  return (
    <WebSocketContext.Provider value={wsClient  }>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {return useContext(WebSocketContext)};