import Router from 'koa-router'
import controller from '../controllers/users'
import validator from "../middlewares/validator";
import auth from "../middlewares/auth";

const router = new Router({
    prefix: '/user'
})

router.get('/', controller.getList)
router.post('/', auth.authJwt, controller.add)
router.put('/:id', auth.authJwt, validator.validateId, controller.edit)

export default router