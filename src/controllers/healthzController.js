const sequelize = require('../config/dbconfig');

const apiHealthCheck = async (req, res) => {
    try {
  
          console.log(req.method);
          // Verify that only HTTP GET method is supported
          if (req.method !== 'GET') {
            console.log("1");
            return res.status(405).set({ 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'X-Content-Type-Options': 'nosniff' }).send();
          }
          console.log(Object.keys(req.body).length,Object.keys(req.query).length);
          // Verify no body and params and in the request
          if((Object.keys(req.body).length>0) || (Object.keys(req.query).length>0)) {
            console.log("2");
            return res.status(400).set({ 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'X-Content-Type-Options': 'nosniff' }).send();
          }
          console.log("3");
          // Authenticate with the database
          await sequelize.authenticate();
          console.log("4");
          // Return HTTP 200 OK if successful
          res.status(200).set({ 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'X-Content-Type-Options': 'nosniff' }).send();
  } 
  catch (error) {
      // Return HTTP 503 Service Unavailable if unsuccessful
      console.log("5");
      console.log(error);
      res.status(503).set({ 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'X-Content-Type-Options': 'nosniff' }).send();
  }
  };
  module.exports = {apiHealthCheck};