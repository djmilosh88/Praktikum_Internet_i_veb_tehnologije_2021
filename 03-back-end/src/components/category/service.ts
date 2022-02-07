import CategoryModel from './model';
import * as mysql2 from 'mysql2/promise';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import { IAddCategory } from './dto/AddCategory';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { resolve } from 'path';
 

class CategoryService {
    private db: mysql2.Connection;

    constructor(db: mysql2.Connection){
        this.db = db;
    }

    protected async adaptModel(
        row: any,
        options: Partial<IModelAdapterOptions> = { loadParent: false, loadChildren: false }
        ): Promise<CategoryModel> {
        
        
        const item: CategoryModel = new CategoryModel();

        item.categoryId = +(row?.category_id);
        item.name = row?.name;
        item.imagePath = row?.image_path;
        
        if (options.loadParent && item.parentCategoryId !== null) {
            item.parentCategory = await this.getById(item.parentCategoryId);
        }

        if (options.loadChildren) {
            item.subcategories = [];
            // item.subcategories = await this.getAllByParentCategoryId(item.categoryId);
        }


        return item;
    }

    public async getAll(): Promise<CategoryModel[]> {
        const lista: CategoryModel[] = [];
        
        const sql: string = "SELECT * FROM category;"
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


    // U BAZI NEMA parent__category_id KOLONA ZA SADA - vezba 3, predavanje 2 i 3 za error handlovanje
    // public async getAllByParentCategoryId(parentCategoryId: number): Promise<CategoryModel[]|IErrorResponse> {
    //     return new Promise<CategoryModel[]|IErrorResponse>((resolve) => {
    //         const lista: CategoryModel[] = [];
        
    //     const sql: string = "SELECT * FROM category WHERE parent__category_id = ?;";
    //     const [ rows, columns ] = await this.db.execute(sql, [ parentCategoryId ]);

    //     if (Array.isArray(rows)) {
    //         for (const row of rows) {
    //             lista.push(
    //                 await this.adaptModel(
    //                     row, {
    //                         loadChildren: true,
    //                     }
    //                 )
    //             )
    //         }
    //     }        

    //     return lista;
    // }

    public async getById(categoryId: number): Promise<CategoryModel|null> {
        const sql: string = "SELECT * FROM category WHERE category_id = ?;";
        const [ rows, columns ] = await this.db.execute(sql, [ categoryId ]);

        if (!Array.isArray(rows)) {
            return null;
        }

        if (rows.length === 0) {
            return null;
        }

        return await this.adaptModel(
            rows[0],
            {
                loadChildren: true,
                loadParent: true,
            }
        )
    }

    public async add(data: IAddCategory): Promise<CategoryModel|IErrorResponse> {

        return new Promise<CategoryModel|IErrorResponse> (async resolve => {
            const sql = `
                INSERT
                    category
                SET
                    name = ?,
                    image_path = ?;
                `;
            this.db.execute(sql, [ data.name, data.imagePath ])
                .then(async result => {
                    // const [ insertInfo ] = result;
                    const insertInfo: any = result[0];

                    const newCategoryId: number = +(insertInfo?.insertId);
                    resolve (await this.getById(newCategoryId));
                })

                // radice posle implementacije error handlovanja
                // .catch(error => {
                //     resolve({
                //         errorCode: error?.errno,
                //         errorMessage: error?.sqlMessage
                //     });
                // });
        });
    }
}

export default CategoryService;