import Router from 'koa-router'
import controller from '../controllers/users'
import auth from "../middlewares/auth";

const router = new Router({
    prefix: '/auth'
})

router.get('/check', controller.check)
router.post('/code', controller.getCode)
router.post('/login', controller.login)
router.post('/refresh', auth.authRefreshJwt, auth.refreshJwt)


export default router