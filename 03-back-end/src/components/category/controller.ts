import CategoryService from './service';
import {Request, Response, NextFunction} from "express";
import CategoryModel from './model';
import { IAddCategory, IAddCategoryValidator } from './dto/AddCategory';
import CategoryRouter from './router';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { resourceUsage } from 'process';

class CategoryController {
    private categoryService: CategoryService;

    constructor(categoryService: CategoryService) {
        this.categoryService = categoryService;
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const categories = await this.categoryService.getAll();

        res.send(categories);
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        const id: string = req.params.id;

        const categoryId: number = +id;

        if (categoryId <= 0) {
            res.sendStatus(400);
        }
        
        const category: CategoryModel|null = await this.categoryService.getById(categoryId);

        if (category === null) {
            res.sendStatus(404);
            return;
        }

        res.send(category);
    }

    async add(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        if (!IAddCategoryValidator(data)) {
            res.status(400).send(IAddCategoryValidator.errors);
            return;
        }

        const result = await this.categoryService.add(data as IAddCategory);

        res.send(result);
    }
}

export default CategoryController;