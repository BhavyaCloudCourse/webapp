# webapp

## Prerequisites
To build and deploy this application locally , you'll need the following installed on your machine:
- Node.js : [Download and install Node.js](https://nodejs.org/)
- MySQL: [Download and install MySQL](https://dev.mysql.com/downloads/)

## Build and Deploy Instructions
1. Clone this repository to your local machine<br>
   
   ```sh
   git clone git@github.com:bhavya17prakash/webapp.git
   ```
   Or download the ZIP file and extract it to a directory of your choice.

2. Navigate to the project directory in CLI<br>
   
   ```sh
   cd path\to\your-repository
   ```
3. Install dependencies using npm<br>
   
   ```sh
   npm install
   ```
4. Configuration <br>
Ensure you have a MySQL database set up. You can do this using a tool like MySQL Workbench or directly through the MySQL command line.

5. Create a .env file in the root of your project directory <br>
Inside the .env file, add your_database_host, your_database_username, your_database_password, and your_database_name with your MySQL database connection details.

6. Running the Application Locally <br>
Once your database is set up and the .env file is configured, you can run the application locally by executing:

   ```sh
   node src\app.js
   ```
7. Open Postman and navigate to http://localhost:8080 to access the endpoints.
8. #