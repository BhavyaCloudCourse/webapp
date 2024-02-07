const express = require('express');
const healthzRouter = require('./routes/healthzRoutes');
const userRouter = require('./routes/userRoutes');
const sequelize = require('./config/dbconfig');
const user  = require('./models/user');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 8080;

(async () => {
  try {
    // Authenticate with the database
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync the User model with the database
    await sequelize.sync({ alter: true });
    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    // Routes
    app.use('/healthz',healthzRouter);
    app.use('/v1/user', userRouter);
    

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
