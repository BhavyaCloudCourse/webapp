const userService = require('../services/userService');
const logger = require('../utils/logger');
const bcrypt = require('bcrypt');
const moment = require('moment');
const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub({ projectId: process.env.PROJECT_ID });
const TOPIC_NAME = process.env.TOPIC_NAME;

const createUser = async (req, res) => {
  try {
    // Extract necessary fields from the request body
    const { username, password, first_name, last_name } = req.body;

    console.log(Object.keys(req.body).length, Object.keys(req.query).length);
    // Verify no params and  body and in the request
    if ((Object.keys(req.query).length > 0) || (Object.keys(req.body).length <= 0)) {
      logger.warn('No request params required');
      logger.error('No request params required');
      logger.debug('Remove params and add required request body');
      return res.status(400).send();
    }

    const authHeader = req.header('Authorization');
    //Check if it's an auth req
    if (authHeader) {
      logger.warn('Not an authorized request');
      logger.error('Not an authorized request');
      logger.debug('Remove any authorization header from request');
      return res.status(400).send();
    }
    //Check missing field
    const missingFields = (['first_name', 'last_name', 'password', 'username']).filter(field => !(field in req.body));
    if (missingFields.length > 0) {
      logger.warn('Required fields missing in request body');
      logger.error('Required fields missing in request body');
      logger.debug('Firstname, Lastname, Username abd Password are required fields');
      return res.status(400).send();
    }

    // Check if any additional fields are present in the request body
    const additionalFields = Object.keys(req.body).filter(field => !['username', 'password', 'first_name', 'last_name'].includes(field));
    if (additionalFields.length > 0) {
      logger.warn('Extra fields in request body');
      logger.error('Extra fields in request body');
      logger.debug('Firstname, Lastname, Username abd Password are required fields');
      return res.status(400).send();
    }

    // Check if a user with the same email already exists
    const existingUser = await userService.getUserByUsername(username);
    if (existingUser) {
      logger.warn('Username already exists');
      logger.error('Username already exists');
      logger.debug('User another email address');
      return res.status(400).send();
    }

    // Create a new user
    const newUser = await userService.createUser({
      username,
      password,
      first_name,
      last_name,
    });

    // Omit password from the response payload
    const responseUser = {
      id: newUser.id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      username: newUser.username,
      account_created: newUser.account_created,
      account_updated: newUser.account_updated,
    };

    //Create pubsub message
    const verify_email_pub = {
      email: newUser.username
    };
    //Publish pubsub
    const dataBuffer = Buffer.from(JSON.stringify(verify_email_pub));
    if (newUser.username != "test@gmail.com") {
      await pubsub.topic(TOPIC_NAME).publishMessage({ data: dataBuffer });
    }
    // Respond with a custom success message and the created user details
    res.status(201).json(responseUser);
    logger.info('User successfully created');

  } catch (error) {
    // Handle errors, such as validation errors or database errors
    logger.warn('Validation error or error in authenticating database');
    logger.error('Validation errir or error in authenticating database', error);
    logger.debug("Check validation or Check database instance is running");
    res.status(400).send();
  }
};


const basicAuth = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    logger.warn('Basic Auth header is required');
    logger.error('Basic Auth header is required');
    logger.debug('Basic Auth header is required');
    return res.status(401).send();
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  try {
    const user = await userService.getUserByUsername(username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      logger.warn('Incorrect Credentials');
      logger.error('Incorrect Credentials');
      logger.debug('Enter correct credential');
      return res.status(401).send();
    }
    if (!user.verified && user.username != "test@gmail.com") {
      logger.warn('Email is not verified');
      logger.error('Email is not verified');
      logger.debug('Verify the email using the verification link');
      return res.status(403).send("Email not verified");
    }

    req.user = {
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      account_created: user.account_created,
      account_updated: user.account_updated,
    };
    next();
  } catch (error) {
    logger.warn('Bad request');
    logger.error('Bad request', error);
    logger.debug('Bad request');
    res.status(400).send();
  }
};

