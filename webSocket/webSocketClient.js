let wsInstance = null;

class WebSocketClient {
    constructor() {
      // if (!wsInstance) {
      this.socket = null;
      this.reconnectInterval = 5000;
      this.onMessageCallback=null;
      this.messageHandlers = []; // Список обработчиков сообщений
      this.openHandlers = [];
      // wsInstance = this;
      // }
      // return wsInstance;
    }
  
    connect( onMessageCallback) {
      // const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      // const socketUrl = `${wsProtocol}//localhost:4000`;
  
      if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
      this.socket = new WebSocket('https://sticks-background.onrender.com');
      this.onMessageCallback = onMessageCallback;
      console.log(this.messageHandlers)

      this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.openHandlers.forEach(handler => handler());
      if (onMessageCallback) {
        this.onMessageCallback = onMessageCallback;
        
      }
        // Пример отправки сообщения о присоединении к комнате
        // this.send({ type: 'join-room', roomId, playerName: this.nickName });
      };
      
  
      this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        // console.log('Received from server:', this.onMessageCallback);

        // Обработка полученного сообщения
     
      //   this.onMessageCallback(message); // Вызываем сохранённый callback

      //   if (this.onMessageCallback) {
      //     console.log('Invoking message callback with message:', message);

      //     this.onMessageCallback(message); // Вызываем сохранённый callback
          
      // }
      // this.onMessageCallback = onMessageCallback;

        console.log('Invoking message callback with message:',this.messageHandlers, message);
        // this.onMessageCallback(message); // Используем сохранённый callback
        this.messageHandlers.forEach(handler => handler(message));}

  
      this.socket.onclose = () => {
        console.log('WebSocket closed');
        this.socket = null;
      };
      }
      
    }
    
    // this.onMessageCallback = onMessageCallback; // Сохраняем callback
  
    send(message) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(message));
      }
    }

    onOpen(handler) {
      this.openHandlers.push(handler);
    }

    removeOpenHandler(handler) {
      this.openHandlers = this.openHandlers.filter(h => h !== handler);
    }
    
    onMessage(callback) {
      this.messageHandlers.push(callback);

      // this.onMessageCallback = callback; // Перезаписываем callback
      // this.onMessageCallback(message);
      
    }
    removeMessageHandler(handler) {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    }
  
    disconnect() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    }
  }
  
  export default WebSocketClient;