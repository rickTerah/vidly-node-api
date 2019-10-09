
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name:{type:String, minlength:3, maxlength:20, required:true}
}));

const validateGenre = genre => {
    const schema = Joi.object().keys({
        name:Joi.string().min(3).max(20).required()
    });
    return Joi.validate(genre, schema);
}

module.exports.Genre = Genre;
module.exports.validate = validateGenre;