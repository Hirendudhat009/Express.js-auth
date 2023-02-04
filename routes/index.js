import express from "express"
const router = express.Router();


router.use('/api/v1', require('./apis/index'))

module.exports = router
