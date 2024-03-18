const express = require('express');
const healthzRouter = require('./routes/healthzRoutes');
const userRouter = require('./routes/userRoutes');
const sequelize = require('./config/dbconfig');
const user  = require('./models/user');
require('dotenv').config();
const winston = require('winston');
const app = express();
async function startApp() {
  try {
      await sequelize.sync({ alter: true });
      logger.info('Database synced successfully');
      console.log('Database synced successfully');
  } catch (error) {
      logger.error('Error syncing database:', error);
      console.error('Error syncing database:', error);
  }
}

// Create a Winston logger instance
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(), // Include timestamp in log message
    winston.format.json() // Use JSON format for logs
  ),
  transports: [
    // Add a file transport to write logs to a file
    new winston.transports.File({ 
      filename: '/var/log/webapp.log', // Adjust file path as needed
    })
  ],
});
startApp();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/healthz',healthzRouter);
app.use('/v1/user', userRouter);

module.exports=app;
