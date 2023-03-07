import { useEffect } from 'react';
import io from "socket.io-client"

export const AbstractWebsocketContext = ({
    socketUrl, onConnectionUpdate,
    onConnectionLost, onKey, children
}) => {
    useEffect(() => {
        initWebsocket(socketUrl, onConnectionUpdate, onConnectionLost, onKey)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return children
};

function initWebsocket(socketUrl, onConnectionUpdate, onConnectionLost, onKey) {
    const socket = getWebsocket(socketUrl.replace("http://", "ws://").replace("https://", "wss://"))
    socket.on(onKey, function (data) {
        onConnectionUpdate && onConnectionUpdate(data, socket)
    });
    socket.on('disconnect', function () {
        onConnectionLost && onConnectionLost()

    });
    
    // CLEAN UP THE EFFECT
    return () => socket.disconnect();
}

export function getWebsocket(namespace) {
    // Connect to the Socket.IO server.
    // The connection URL has the following format, relative to the current page:
    //     http[s]://<domain>:<port>[/<namespace>]
    return io(
        namespace,
        {
            reconnectionDelay: 2000, // Prevent unexpected disconnection on slow loading pages (ex: first config load)
            transports: ["websocket", "polling"], // use WebSocket first, if available
        });
}