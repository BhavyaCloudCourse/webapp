const express = require('express');
const healthzRouter = require('./routes/healthzRoutes');
const userRouter = require('./routes/userRoutes');
const sequelize = require('./config/dbconfig');
const logger = require('./utils/logger');
const user  = require('./models/user');
require('dotenv').config();
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

startApp();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/healthz',healthzRouter);
app.use('/v2/user', userRouter);

module.exports=app;
