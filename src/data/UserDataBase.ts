import { BaseDatabase } from './BaseDatabase'

export class UserDataBase extends BaseDatabase {
    private static tableName = "User"

    createUser = async (id: string, email: string, name: string, password: string): Promise<void> => {
        await this.getConnection()
            .insert({
                id,
                email,
                name,
                password
            })
            .into(UserDataBase.tableName)

        BaseDatabase.destroyConnection()
    };

    getByEmail = async (email: string): Promise<any> => {
        const result = await this.getConnection()
            .select("*")
            .from(UserDataBase.tableName)
            .where({ email })

        BaseDatabase.destroyConnection()

        return result[0]
    }


    getUserById = async (id: string) => {
        const result = await this.getConnection()
            .select("*")
            .from(UserDataBase.tableName)
            .where({ id })

        BaseDatabase.destroyConnection()

        return result[0];
    }
}