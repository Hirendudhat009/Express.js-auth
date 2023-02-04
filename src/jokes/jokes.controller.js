import request from "request-promise";

class jokesController {

    /**
     * Get random jokes
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static async getRandomJokes(req, res, next) {
        const apiData = await request.get(process.env.JOKES_API)
        res.send({ data: { jokes: JSON.parse(apiData).value } })
    }

}
export default jokesController