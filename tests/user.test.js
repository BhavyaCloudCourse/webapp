const request = require('supertest');
const app = require('../src/app');

describe('Health Check API', () => {
    it('GET /healthz', async () => {
      const response = await request(app).get('/healthz');
      expect(response.status).toBe(200);
    });
  });

  // Function to encode credentials to Base64
const encodeCredentials = (username, password) => {
    return Buffer.from(`${username}:${password}`).toString('base64');
  };

  describe('User API endpoints', () => {
    // Define your username and password
    const username = 'b@gmail.com';
    const password = 'bhavya1234@G';
  
    // Encode credentials
    const base64Credentials = encodeCredentials(username, password);
  
    // Test 1: Create an account and validate it exists
    it('Create an account, and using the GET call, validate account exists', async () => {
      // Create a new user account
      const createRes = await request(app)
        .post('/v1/user')
        .send({ 
          first_name: 'John', 
          last_name: 'Doe', 
          username: username, 
          password: password 
        });
  
      // Expect successful creation
      expect(createRes.statusCode).toEqual(201);
  
      // Validate the existence of the created user by fetching it
      const getRes = await request(app)
        .get('/v1/user/self')
        .set('Authorization', `Basic ${base64Credentials}`); // Add Base64 encoded credentials
  
      expect(getRes.statusCode).toEqual(200);
      expect(getRes.body.first_name).toEqual('John');
      expect(getRes.body.last_name).toEqual('Doe');
      expect(getRes.body.username).toEqual(username);
    
    });
  
    // Test 2: Update the account and validate it was updated
    it(' Update the account and using the GET call, validate the account was updated.', async () => {
      // Update the user account
      const updateRes = await request(app)
        .put('/v1/user/self')
        .set('Authorization', `Basic ${base64Credentials}`) // Add Base64 encoded credentials
        .send({ 
          first_name: 'Updated', 
          last_name: 'Updated', 
          password: password 
        });
  
      // Expect successful update
      expect(updateRes.statusCode).toEqual(204);
  
      // Validate the updated user by fetching it again
      const getUpdatedRes = await request(app)
        .get('/v1/user/self')
        .set('Authorization', `Basic ${base64Credentials}`); // Add Base64 encoded credentials
  
      expect(getUpdatedRes.statusCode).toEqual(200);
      expect(getUpdatedRes.body.first_name).toEqual('Updated');
      expect(getUpdatedRes.body.last_name).toEqual('Updated');
     
    });
  });  
 
  