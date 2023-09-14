import Router from 'koa-router'
import controller from '../controllers/appointments'
import validator from "../middlewares/validator";

const router = new Router({
    prefix: '/appointment'
})

router.get('/check', controller.check)
router.post('/verify', controller.getByHkId)
router.post('/', controller.add)
router.put('/:id', validator.validateId, controller.edit)

export default router