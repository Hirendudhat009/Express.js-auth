import express from "express"

// middleware
import authentication from "../common/middleware/authentication"

import jokesController from "./jokes.controller";
import asyncWrap from "express-async-wrapper"


const router = express.Router();

router.get('/', authentication, asyncWrap(jokesController.getRandomJokes))


module.exports = router