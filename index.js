
const express = require('express');
const app = express();

require('./startup/logging')(); // put first just incase of errors {for logging}
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();


const port = process.env.PORT || 2500;
const server = app.listen(port, () => console.log(`Listening to port number ${port}..`));

module.exports = server;