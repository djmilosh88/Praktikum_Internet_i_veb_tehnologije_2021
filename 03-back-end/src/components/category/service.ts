import CategoryModel from './model';
import * as mysql2 from 'mysql2/promise';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import { IAddCategory } from './dto/AddCategory';
import IErrorResponse from '../../common/IErrorResponse.interface';
import BaseService from '../../services/BaseService';
 
class CategoryService extends BaseService<CategoryModel> {
    
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

    public async getAll(): Promise<CategoryModel[]|IErrorResponse> {
        // return await this.getAllByFieldNameFromTable(`category`, `parent__category_id`, null);
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

    // *******************
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
    // *********************
    
    // *******************
    // posle pravljenja BaseService, gornja funkcija se svodi na ovo:
    // public async getAllByParentCategoryId(parentCategoryId: number): Promise<CategoryModel[]|IErrorResponse> {
    //     return await this.getAllByFieldNameFromTable(`category`, `parent__category_id`, parentCategoryId)
    // *******************
  


    public async getById(categoryId: number): Promise<CategoryModel|null> {
        return await this.getByIdFromTable("category", categoryId);
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