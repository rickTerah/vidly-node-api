
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');
const auth = require('../middleware/auth');

const {User, validate} = require('../models/users');

const router = express.Router();


router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
})

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    let user = await User.findOne({email:req.body.email});
    if (user) return res.status(400).send('User already registered');

    user = new User({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    const token = user.generateAUTHToken();
    res.header('x-auth-token', token).send(_.pick(user, ['username', 'email']));
});

module.exports = router;