import React, { useEffect, useState } from 'react';
import '../styles/produktet.css';
import ProductTable from '../components/tables/product-table';
import { Product } from '../common/types/product.model';

async function fetchData() {
    try {
        const response = await fetch('http://localhost:3001/products');
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

async function addProduct(productData: any) {
    try {
        const response = await fetch('http://localhost:3001/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });

        if (!response.ok) {
            throw new Error('Failed to add product');
        } else {
            console.log("AAAAAAAAAAAAA");
        }

        // Fetch the updated product list after the new product is added
        const updatedProducts = await fetchData();
        return updatedProducts;
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
}

function Produktet() {
    const [products, setProducts] = useState<Product[]>([]);
    const [productName, setProductName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("Product Category");



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

    const handleCategoryChange = (e: any) => {
        setSelectedCategory(e.target.value);
    };

    async function deleteProduct(productId: string) {
        try {
            const response = await fetch(`http://localhost:3001/products/${productId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
            const updatedProducts = await fetchData();
            setProducts(updatedProducts);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }

    const handleAddButtonClick = async () => {
        console.log(productName);
        console.log(selectedCategory);
        if (productName && selectedCategory) {
            try {
                const updatedProducts = await addProduct({
                    name: productName,
                    category: selectedCategory,
                });
                setProducts(updatedProducts);
                setProductName('');
            } catch (error) {
                // Handle the error if needed
            }
        } else {
            console.log("not there yet");
        }
    };


    return (
        <div className='product'>
            <div className="product-menu">
                <div className="product-menu-container">
                    <div className="product-menu__input-group input-group ">
                        <input
                            type="text"
                            className="input-group__control form-control"
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </div>
                    <select className="product-menu__select form-select" aria-label="Default select example" value={selectedCategory} onChange={handleCategoryChange}>
                        <option disabled >Product Category</option>
                        <option value="PIZZA">Pizza</option>
                        <option value="BANAKU">Banaku</option>
                        <option value="KITCHEN">Kitchen</option>
                    </select>
                </div>
                <button
                    type="button"
                    className="product-menu__button btn btn-primary"
                    onClick={handleAddButtonClick}
                >
                    Add
                </button>
            </div>
            <ProductTable products={products} onDeleteProduct={deleteProduct} />
        </div>
    );
}

export default Produktet;
