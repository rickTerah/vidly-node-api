
const mongoose = require('mongoose');
const express = require('express');
const {Customer, validate} = require('../models/customers');

const router = express.Router();

//middleware
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    const customers = await Customer.find();
    res.send(customers);
});

router.post('/', auth, async (req, res) =>{
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone
    });
    await customer.save();
});

module.exports = router;