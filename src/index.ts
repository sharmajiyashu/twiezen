import 'reflect-metadata';
import { Express } from 'express';
import express from 'express';
import config from './config';
import AppLogger from './api/loaders/logger';
import appLoader from './api/loaders';
import socketLoader from './api/loaders/socket';
import socketDI from './api/loaders/diSocket';

process.on('unhandledRejection', (reason) => {
  AppLogger.error({ name: 'UnhandledRejection', reason });
});

async function startServer() {
  const app: Express = express();
  await appLoader(app);

  return app.listen(config.port, () => {
    AppLogger.info(`👌 Server Listening on Port: ${config.port}
        **********************************
               Pineapple Lifestyle API
        **********************************
        DB Connection URI: ${`___write: ${config.database.postgre.write}    ___read: ${config.database.postgre.read}`}
        **********************************
        `);
  });
}

startServer()
  .then(async httpServer => {
    const socket = socketLoader(httpServer);
    await socketDI(socket);
  })
  .catch(e => {
    AppLogger.error(`Server Failed to Start because${e.stack}`);
  });