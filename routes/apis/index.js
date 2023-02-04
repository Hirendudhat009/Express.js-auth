import express from "express";


const router = express.Router();

router.use('/users', require('../../src/users/users.routes'))
router.use('/random-joke', require('../../src/jokes/jokes.routes'))

module.exports = router