// logger.js
import { format, createLogger, transports } from 'winston';

// Determine log level based on the environment
const determineLogLevel = () => {
  const env = process.env.ENVIRONMENT ?? 'development';
  if (env === 'production' || env === 'staging') {
    return 'info'; // Exclude 'debug' messages in production and staging
  }
  return process.env.LOG_LEVEL ?? 'debug'; // Default to 'debug' or use the LOG_LEVEL env variable
};

const logger = createLogger({
  level: determineLogLevel(),
  format: format.combine(
    format.timestamp(), // Add timestamp to each log
    format.errors({ stack: true }), // Ensure stack trace is captured in case of errors
    format.json() // Log in JSON format for easier parsing
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(), // Colorize log output for readability in development
        format.printf(({ level, message, stack }) => {
          return `${level}: ${stack || message}`;
        })
      )
    })
  ]
});

export { logger };
