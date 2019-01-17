import dotenv from 'dotenv';
import { Server } from './app';
import { logger } from './services';

dotenv.config();

const port = process.env.SERVER_PORT;
export const app = Server.bootstrap().app;
export const server = app.listen(port);
logger.info(`[App] Server listening on port:${port}.`);
