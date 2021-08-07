const app = require('./src/app/app');

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
})