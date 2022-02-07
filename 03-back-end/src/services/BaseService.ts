import IModel from '../common/IModel.interface';
import * as mysql2 from 'mysql2/promise';
import IModelAdapterOptions from '../common/IModelAdapterOptions.interface';
import IErrorResponse from '../common/IErrorResponse.interface';

// pogledaj vezbu 3 predavanje 5 za implementaciju u sve funkcije - options: Partial<IModelAdapterOptions>
export default abstract class BaseService<ReturnModel extends IModel> {
    private dbConnection: mysql2.Connection;

    constructor(db: mysql2.Connection){
        this.dbConnection= db;
    }

    protected get db(): mysql2.Connection {
        return this.dbConnection;
    }

    protected abstract adaptModel (data: any, options: Partial<IModelAdapterOptions>): Promise<ReturnModel>;

    protected async getAllFromTable(
        tableName: string,
        ): Promise<ReturnModel[]|IErrorResponse> {
        const lista: ReturnModel[] = [];
        
        const sql: string = `SELECT * FROM ${tableName};`;
        const [ rows, columns ] = await this.db.execute(sql);

        if (Array.isArray(rows)) {
            for (const row of rows) {
                lista.push(
                    await this.adaptModel(
                        row, {
                            loadChildren: true,
                        }
                    )
                )
            }
        }

        return lista;
    }

    protected async getByIdFromTable(
        tableName: string,
        id: number, 
        ): Promise<ReturnModel|null> {
        const sql: string = `SELECT * FROM ${tableName} WHERE ${tableName}_id = ?;`;
        const [ rows, columns ] = await this.db.execute(sql, [ id ]);

        if (!Array.isArray(rows)) {
            return null;
        }

        if (rows.length === 0) {
            return null;
        }

        return await this.adaptModel(rows[0], {})
    }
 
    
    protected async getAllByFieldNameFromTable(
        tableName: string,
        fieldName: string,
        fieldValue: any,
        ): Promise<ReturnModel[]|IErrorResponse> {
        const lista: ReturnModel[] = [];
        
        const sql: string = `SELECT * FROM ${tableName} WHERE ${fieldName} = ?;`;
        const [ rows, columns ] = await this.db.execute(sql, [ fieldValue ]);

        if (Array.isArray(rows)) {
            for (const row of rows) {
                lista.push(
                    await this.adaptModel(
                        row, {
                            loadChildren: true,
                        }
                    )
                )
            }
        }

        return lista;
    }
}