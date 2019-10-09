
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const customerSchema = new mongoose.Schema({
    name:{type:String, minlength:3, maxlength:255, required:true},
    phone:{type:String, maxlength:10},
    isGold:{type:Boolean, default:false}
});

const Customer = mongoose.model('Customer', customerSchema);

const validateCustomer = (customer) => {
    const schema = Joi.object().keys({
        name:Joi.string().min(2).max(255).required(),
        phone:Joi.string().max(10)
    });
    return Joi.validate(customer, schema);
};

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;