import React, { createContext, useContext, useRef, useEffect, useState } from 'react';
import WebSocketClient from './webSocketClient';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const wsClientRef = useRef(null);

  if (!wsClientRef.current) {
    wsClientRef.current = new WebSocketClient();
  }
  useEffect(() => {

  
    // wsClientRef.onOpen(handleOpen);  // Установить обработчик открытия
    // wsClientRef.onClose(handleClose); // Установить обработчик закрытия
  
    wsClientRef.current.connect(
    // (message) => {
    //   console.log('Received message:', message);
    //   // Тут можно добавить обработку глобальных сообщений, если нужно
    // }
    );

  // Функция для обновления сообщений
 
    return () => {
      // Отключаем WebSocket при размонтировании провайдера (например, при закрытии страницы)
      wsClientRef.current.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={wsClientRef.current  }>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {return useContext(WebSocketContext)};
