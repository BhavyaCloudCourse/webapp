const express = require('express');
const healthzRouter = require('./routes/healthz');
require('dotenv').config();



const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());

// Health check route
app.use('/healthz',healthzRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
