import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Product } from '../../common/types/product.model';
import '../../styles/table.css';
interface TableDisplayProps {
    locationName: string;
    headerBackgroundColor?: string;
    textColor?: string;
    products?: Product[];
}
interface SelectedCell {
    rowIndex: number;
    colIndex: number;
    selectedProduct?: any;
    count: number;
}

const TableDisplay: React.FC<TableDisplayProps> = ({ locationName, headerBackgroundColor, textColor, products }) => {
    console.log("table inside pizza", products);
    const tableHeaders = Array.from({ length: 20 }, (_, i) => `Table ${i + 1}`);
    const cellWidth = '150px';

    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);
    const [selectedCells, setSelectedCells] = useState<any[]>([]);
    const modalRef = useRef<HTMLDivElement | null>(null);

    console.log(selectedCells);
    useEffect(() => {
        const loadSelectedCellsFromStorage = () => {
            const storedSelectedCells = localStorage.getItem(`${locationName}_selectedCells`);
            if (storedSelectedCells) {
                const test = JSON.parse(storedSelectedCells);
                setTimeout(() => {
                    setSelectedCells(test);
                }, 0);
            }
        };

        if (selectedCells.length === 0) {
            loadSelectedCellsFromStorage();
        }
    }, [locationName]);

    useEffect(() => {
        // Set initial state only if selectedCells is still empty
        if (selectedCells.length === 0) {
            setSelectedCell({ rowIndex: 0, colIndex: 0, selectedProduct: null, count: 0 });
            setSelectedCells([]);
        }
    }, [locationName]);


    useEffect(() => {
        const saveSelectedCellsToStorage = (cells: SelectedCell[]) => {
            if (cells.length > 0) {
                localStorage.setItem(`${locationName}_selectedCells`, JSON.stringify(cells));
            }
        };

        saveSelectedCellsToStorage(selectedCells);
    }, [locationName, selectedCells]);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                // Click outside the modal, close it
                handleCloseModal();
            }
        };

        // Attach the event listener to the document
        document.addEventListener('mousedown', handleOutsideClick);

        // Cleanup the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handleProductClick = (product: any) => {
        if (selectedCell) {
            setSelectedCells((prevSelectedCells) => {
                const updatedSelectedCells = [...prevSelectedCells];
                const indexToUpdate = updatedSelectedCells.findIndex(
                    (cell) => cell.rowIndex === selectedCell.rowIndex && cell.colIndex === selectedCell.colIndex
                );

                if (indexToUpdate !== -1) {
                    updatedSelectedCells[indexToUpdate] = { ...selectedCell, selectedProduct: product, count: (updatedSelectedCells[indexToUpdate].count || 0) + 1 };
                } else {
                    // If the cell is not found, add a new entry
                    updatedSelectedCells.push({ ...selectedCell, selectedProduct: product, count: 1 });
                }

                return updatedSelectedCells;
            });
            setShowProductModal(true); // Open the modal after selecting a product
        }
    };

    const handleButtonClick = (rowIndex: number, colIndex: number) => {
        const isEmptyCell = !selectedCells.some((cell) => cell.rowIndex === rowIndex && cell.colIndex === colIndex);

        if (isEmptyCell) {
            setShowProductModal(true);
            setSelectedCell({ rowIndex, colIndex, selectedProduct: null, count: 0 });
        } else {
            setSelectedCells((prevSelectedCells) =>
                prevSelectedCells.filter((cell) => !(cell.rowIndex === rowIndex && cell.colIndex === colIndex))
            );
        }
    };

    const handleCloseModal = () => {
        setShowProductModal(false);
        setSelectedCell(null);
    };


    return (
        <div className="d-flex justify-content-center align-items-center" >
            <div style={{ overflowX: 'auto', width: '80%' }} >

                <h2 className="text-center">{locationName}</h2>
                <table className="table" style={{ tableLayout: 'auto', width: 'auto' }}>
                    <thead>
                        <tr>
                            {tableHeaders.map((header, index) => (
                                <th key={index} className="text-center" style={{ backgroundColor: headerBackgroundColor, color: textColor, width: cellWidth }}>
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 15 }).map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                {tableHeaders.map((_, colIndex) => (
                                    <td key={colIndex} className="text-center" style={{ verticalAlign: 'middle', minWidth: cellWidth }}>
                                        <button
                                            className="btn btn-outline-secondary product-button"
                                            onClick={() => handleButtonClick(rowIndex, colIndex)}
                                        >
                                            {selectedCells.find(
                                                (cell) => cell.rowIndex === rowIndex && cell.colIndex === colIndex
                                            )
                                                ? `${selectedCells.find(
                                                    (cell) => cell.rowIndex === rowIndex && cell.colIndex === colIndex
                                                )!.count}-${selectedCells.find(
                                                    (cell) => cell.rowIndex === rowIndex && cell.colIndex === colIndex
                                                )!.selectedProduct.name}`
                                                : '_______________'}
                                        </button>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            <div role="dialog" style={{ display: showProductModal ? 'block' : 'none' }}   >
                <div ref={modalRef} className="modal modal-dialog modal-bottom modal-container" role="document" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Products</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleCloseModal}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {/* Render product buttons */}
                            {products!.map((product) => (
                                <button key={product.id} className="btn btn-outline-primary" onClick={() => handleProductClick(product)}>
                                    {product.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default TableDisplay;
