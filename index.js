const app = require('./src/app/app');
const config = require('./src/global_config');

const port = config.get('/port') || 1900;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
})