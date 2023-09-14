import {DataSource} from "typeorm";
import {Seeder} from "typeorm-extension";
import {Users} from "../../../entities/users";

export default class UsersSeeder implements Seeder {
    public async run(
        dataSource: DataSource
    ): Promise<any> {
        const repos = dataSource.getRepository(Users)
        if (await repos.count() === 0) {
            await repos.insert([])
        }
    }
}