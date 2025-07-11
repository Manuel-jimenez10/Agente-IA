import { Server, Socket } from "socket.io";
import http from "http";

let io: Server | null = null;

export async function initSocketServer(server: http.Server){
  
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    }
  });
  
  io.on("connection", (socket) => {    
    
    socket.on("disconnect", () => {
      
    });
  });

  return io;
  
};


export function getIO(){
  if (!io) {
    throw new Error("Socket.IO no ha sido inicializado");
  }
  return io;
};