const express = require('express');
const healthzRouter = require('./routes/healthzRoutes');
const userRouter = require('./routes/userRoutes');
const sequelize = require('./config/dbconfig');
const user  = require('./models/user');
require('dotenv').config();
const app = express();
// const PORT = process.env.PORT || 8080;
// Define middleware function to set response headers
// const setResponseHeaders = (req, res, next) => {
//   // Set response headers
//   res.set({
//     'access-control-allow-credentials': 'true',
//     'access-control-allow-headers': 'X-Requested-With,Content-Type,Accept,Origin',
//     'access-control-allow-methods': '*',
//     'access-control-allow-origin': '*',
//     'cache-control': 'no-cache',
//     'content-type': 'application/json;charset=utf-8',
//     'etag': 'W/"a9-+UP6xBjsYc82q+jeDmgihwDu6zk"',
//     'expires': '-1',
//     'server': 'nginx',
//   });

//   // Move to the next middleware or route handler
//   next();
// };

// (async () => {
//   try {
//     // Authenticate with the database
//     await sequelize.authenticate();
//     console.log('Database connection has been established successfully.');

//     // Sync the User model with the database
//     await sequelize.sync({ alter: true });
//     // Middleware
//     app.use(express.json());
//     app.use(express.urlencoded({ extended: false }));
//     app.use(setResponseHeaders);
//     // Routes
//     app.use('/healthz',healthzRouter);
//     app.use('/v1/user', userRouter);
    
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// })();

async function startApp() {
  try {
      await sequelize.sync({ alter: true });
      console.log('Database synced successfully');
  } catch (error) {
      console.error('Error syncing database:', error);
  }
}
startApp();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/healthz',healthzRouter);
app.use('/v1/user', userRouter);

module.exports=app;
