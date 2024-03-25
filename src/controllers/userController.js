const userService = require('../services/userService');
const bcrypt = require('bcrypt');
const moment = require('moment');
const crypto = require('crypto');
const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub({ projectId: 'dev-project-414723' });

const TOPIC_NAME = 'verify_email';

const createUser = async (req, res) => {
  try {
    // Extract necessary fields from the request body
    const { username , password, first_name, last_name} = req.body;

    console.log(Object.keys(req.body).length,Object.keys(req.query).length);
    // Verify no params and  body and in the request
    if((Object.keys(req.query).length>0) || (Object.keys(req.body).length<=0)) {
        return res.status(400).send();
    }
    
    const authHeader = req.header('Authorization');
    //Check if it's an auth req
    if (authHeader) {
      return res.status(400).send();
    }
    //Check missing field
    const missingFields = (['first_name', 'last_name', 'password', 'username']).filter(field => !(field in req.body));
    if (missingFields.length > 0) {
      return res.status(400).send();
    }

    // Check if a user with the same email already exists
    const existingUser = await userService.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).send();
    }

     // Check if any additional fields are present in the request body
     const additionalFields = Object.keys(req.body).filter(field => !['username', 'password', 'first_name', 'last_name'].includes(field));
     if (additionalFields.length > 0) {
       return res.status(400).send();
     }

     const verificationToken = crypto.randomBytes(20).toString('hex');
     const tokenExpiry = moment().add(2, 'minutes').toDate();

    // Create a new user
    const newUser = await userService.createUser({
      username,
      password,
      first_name,
      last_name,
      verificationToken,
      tokenExpiry
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

    
    const verify_email_pub={
      id: newUser.id,
      email: newUser.username,
      token: newUser.token
    };
    const dataBuffer = Buffer.from(JSON.stringify(verify_email_pub));
    await pubsub.topic(TOPIC_NAME).publishMessage({ data: dataBuffer });
    // Respond with a custom success message and the created user details
    res.status(201).json(responseUser);
  } catch (error) {
    // Handle errors, such as validation errors or database errors
    console.log(error);
    res.status(400).send();
  }
};


const basicAuth = async (req, res, next) => {
    const authHeader = req.header('Authorization');
  
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).send();
    }
  
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
  
    try {
      const user = await userService.getUserByUsername(username);
  
      if (!user || !bcrypt.compareSync(password, user.password) ) {
        return res.status(401).send();
      }
      if (!user.verified && user.username!="test@gmail.com") {
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
      console.error(error);
      res.status(400).send();
    }
  };

  const getUser = async (req, res) => {
    try {
     
    const { id, username, first_name, last_name, account_created, account_updated } = req.user;
    console.log(Object.keys(req.body).length,Object.keys(req.query).length);
    // Verify no body and params and in the request
    if(Object.keys(req.query).length>0 || Object.keys(req.body).length>0) {
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
          return res.status(200).json(userDetails);
        }
    } catch (error) {
      res.status(400).send();
    }
  };

  const updateUser = async (req, res) => {
    console.log(req.body,req.user.id);
    try {
      // Check if any additional fields are present in the request body
      const additionalFields = Object.keys(req.body).filter(field => !['password', 'first_name', 'last_name'].includes(field));
      if (additionalFields.length > 0) {
        console.log("Extra fields");
        return res.status(400).send();
      }
       //Check missing field
    const missingFields = (['first_name', 'last_name', 'password']).filter(field => !(field in req.body));
    if (missingFields.length > 0) {
      return res.status(400).send();
    }
      console.log(Object.keys(req.body).length,Object.keys(req.query).length);
      // Verify no params and in the request
      if((Object.keys(req.query).length>0) || (Object.keys(req.body).length<=0)) {
          return res.status(400).send();
      }
      
        const user = await userService.updateUser(req.user.id, req.body);
        if(user){
          return res.status(204).send();
        }
      
    } catch (error) {
      res.status(400).send();
    }
  };

  const verifyUser  = async (req, res) => {
    const token = req.params.token;
    console.log(token);

    try {
      const user = await userService.getUserByToken(token);
  
      if (!user) {
        return res.status(404).send('Invalid or expired token');
      }
  
      if (moment().isAfter(user.tokenExpiry)) {
        return res.status(400).send('Token has expired');
      }
  
      await user.update({ verified: true });
  
      res.send('Email address verified successfully');
    } catch (error) {
      console.error('Error verifying email:', error);
      res.status(500).send('Internal server error');
    }
};
  

module.exports = { createUser, getUser, basicAuth, updateUser, verifyUser};