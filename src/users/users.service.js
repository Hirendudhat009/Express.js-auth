/**
 * auth.js
 * @description :: service functions used in authentication
 */

import commonService from "../../utils/commonService";
import moment from "moment"
import { BCRYPT, JWT } from "../common/constants/constant";
import { randomStringGenerator, randomNumberGenerator, encrypt } from "../common/helper";
import jwt from "jsonwebtoken";
import AccessToken from "../../models/accessToken";
import User from "../../models/user";
import RefreshToken from "../../models/refreshToken";
import UnauthorizeException from "../common/exceptions/unauthorize.exception";
import UserResource from "../users/resources/user.resource";
import ConflictException from "../common/exceptions/conflict-request.exception";
import BadRequestException from "../common/exceptions/bad-request.exception";
import NotFoundException from "../common/exceptions/not-found.exception";

class usersService {

    /**
     * @description : service to generate JWT token for authentication.
     * @param {obj} user : user who wants to login.
     * @return {string}  : returns access token.
     */
    static async generateAccessToken(user) {
        const jti = randomStringGenerator()
        const data = await encrypt(JSON.stringify({ user, jti }))
        const accessToken = jwt.sign({ data }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })
        const decodedToken = jwt.decode(accessToken)
        // store : access token 
        commonService.createOne(AccessToken, {
            token: jti,
            userId: user.id || user.userId,
            expiresAt: moment.unix(decodedToken.exp).format('YYYY-MM-DD HH:mm:ss')
        })
        return { accessToken, expiresAt: decodedToken.exp }
    };


    /**
     * @description : service to generate refresh token for authentication.
     * @param {string} accessToken : accessToken for refresh token.
     * @return {string}  : returns refresh token.
     */
    static async generateRefreshToken(accessToken) {
        const refreshToken = randomStringGenerator()
        const decodedToken = jwt.decode(accessToken)
        // store : refresh token 
        commonService.createOne(RefreshToken, {
            token: refreshToken,
            accessToken: decodedToken.jti,
            expiresAt: moment.unix(decodedToken.exp).add(21, 'days').format('YYYY-MM-DD HH:mm:ss')
        })
        return refreshToken
    };


    /**
     * @description : Register service
     * @param {Object} data : registered user data
     * @returns nothing
     */
    static async register(data) {
        const { email, password, fullname, address } = data
        const activeUser = await commonService.findOne(User, { email })
        if (activeUser) {
            throw new ConflictException("This email is already exist")
        }
        await commonService.createOne(User, { email, fullname, password, address })

        // const obj = {
        //     to: email,
        //     subject: `Welcome to ${process.env.APP_NAME}`,
        //     data: { verificationOtp }
        // }
        // sendMail(obj, 'OtpVerification')
    }

    /**
     * Login service
     * @param {Object} reqData 
     * @returns 
     */
    static async login(reqData) {
        const { email, password } = reqData
        const userData = await commonService.findOne(User, { email })

        const user = await commonService.findOne(User, { email }, { raw: false, plain: true })
        if (!user) throw new BadRequestException('This email is not registered.')

        const checkPassword = await user.isPasswordMatch(password)
        if (!checkPassword) throw new BadRequestException('Invalid Credential')

        const authentication = await usersService.generateTokenPairs(userData)
        return { ...new UserResource(userData), authentication }
    }




    /**
    *Get user details
    * @param {Object} authUser 
    * @param {Object} data 
    * @param {files} file 
    * @returns 
    */
    static async getUserDetails(authUser, userId) {
        const user = await commonService.findByPk(User, userId)
        if (!user) {
            throw new NotFoundException('Invalid id')
        }
        return user
    }



    /**
     * @description : Generate access token & refresh token
     * @param {user} authUser : logged user data
     * @returns access & refresh token
     */
    static async generateTokenPairs(authUser) {
        const { accessToken, expiresAt } = await this.generateAccessToken(authUser)
        if (accessToken) { var refreshToken = await this.generateRefreshToken(accessToken) }
        return { accessToken, expiresAt, refreshToken }
    }

    /**
     * @description : Generate access token & refresh token threw refresh token
     * @param {string} token : refresh token 
     * @returns nothing
     */
    static async refreshToken(token) {
        const refreshToken = await RefreshToken.findOne({
            where: { token, isRevoked: false },
            include: [{
                model: AccessToken,
                as: 'accessTokens',
                include: [{
                    model: User,
                    as: 'user',
                }]
            }],
            raw: false
        })

        if (!refreshToken) throw new UnauthorizeException("This refresh token is expired, please login");

        // store old access and refresh token is expired
        await commonService.updateByQuery(RefreshToken, { token }, { isRevoked: true })
        const where = { token: refreshToken.accessToken }
        await commonService.updateByQuery(AccessToken, where, { isRevoked: true })
        return this.generateTokenPairs(refreshToken.accessTokens.user.dataValues)
    }
}

export default usersService