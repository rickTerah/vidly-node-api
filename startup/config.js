const config = require('config');

module.exports = function(){
    
if (!config.get('jwtPrivateKey')){
    // I set it to something
    throw new Error('FATAL_ERROR: jwtPrivateKey is not defined.');
}

}