import '../styles/global.css';
import { WebSocketProvider } from '../webSocket/websocketContext';
import styles from '../styles/Home.module.css';

export default function App({Component, pageProps}){
    return (
    <WebSocketProvider >
    <Component {...pageProps} />
    </WebSocketProvider>
    )
}