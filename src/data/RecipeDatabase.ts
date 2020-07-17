import { BaseDatabase } from './BaseDatabase';

export class RecipeDatabase extends BaseDatabase {
    public static tableName = "Recipe";

    create = async (
        id: string, 
        title: string,
        description: string,
        creation_date: string,
        user_id: string    
    ) => {
        await this.getConnection()
        .insert({
            id,
            title,
            description,
            creation_date,
            user_id,
        })
        .into(RecipeDatabase.tableName)

        BaseDatabase.destroyConnection();
    };
}