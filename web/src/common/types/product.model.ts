
export enum Category {
    KITCHEN = 'KITCHEN',
    BANAKU = 'BANAKU',
    PIZZA = 'PIZZA',
}

export interface Product {
    id: string;
    name: string;
    category: Category;
}
