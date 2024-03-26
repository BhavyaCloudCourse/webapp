const sequelize = require('../config/dbconfig');
const logger = require('../utils/logger');

const apiHealthCheck = async (req, res) => {
    try {
  
          console.log(req.method);
          // Verify that only HTTP GET method is supported
          if (req.method !== 'GET') {
            logger.warn('Incorrect method type used');
            logger.error('Incorrect method type used');
            logger.debug('Use Get method type');
            return res.status(405).set({ 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'X-Content-Type-Options': 'nosniff' }).send();
          }
          console.log(Object.keys(req.body).length,Object.keys(req.query).length);
          // Verify no body and params and in the request
          if((Object.keys(req.body).length>0) || (Object.keys(req.query).length>0)) {
            logger.warn('No request body or params required');
            logger.error('No request body or params required');
            logger.debug('Send request without body and params');
            return res.status(400).set({ 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'X-Content-Type-Options': 'nosniff' }).send();
          }
          // Authenticate with the database
          await sequelize.authenticate();
          // Return HTTP 200 OK if successful
          res.status(200).set({ 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'X-Content-Type-Options': 'nosniff' }).send();
          logger.info('Database succssfully authenticated');
  } 
  catch (error) {
      // Return HTTP 503 Service Unavailable if unsuccessful
      logger.warn('Error in authenticating database');
      logger.error('Error in authenticating database',error);
      logger.debug("Check database instance is running");
      res.status(503).set({ 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'X-Content-Type-Options': 'nosniff' }).send();
  }
  };
  module.exports = {apiHealthCheck};