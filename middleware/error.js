
module.exports = function(err, req, res, next){
    winston.error(err.message, err);

    // logging levels
    //error
    // warn 
    // info
    //verbose
    // debug
    // silly
    res.status(500).send('Something failed!..');
}