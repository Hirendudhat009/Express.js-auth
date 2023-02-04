import AccessToken from "../../models/accessToken";
import commonService from "../../utils/commonService";
import BadRequestException from "../common/exceptions/bad-request.exception";
import UserResource from "./resources/user.resource";
import userService from "./users.service";

class usersController {
    /**
     * @description : Register service
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static async register(req, res, next) {
        await userService.register(req.body)
        return res.send({ message: 'Account created successfully' })
    }

    /**
     * @description: User login 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    static async login(req, res, next) {
        const data = await userService.login(req.body)
        return res.send({ message: 'login successfully', data })
    }

    /**
     * Get user profile details
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static async getUserDetails(req, res, next) {
        const userId = req.query.id ? Number(req.query.id) : req.user.id
        const user = await userService.getUserDetails(req.user, userId)
        res.send({ data: new UserResource(user) })
    }



    /**
     * Logout
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static async logOut(req, res, next) {
        const exist = await commonService.findOne(AccessToken, { token: req.user.jti })
        if (!exist) {
            throw new BadRequestException("Your sesson is expired, please login ")
        }
        await commonService.deleteMany(AccessToken, { token: req.user.jti })
        res.send({ message: 'Account logout successfully' })
    }

}
export default usersController