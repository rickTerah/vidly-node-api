
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const config = require('config');

const {User} = require('../models/users');

const router = express.Router();


router.get('/', async (req, res) => {
    const users = await User.find();
    res.send(users);
})

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    let user = await User.findOne({email:req.body.email});
    if (!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAUTHToken();
    res.send(token);
});

const validate = req => {
    const schema = Joi.object().keys({
        email:Joi.string().min(5).max(255).email().required(),
        password:Joi.string().min(4).max(1024).required()
    });
    return Joi.validate(req, schema);
}

module.exports = router;