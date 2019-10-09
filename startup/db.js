
const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');
mongoose.set('useCreateIndex', true);

module.exports = function(){
    const db = config.get('db');
    mongoose.connect(db, { useNewUrlParser: true })
    .then(console.log(`Successfully connected to ${db}...`));
    // .catch(error => console.log('Could not connect to mongodb.', error));
}