import TableDisplay from '../components/tables/Table';

import { COLORS } from '../common/colors';
import { Product } from '../common/types/product.model';
import { useEffect, useState } from 'react';


async function fetchData() {
    try {
        const response = await fetch('http://localhost:3001/products?category=BANAKU');
        const data = await response.json();

        const mappedProducts: Product[] = data.map((product: any) => ({
            id: product.id,
            name: product.name,
            category: product.category,
        }));
        return mappedProducts;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Re-throw the error to be caught by the calling code
    }
}

export default function Banaku() {
    const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
        const fetchDataAndSetProducts = async () => {
            try {
                const fetchedProducts = await fetchData();
                setProducts(fetchedProducts);
            } catch (error) {
                // Handle the error if needed
            }
        };
        fetchDataAndSetProducts();
    }, []);
    return (
        <div >
            <TableDisplay locationName="Banaku" headerBackgroundColor={COLORS.BanakuHeaderBackground} textColor={COLORS.BanakuHeaderColor} products={products} />
        </div>
    );
}
