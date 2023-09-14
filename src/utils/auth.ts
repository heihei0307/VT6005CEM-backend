import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config()
const secret = process.env.JWT_SECRET_KEY || 'my_secret_key'
const refreshSecret = process.env.JWT_REFRESH_SECRET_KEY || 'my_refresh_secret_key'
const verifyToken = async (token: string) => {
    return jwt.verify(token, secret)
}
const verifyRefreshToken = async (token: string) => {
    return jwt.verify(token, refreshSecret)
}
const genJwt = async (data: string | object) => {
    const payload = typeof data == "object" ? {data} : data
    const token = jwt.sign(payload, secret, {expiresIn: process.env.JWT_EXP || '1h'})
    const refresh = jwt.sign(payload, refreshSecret, {expiresIn: process.env.JWT_REFRESH_EXP || '7d'})
    return {token, refresh}
}

const hashPassword = async (password: string) => {
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(password, salt)
    return {salt: salt, hashedPassword: hashedPassword}
}

const checkPassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword)
}

export default {verifyToken, verifyRefreshToken, genJwt, hashPassword, checkPassword}