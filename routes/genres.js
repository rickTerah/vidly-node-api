
const mongoose = require('mongoose');
const express = require('express');

const {Genre, validate} = require('../models/genres');
const router = express.Router();

//middlewares
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
// const asyncMiddleware = require('../middleware/async');

router.get('/', async(req, res, next) => {
    const genres = await Genre.find();
    res.send(genres);

});
router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send('Invalid genreId.');

    res.send(genre);
})

router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({
        name:req.body.name
    });
    await genre.save();
    res.send(genre);
});
router.put('/:id', auth, async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let genre = Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}
        ,{new:true});
    if (!genre) return res.status(404).send('This genre is not found');
    res.send(genre);
});

router.delete('/:id', auth, async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send('Genre with the given ID does not exist');
    res.send(genre);
});

module.exports = router;