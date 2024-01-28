import { Category, PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';

const prisma = new PrismaClient();

@Injectable()
export class ProductRepository {
    async create(data: any) {
        return prisma.product.create({ data });
    }

    async findAll() {
        return prisma.product.findMany();
    }

    async findOne(id: number) {
        return prisma.product.findUnique({
            where: { id },
        });
    }

    async update(id: number, data: any) {
        return prisma.product.update({
            where: { id },
            data,
        });
    }

    async remove(id: number) {
        return prisma.product.delete({
            where: { id },
        });
    }

    async findByCategory(category: Category) {
        return prisma.product.findMany({
            where: {
                category: {
                    equals: category,
                },
            },
        });
    }
}
