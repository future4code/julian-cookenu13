import Knex from "knex"
import {BaseDatabase} from './BaseDatabase'

export class UseDataBase extends BaseDatabase{
    private static tableName = "User"

    createUser = async (id:string, email:string, password:string,cipherText:string):Promise<void> => {
        await this.getConnection()
        .insert({
            id,
            email,
            password,
            cipherText
        })
        .into(UseDataBase.tableName)

        BaseDatabase.destroyConnection()
    };

        getByEmail = async (email:string):Promise<any> => {
        const result = await this.getConnection()
        .select("*")
        .from(UseDataBase.tableName)
        .where({email})

        BaseDatabase.destroyConnection()

        return result [0]
    }


        getUserById = async (id:string) =>{
            const result = await this.getConnection()
            .select("*")
            .from(UseDataBase.tableName)
            .where({id})

            BaseDatabase.destroyConnection()

            return result [0];
        }
}