import * as db from '@models/db'
import http from "http";
import * as config from '@config/config'

export async function initServer(server: http.Server) {
  try {
    
    await db.connect();
   
    server.listen( config.SERVER_PORT, config.SERVER_IP, () => {
      console.log(`Server is running at ${config.SERVER_IP}:${config.SERVER_PORT}`);
    });

  } catch (e) {
    console.error('Failed to connect to the database:', e);
    process.exit(1);
  }
}

async function gracefulShutdown() {
  console.log('Shutting down gracefully...');
  await db.close();
  console.log('Database connection closed.');
  process.exit(0);
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);