const app = require('./src/app.js')
const port = process.env.PORT|8080;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
