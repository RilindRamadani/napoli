import React, { useState, useEffect, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { COLORS } from '../../common/colors';
import "../../styles/product-table.css";
import { Product } from '../../common/types/product.model';

interface ProductTableProps {
    products: Product[];
    onDeleteProduct: (productId: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onDeleteProduct }) => {
    const cellWidth = '150px';
    const numRows = 20;
    const [groupedProducts, setGroupedProducts] = useState<any>({});
    const categories = useMemo(() => ["PIZZA", "BANAKU", "KITCHEN"], []);

    const [hoveredCell, setHoveredCell] = useState<{ row: number; category: string; } | null>(null);

    const handleMouseEnter = (rowIndex: number, category: string) => {
        setHoveredCell({ row: rowIndex, category });
    };

    const handleMouseLeave = () => {
        setHoveredCell(null);
    };

    useEffect(() => {
        const initialGroupedProducts: any = {};
        categories.forEach((category) => {
            initialGroupedProducts[category] = Array.from({ length: numRows }, (_, rowIndex) => ({
                id: `${category}-${rowIndex}`, // Use a unique identifier
                name: '',
                category,
                rowIndex,
            }));
        });
        setGroupedProducts(initialGroupedProducts);
    }, [categories, numRows]);

    useEffect(() => {
        setGroupedProducts((prevGroupedProducts: any) => {
            const updatedGroupedProducts = { ...prevGroupedProducts };

            // Reset all categories
            categories.forEach((category) => {
                updatedGroupedProducts[category] = Array.from({ length: numRows }, () => ({}));
            });

            // Add products to the correct category and row
            products.forEach((product) => {
                const { id, category, name } = product;
                const rowIdx = updatedGroupedProducts[category].findIndex((item: any) => !item.name);
                if (rowIdx !== -1) {
                    updatedGroupedProducts[category][rowIdx] = { id, name, category };
                }
            });

            return updatedGroupedProducts;
        });
    }, [products, categories, numRows]);
    const handleDeleteClick = (productId: string) => {
        console.log("test productID", productId);
        onDeleteProduct(productId);

        // Clear the name property in the corresponding cell
        setGroupedProducts((prevGroupedProducts: any) => {
            const updatedGroupedProducts = { ...prevGroupedProducts };

            // Find the category and row index of the deleted product
            let deletedCategory = null;
            let deletedRowIndex = null;

            categories.forEach((category) => {
                const rowIndex = updatedGroupedProducts[category].findIndex((item: any) => item.id === productId);
                if (rowIndex !== -1) {
                    deletedCategory = category;
                    deletedRowIndex = rowIndex;
                }
            });

            // Update the name property to an empty string in the corresponding cell
            if (deletedCategory !== null && deletedRowIndex !== null) {
                updatedGroupedProducts[deletedCategory][deletedRowIndex].name = '';
            }

            return updatedGroupedProducts;
        });
    };

    return (
        <div className="product-table-container">
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="table-pizza" style={{ backgroundColor: COLORS.PizzaHeaderBackground, color: COLORS.PizzaHeaderColor, width: cellWidth }}>
                                Pizza
                            </th>
                            <th className="table-banaku" style={{ backgroundColor: COLORS.BanakuHeaderBackground, color: COLORS.BanakuHeaderColor, width: cellWidth }}>
                                Banaku
                            </th>
                            <th className="table-kitchen" style={{ backgroundColor: COLORS.KitchenHeaderBackground, color: COLORS.KitchenHeaderColor, width: cellWidth }}>
                                Kitchen
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: numRows }).map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                {categories.map((category, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`text-center table-${category.toLowerCase()}`}
                                        style={{ verticalAlign: 'middle', minWidth: cellWidth }}
                                        onMouseEnter={() => handleMouseEnter(rowIndex, category)}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        {groupedProducts[category] && groupedProducts[category][rowIndex] && (
                                            <div className="product-cell">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={groupedProducts[category][rowIndex].name}
                                                    readOnly
                                                />
                                                {hoveredCell?.row === rowIndex && hoveredCell?.category === category && (
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDeleteClick(groupedProducts[category][rowIndex].id)}
                                                    >
                                                        X
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductTable;
