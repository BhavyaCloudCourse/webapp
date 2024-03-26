const winston = require('winston');

// Create a Winston logger instance
const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSSSSSSS[Z]'}),
      winston.format.json()
    ),
    transports: [
      // Add a file transport to write logs to a file
      new winston.transports.File({ 
        filename: '/var/log/webapp.log',
      })
    ],
  });

module.exports=logger;  