import {Context} from "koa";
import usersRepository from '../services/users'
import {EditUserRequest, Users} from "../entities/users";
import authUtil from "../utils/auth";
import helper from "../utils/helper";

const check = async (ctx: Context) => {
    ctx.status = 200
    ctx.body = await usersRepository.check()
}

const getList = async (ctx: Context) => {
    ctx.status = 200
    ctx.body = await usersRepository.getAll() ?? {err: 'No user find!'}
}

const getCode = async (ctx:Context) => {
    ctx.status = 200
    const {username} = <Users>ctx.request.body
    const user = await usersRepository.getByUsername(username)
    if (user == null) {
        ctx.status = 401
        ctx.body = {err: 'Invalid username!'}
        return
    }
    await helper.generateRandom(8).then(data => {
        user.code = data
        user.code_verify_date = new Date()
    })
    const result = await usersRepository.update(user.id, user)
    ctx.body = result ? {code: result.code} : {err: 'Fail to get code!'}
}

const login = async (ctx: Context) => {
    ctx.status = 200
    const {username, password, code} = <Users>ctx.request.body
    const user = await usersRepository.getByUsername(username)
    const decryptPassword = helper.decryptWithAES(password)
    if (user == null || !await authUtil.checkPassword(decryptPassword, user.password)) {
        ctx.status = 401
        ctx.body = {err: 'Invalid username or password'}
        return
    }

    if(!code || !user.code_verify_date || (code != user.code && user.code_verify_date && user.code_verify_date < new Date)){
        ctx.status = 401
        ctx.body = {err: 'Invalid code'}
        return
    }

    await usersRepository.resetCode(user.id)

    await authUtil.genJwt(user)
        .then((data) => {
            ctx.body = {
                token: data.token,
                refresh: data.refresh,
                user: {
                    id: user.id,
                    nickname: user.nickname,
                    type: user.type
                }
            }
        })
}

const add = async (ctx: Context) => {
    ctx.status = 200
    const request = <Users>ctx.request.body
    const currentUser = <Users>ctx.state.user.data
    if (currentUser.type != 'admin') {
        ctx.body = {message: 'User is not an admin!'}
        return
    }
    const check = !!(await usersRepository.checkUserExist({
        username: request.username,
        email: request.email
    }))
    if (check) {
        ctx.status = 409
        ctx.body = {
            err: "User already exist!"
        }
        return
    }
    request.password = helper.decryptWithAES(request.password)
    await authUtil.hashPassword(request.password)
        .then((data) => {
            request.password = data.hashedPassword
            request.password_salt = data.salt
        }).catch((err) => {
            ctx.status = 400
            ctx.body = {err: err}
            return
        })
    ctx.body = await usersRepository.create(request)
}

const edit = async (ctx: Context) => {
    ctx.status = 200
    const request = <EditUserRequest>ctx.request.body
    const currentUser = <Users>ctx.state.user.data
    if (currentUser.type != 'admin') {
        ctx.body = {message: 'User is not an admin!'}
        return
    }
    ctx.body = await usersRepository.update(+ctx.params.id, request)
}

export default {check, getList, getCode, login, add, edit}