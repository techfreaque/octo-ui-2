import { useEffect } from 'react';
import { useSocket, useSocketEvent } from 'socket.io-react-hook';


export const AbstractReactWebsocketContext = ({
  socketUrl, onReconnect,
  onConnectionLost, onNewMessage,
  onConnecting, onKey, children
}) => {
  const { socket, connected, error } = useSocket(socketUrl);
  useEffect(() => {
    if (socket?.active && connected) {
      onReconnect && onReconnect()
    } else if (socket?.active && !connected) {
      onConnectionLost && onConnectionLost(error)
    } else {
      // console.log("Websocket is starting")
      onConnecting && onConnecting()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, onConnectionLost, error, onReconnect]);
  const { lastMessage } = useSocketEvent(socket, onKey)
  useEffect(() => {
    lastMessage && onNewMessage(lastMessage)
  }, [lastMessage, onNewMessage]);
  return children
};
