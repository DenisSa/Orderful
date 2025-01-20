import { createLogger, format, transports } from 'winston';
import { isProductionEnvironment } from '../env';

export const logger = createLogger({
  level: isProductionEnvironment() ? 'info' : 'debug',
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp(),
    format.metadata({
      key: 'meta',
    }),
    format.json(),
  ),
  defaultMeta: {},
  transports: [
    new transports.Console({
      silent: false,
    }),
  ],
  exitOnError: false,
});