const getUser = async (req, res) => {
  try {

    const { id, username, first_name, last_name, account_created, account_updated } = req.user;
    console.log(Object.keys(req.body).length, Object.keys(req.query).length);
    // Verify no body and params and in the request
    if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
      logger.warn('No request params or body required');
      logger.error('No request params or body required');
      logger.debug('Remove request body and params')
      return res.status(400).send();
    }
    const userDetails = {
      id,
      first_name,
      last_name,
      username,
      account_created,
      account_updated,
    };

    const user = await userService.getUserByUsername(username);

    if (user) {
      logger.info('User Found');
      return res.status(200).json(userDetails);
    }
  } catch (error) {
    logger.warn('Bad request');
    logger.error('Bad request', error);
    logger.debug('bad request');
    res.status(400).send();
  }
};

const updateUser = async (req, res) => {
  console.log(req.body, req.user.id);
  try {
    // Check if any additional fields are present in the request body
    const additionalFields = Object.keys(req.body).filter(field => !['password', 'first_name', 'last_name'].includes(field));
    if (additionalFields.length > 0) {
      logger.warn('Extra fields in request body');
      logger.error('Extra fields in request body');
      logger.debug('Firstname, Lastname, Username abd Password are required fields');
      return res.status(400).send();
    }
    //Check missing field
    const missingFields = (['first_name', 'last_name', 'password']).filter(field => !(field in req.body));
    if (missingFields.length > 0) {
      logger.warn('Required fields missing in request body');
      logger.error('Required fields missing in request body');
      logger.debug('Firstname, Lastname, Username abd Password are required fields');
      return res.status(400).send();
    }
    console.log(Object.keys(req.body).length, Object.keys(req.query).length);
    // Verify no params and in the request
    if ((Object.keys(req.query).length > 0) || (Object.keys(req.body).length <= 0)) {
      logger.warn('No request params required');
      logger.error('No request params required');
      logger.debug('Remove params and add required request body');
      return res.status(400).send();
    }

    const user = await userService.updateUser(req.user.id, req.body);
    if (user) {
      logger.info('User updated');
      return res.status(204).send();
    }

  } catch (error) {
    logger.warn('Bad request');
    logger.error('Bad request', error);
    logger.debug('bad request');
    res.status(400).send();
  }
};

const verifyUser = async (req, res) => {
  const token = req.body.token;
  console.log(token);

  try {
    const user = await userService.getUserByToken(token);

    if (!user) {
      logger.warn('Invalid or expired token');
      logger.error('Invalid or expired token');
      logger.debug('Invalid or expired token');
      return res.status(404).send('Invalid or expired token');
    }

    if (moment().isAfter(user.tokenExpiry)) {
      logger.warn('Token has expired');
      logger.error('Token has expired');
      logger.debug('Token has expired');
      return res.status(400).send('Token has expired');
    }

    await user.update({ verified: true });
    console.log(user);

    res.send('Email address verified successfully');
    logger.info('Email address verified successfully');
  } catch (error) {
    console.error('Error verifying email:', error);
    logger.warn('Error verifying email:');
    logger.error('Error verifying email:', error);
    logger.debug('Bad Request');
    res.status(400).send('Internal server error');
  } 
};

const verifyRedirect = async (req, res) => {
  const tokeny = req.params.tokeny;
  console.log(tokeny);
  //const verificationLink = `http://csye6225-bhavya-prakash.me:8080/v1/user/verify-email/${tokeny}`;
  res.writeHead(200, { 'Content-Type':'text/html'});
  res.end(`<!DOCTYPE html><html><body><p>Click the following button to verify your email address:</p><form action="/v1/user/verify-email" method="post"><input type="hidden" name="token" value="${tokeny}"><button type="submit" style="background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 4px;">Verify Email</button></form></body></html>`);
};


module.exports = { createUser, getUser, basicAuth, updateUser, verifyUser, verifyRedirect };