// products.service.ts

import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './products.repository'; // Import the repository
import { Category } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductRepository) { }

  async create(createProductDto: CreateProductDto) {
    return this.productsRepository.create(createProductDto);
  }

  async findAll(category?: Category) {
    if (category) {
      return this.productsRepository.findByCategory(category);
    }
    return this.productsRepository.findAll();
  }

  async findOne(id: number) {
    return this.productsRepository.findOne(id);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return this.productsRepository.update(id, updateProductDto);
  }

  async remove(id: number) {
    return this.productsRepository.remove(id);
  }
}
