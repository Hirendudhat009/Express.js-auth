import express from "express"
import path from "path"
import swaggerUi from 'swagger-ui-express'
import YAML from "yamljs"
import { apiBaseUrl } from "./constants/config-constant"

const swaggerDocument = YAML.load(path.join(__dirname, '../../swagger.yml'))

const router = express.Router();

if (process.env.NODE_ENV !== "production") {
	router.use(
		'/api/documentation',
		(req, res, next) => {
			swaggerDocument.info.title = process.env.APP_NAME
			swaggerDocument.servers = [
				{
					url: apiBaseUrl(),
					description: "Base url for API's",
				},
			]
			req.swaggerDoc = swaggerDocument
			next()
		},
		swaggerUi.serve,
		swaggerUi.setup(swaggerDocument, {
			swaggerOptions: {
				persistAuthorization: true,
			},
		})
	)
}

module.exports = router
