import Koa, {Context, Next} from 'koa'
import {koaBody} from 'koa-body'
import session from "koa-session"
import json from "koa-json"
import Router from "koa-router"
import logger from 'koa-logger'
import cors from 'koa2-cors'
import serve from 'koa-static';
import database from "./utils/database";
import * as dotenv from 'dotenv'
import authRouter from './routes/auth'
import userRouter from './routes/users'
import appointmentsRouter from './routes/appointments'
import {runSeeders} from "typeorm-extension";
import rateLimit from 'koa-ratelimit'

(async () => {
    dotenv.config()
    await database.AutoCreateDatabase().then(() => {
        console.log('Initial database successfully!')
    })

    await database.AppDataSource.initialize().then(async () => {
        console.log("Connect database successfully!")
        const app = new Koa()
        const port = process.env.PORT || 3000

        app.keys = ['my-session-secret']
        const db = new Map();
        app.use(rateLimit({
            driver: 'memory',
            db: db,
            duration: 60000,
            errorMessage: 'Try again later!',
            id: (ctx) => ctx.ip,
            headers: {
                remaining: 'Rate-Limit-Remaining',
                reset: 'Rate-Limit-Reset',
                total: 'Rate-Limit-Total'
            },
            max: 100,
            disableHeader: false,
        }));
        app.use(session(app))
        app.use(serve('./src/docs'))

        app.use(logger())
        app.use(json())
        app.use(cors({origin: 'https://localhost:3001'}))
        app.use(koaBody({
            multipart: true,
            formidable: {
                maxFileSize: 200 * 1024 * 1024,
                uploadDir: __dirname + '/public/uploads'
            }
        }))

        const mainRouter = new Router({prefix: "/api"})
        mainRouter.use(authRouter.routes(), authRouter.allowedMethods())
        mainRouter.use(userRouter.routes(), userRouter.allowedMethods())
        mainRouter.use(appointmentsRouter.routes(), appointmentsRouter.allowedMethods())

        app.use(mainRouter.routes())

        app.use(async (ctx: Context, next: Next) => {
            try {
                await next()
                if (ctx.status === 404) {
                    ctx.status = 404
                    ctx.body = {err: "No such endpoint existed"}
                }
            } catch (err: any) {
                ctx.body = {err: err}
            }
        })

        app.listen(port).on("listening", () => console.log(`Server started on port: ${port}!`))
    }).catch((error) => console.log(error))

    await runSeeders(database.AppDataSource, {
        seeds: ['src/utils/db/seeders/**/*{.ts,.js}']
    })
})()