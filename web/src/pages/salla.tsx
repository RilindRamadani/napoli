import TableDisplay from '../components/tables/Table';

import { COLORS } from '../common/colors';
import { Product } from '../common/types/product.model';
import { useEffect, useState } from 'react';
import '../styles/salla.css';


async function fetchData() {

    const backendUrl = `${window.location.protocol}//${window.location.hostname}:3001`;


    try {
        // const response = await fetch('http://localhost:3001/products');
        const response = await fetch(`${backendUrl}/products`);
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

export default function Salla() {
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
        <div className="table-display-container" >
            <TableDisplay locationName="Salla" headerBackgroundColor={COLORS.SallaHeaderBackground} textColor={COLORS.SallaHeaderColor} products={products} />
        </div>
    );
}
