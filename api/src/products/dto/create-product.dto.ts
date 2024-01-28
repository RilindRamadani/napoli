import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Category } from './../../common/enums';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEnum(Category)
    category: Category;
}