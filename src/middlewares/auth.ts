import {Context, Next} from "koa";
import authUtil from '../utils/auth'
import * as dotenv from 'dotenv'

dotenv.config()

const authJwt = async (ctx: Context, next: Next) => {
    const authorizationHeader = ctx.header['authorization']
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        const token = authorizationHeader.substring(7)
        try {
            ctx.state.user = await authUtil.verifyToken(token)
            await next()
        } catch (err) {
            ctx.status = 401
            ctx.body = {
                err: 'Token Expired'
            }
            return
        }
    } else {
        ctx.status = 401
        ctx.body = {
            err: 'Invalid token'
        }
        return
    }
}

const authRefreshJwt = async (ctx: Context, next: Next) => {
    const refresh = ctx.request.body.refresh
    try {
        ctx.state.user = await authUtil.verifyRefreshToken(refresh)
        await next()
    } catch (err) {
        ctx.status = 401
        ctx.body = {
            err: 'Invalid refresh token'
        }
        return
    }
}

const refreshJwt = async (ctx: Context, next: Next) => {
    const user = ctx.state.user
    if (user != null)
        await authUtil.genJwt(user)
            .then((data) => {
                ctx.status = 200
                ctx.body = {
                    token: data.token,
                    refresh: data.refresh,
                    user: {
                        id: user.data.id,
                        nickname: user.data.nickname,
                        type: user.data.type,
                    }
                }
            })
    await next()
}

export default {authJwt, authRefreshJwt, refreshJwt}