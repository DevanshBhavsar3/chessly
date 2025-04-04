import { WebSocketServer } from "ws";
import { SocketManager } from "./utils/socketManager";

const wss = new WebSocketServer({ port: 8080 });
const socketManager = new SocketManager();

wss.on("connection", (ws) => {
  socketManager.join(ws);
});
