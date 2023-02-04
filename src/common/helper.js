/**
 * helper.js
 * @description :: exports helper methods for project.
 */
import { createCipheriv, createDecipheriv } from "crypto";



const AES_ENC_KEY = Buffer.from(process.env.AES_ENC_KEY, 'hex') // set random encryption key
const AES_IV = Buffer.from(process.env.AES_IV, 'hex') // set random initialisation vector

export const encrypt = (val) => {
    const cipher = createCipheriv('aes-256-cbc', AES_ENC_KEY, AES_IV)
    let encrypted = cipher.update(val, 'utf8', 'base64')
    encrypted += cipher.final('base64')
    return encrypted
}

export const decrypt = (encrypted) => {
    const decipher = createDecipheriv('aes-256-cbc', AES_ENC_KEY, AES_IV)
    const decrypted = decipher.update(encrypted, 'base64', 'utf8')
    return decrypted + decipher.final('utf8')
}

/**
 * randomString : generate random string for given length
 * @param {number} length : length of random string to be generated (default 75)
 * @return {number} : generated random string
 */
export const randomStringGenerator = (givenLength = 75) => {
    const characters =
        givenLength > 10 ?
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" :
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const length = givenLength;
    let randomStr = "";

    for (let i = 0; i < length; i++) {
        const randomNum = Math.floor(Math.random() * characters.length);
        randomStr += characters[randomNum];
    }
    return randomStr
}
