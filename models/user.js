/**
 * user.js
 * @description :: sequelize model of database table user
 */


import sequelizePaginate from "sequelize-paginate"
import sequelize from "../src/common/config/database";
import sequelizeTransforms from "sequelize-transforms";
import bcrypt from "bcryptjs"
import { DataTypes } from "sequelize";
import { BCRYPT } from "../src/common/constants/constant";

let User = sequelize.define('user', {
    fullname: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    hooks: {
        beforeUpdate: [
            async function (user, options) {
                if (user.password) {
                    user.password =
                        await bcrypt.hash(user.password, BCRYPT.SALT_ROUND);
                }
            },
        ],
        beforeCreate: [
            async function (user, options) {
                if (user.password) {
                    user.password =
                        await bcrypt.hash(user.password, BCRYPT.SALT_ROUND);
                }
            },
        ],

    }
})


User.prototype.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

User.prototype.toJSON = function () {
    return {
        userId: this.id,
        fullname: this.fullname,
        email: this.email,
    };
};

sequelizeTransforms(User);
sequelizePaginate.paginate(User);
export default User;