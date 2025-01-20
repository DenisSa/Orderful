import * as console from 'node:console';
import type * as http from 'node:http';
import * as process from 'node:process';

export const cleanup = (server: http.Server): void => {
  console.log(`Cleaning up before exit...`);
  server.close(() => {
    console.log('HTTP server closed');
  });

  process.exit(0);
};
