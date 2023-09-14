import database from "../utils/database";
import {Appointments} from "../entities/appointments";


const check = async () => {
    return {msg: 'Appointment service alive!!'}
}

const getById = async (id: number) => {
    const dataRepository = database.AppDataSource.getRepository(Appointments)
    return await dataRepository.findOneBy({id: id})
}

const getByHkId = async (HkId: string) => {
    const dataRepository = database.AppDataSource.getRepository(Appointments)
    return await dataRepository.findOneBy({HkId: HkId})
}

const create = async (data: Appointments) => {
    const dataRepository = database.AppDataSource.getRepository(Appointments)
    return await dataRepository.save(data)
}

const update = async (id: number, data: Appointments) => {
    const dataRepository = database.AppDataSource.getRepository(Appointments)
    const findById = await getById(id)
    if (findById != null) {
        const updateData = {...findById, ...data}
        return await dataRepository.save(updateData)
    } else
        return null
}

const remove = async (id: number) => {
    const dataRepository = database.AppDataSource.getRepository(Appointments)
    const findById = await getById(id)
    if (findById != null)
        return await dataRepository.remove(findById)
    else
        return null
}

export default {check, getByHkId, create, update, remove}