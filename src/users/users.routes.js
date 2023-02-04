import express from "express"

// middleware
import authentication from "../common/middleware/authentication"

// validation file for this routes
import validator from "../common/config/joi-validator";
import userController from "./users.controller";
import asyncWrap from "express-async-wrapper"

// dtos
import registerDto from "./dtos/register.dto"
import loginDto from "./dtos/login.dto"

const router = express.Router();

router.post(
    '/signup',
    validator.body(registerDto),
    asyncWrap(userController.register)
)

router.get('/me', authentication, asyncWrap(userController.getUserDetails))

router.post(
    '/login',
    validator.body(loginDto),
    asyncWrap(userController.login)
)

router.post('/logout', authentication, asyncWrap(userController.logOut))



module.exports = router