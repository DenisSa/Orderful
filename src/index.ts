import { app } from './app';
import { cleanup } from './cleanup';
import { config } from './config';
import { logger } from './logger';

const server = app.listen(config.app.port, () => {
  logger.info(`Listening on port ${config.app.port}...`);
});

process.on('SIGINT', () => cleanup(server)); // Ctrl+C
process.on('SIGTERM', () => cleanup(server)); // Termination signal

process.on('unhandledRejection', (error) => {
  console.error('Uncaught Exception:', error);
  cleanup(server);
});
