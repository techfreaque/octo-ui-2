import type { DefaultEventsMap } from "@socket.io/component-emitter";
import { useEffect } from "react";
import type { Socket } from "socket.io-client";
import io from "socket.io-client";

export interface WebsocketDataType {
  status?: "status" | "starting" | "collecting" | "computing" | "finished";
}
export type WebsocketOnConnectionUpdateType = (
  data: WebsocketDataType,
  socket: Socket<DefaultEventsMap, DefaultEventsMap>,
) => void;

export const AbstractWebsocketContext = ({
  socketUrl,
  onConnectionUpdate,
  onConnectionLost,
  onKey,
  children,
}: {
  socketUrl: string;
  onConnectionUpdate: WebsocketOnConnectionUpdateType;
  onConnectionLost: () => void;
  onKey: string;
  children: JSX.Element;
}) => {
  useEffect(() => {
    return initWebsocket(
      socketUrl,
      onConnectionUpdate,
      onConnectionLost,
      onKey,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
};

function initWebsocket(
  socketUrl: string,
  onConnectionUpdate: WebsocketOnConnectionUpdateType,
  onConnectionLost: () => void,
  onKey: string,
): () => void {
  const socket = getWebsocket(
    socketUrl.replace("http://", "ws://").replace("https://", "wss://"),
  );
  socket.on(onKey, function (data) {
    onConnectionUpdate?.(data, socket);
  });
  socket.on("disconnect", function () {
    onConnectionLost?.();
  });

  // CLEAN UP THE EFFECT
  return () => socket.disconnect();
}

export function getWebsocket(namespace: string) {
  // Connect to the Socket.IO server.
  // The connection URL has the following format, relative to the current page:
  //     http[s]://<domain>:<port>[/<namespace>]
  return io(namespace, {
    reconnectionDelay: 2000, // Prevent unexpected disconnection on slow loading pages (ex: first config load)
    transports: ["websocket", "polling"], // use WebSocket first, if available
  });
}
