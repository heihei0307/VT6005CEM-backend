import {Context} from "koa";
import appointmentsRepository from '../services/appointments'
import {Appointments} from "../entities/appointments";

const check = async (ctx: Context) => {
    ctx.status = 200
    ctx.body = await appointmentsRepository.check()
}

const getByHkId = async (ctx: Context) => {
    ctx.status = 200
    const {HkId} = <Appointments>ctx.request.body
    const result = await appointmentsRepository.getByHkId(HkId)

    ctx.body = result ?? {err: 'Appointment not found'}
    ctx.status = result ? 200 : 204
}
const add = async (ctx: Context) => {
    ctx.status = 200
    const request = <Appointments>ctx.request.body
    ctx.body = await appointmentsRepository.create(request)
}

const edit = async (ctx: Context) => {
    ctx.status = 200
    const request = <Appointments>ctx.request.body
    const result = await appointmentsRepository.update(+ctx.params.id, request)
    ctx.body = result ?? {msg: 'Invalid request!'}
}

export default {check, getByHkId, add, edit}