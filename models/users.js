
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    username:{type:String, minlength:4, maxlength:255, required:true},
    email:{type:String, minlength:5, maxlength:255, unique:true, required:true},
    password:{type:String, minlength:4, maxlength:1024, required:true},
    isAdmin:Boolean
});
userSchema.methods.generateAUTHToken = function (){
    const token = jwt.sign({_id:this._id, isAdmin:this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

const validateUser = user => {
    const schema = Joi.object().keys({
        username:Joi.string().min(4).max(255).required(),
        email:Joi.string().min(5).max(255).email().required(),
        password:Joi.string().min(4).max(1024).required()
    });
    return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validate = validateUser;