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
      if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
        console.log("WebSocket уже подключен, повторное подключение не требуется.");
        return;
    }
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

      };
      
  
      this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        


        console.log('Invoking message callback with message:',this.messageHandlers, message);
        // this.onMessageCallback(message); // Используем сохранённый callback
        this.messageHandlers.forEach(handler => handler(message));}

  
      this.socket.onclose = (event) => {
        console.log(`WebSocket closed:`, event.code, event.reason);
        console.log('WebSocket closed, attempting to reconnect...');
    
        if (event.code === 1006) {
          console.warn("Server closed connection unexpectedly. Retrying in 5 seconds...");
          setTimeout(() => {
              this.connect(this.onMessageCallback);
          }, 5000); // Ждём 5 секунд перед повторным подключением
      }
       
        // console.log('WebSocket closed');
        // this.socket = null;
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
        console.log("Manually disconnecting WebSocket...");
        this.socket.close();
        this.socket = null;
      }
    }
  }
  
  export default WebSocketClient;