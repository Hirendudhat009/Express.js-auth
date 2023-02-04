require('dotenv').config();

import './src/common/config/jwt-passport'
import express from "express";
import cors from "cors"
import swaggerSetup from "./src/common/swagger";
// models
import modelsAllRelations from "./models";
import routes from "./routes/index"
import { PORT } from './src/common/constants/config-constant';


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.use(require('./utils/response/responseHandler'));


const corsOptions = { origin: process.env.ALLOW_ORIGIN, };
app.use(cors(corsOptions));

app.use(swaggerSetup)
app.use(routes)

app.use(require('./src/common/middleware/error'))

modelsAllRelations.sequelize.sync({ alter: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Your application is running on ${PORT}`);
        })
    })
    .catch((err) => console.log(err))