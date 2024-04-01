import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Product } from '../../common/types/product.model';
import '../../styles/table.css';
import io, { Socket } from 'socket.io-client';

let socket: Socket;

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
    const tableHeaders = Array.from({ length: 20 }, (_, i) => `Table ${i + 1}`);
    const cellWidth = '150px';

    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);
    const [selectedCells, setSelectedCells] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const [prevSelectedCells, setPrevSelectedCells] = useState<any[]>([]);
    const [modalCategoryIndex, setModalCategoryIndex] = useState(0);

    // const [backendUrl, setBackendUrl] = useState<any>();
    const backendUrl = `${window.location.protocol}//${window.location.hostname}:3001`;



    useEffect(() => {
        socket = io(backendUrl);

        socket.on('connect', () => {
            console.log('Connected to server');
            socket?.emit('requestTableState');
        });

        socket.on('tableUpdate', (data) => {
            console.log('Received tableUpdate event', data);
            setIsLoading(true);
            if (data) {
                console.log('Updating selectedCells with data from server:', data);
                const { timestamp, selectedCells } = data;
                console.log("data " , data);
                console.log("data.selectedCells", data.selectedCells);
                console.log("selectedCells", selectedCells);
                setSelectedCells(data);
            } else {
                console.log('Clearing selectedCells because data from server is falsy');
                setSelectedCells([]);
            }
            setIsLoading(false);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [backendUrl]);

    useEffect(() => {
        if (selectedCells.length === 0) {
            setSelectedCell({ rowIndex: 0, colIndex: 0, selectedProduct: null, count: 0 });
            setSelectedCells([]);
        }
    }, [locationName, selectedCells.length]);


    useEffect(() => {
        if (socket && JSON.stringify(selectedCells) !== JSON.stringify(prevSelectedCells)) {
            // Generate a timestamp
            const timestamp = Date.now();
            // Include the timestamp with the data being sent
            const dataWithTimestamp = { timestamp, selectedCells };
            console.log("aaaaa datawithtimestamp ", dataWithTimestamp);
            socket.emit('tableUpdate', dataWithTimestamp);
            setPrevSelectedCells(selectedCells);
        }
    }, [prevSelectedCells, selectedCells]);

    // useEffect(() => {
    //     const debouncedEmit = debounce(() => {
    //         if (socket && JSON.stringify(selectedCells) !== JSON.stringify(prevSelectedCells)) {
    //         // Generate a timestamp
    //         const timestamp = Date.now();
    //         // Include the timestamp with the data being sent
    //         const dataWithTimestamp = { timestamp, selectedCells };
    //         socket.emit('tableUpdate', dataWithTimestamp);
    //         setPrevSelectedCells(selectedCells);
    //         }
    //     }, 500); 

    //     debouncedEmit();
    //     return debouncedEmit.cancel;
    // }, [prevSelectedCells, selectedCells]);


    function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
        let timeoutId: ReturnType<typeof setTimeout>;

        function debouncedFunction(this: ThisParameterType<T>, ...args: Parameters<T>) {
            const later = () => {
                clearTimeout(timeoutId);
                func.apply(this, args);
            };

            clearTimeout(timeoutId);
            timeoutId = setTimeout(later, delay);
        }

        debouncedFunction.cancel = () => clearTimeout(timeoutId);

        return debouncedFunction;
    }


    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                // Click outside the modal, close it
                handleCloseModal();
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
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
            setShowProductModal(true);
        }
    };

    const handleButtonClick = (rowIndex: number, colIndex: number) => {
        const isEmptyCell = !selectedCells.some((cell) => cell.rowIndex === rowIndex && cell.colIndex === colIndex);
        console.log("aaaaa" + selectedCells);

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


    const getCategory = (index: number) => {
        switch (index) {
            case 0:
                return 'PIZZA';
            case 1:
                return 'BANAKU';
            case 2:
                return 'KITCHEN';
            default:
                return '';
        }
    };

    function getButtonStyle(category: string) {
        switch (category) {
            case 'PIZZA':
                return 'pizza-modal-element-style'; // Define your own class for category 1
            case 'BANAKU':
                return 'banaku-modal-element-style'; // Define your own class for category 2
            case 'KITCHEN':
                return 'kitchen-modal-element-style'; // Define your own class for category 3
            default:
                return '';
        }
    }


    const filteredProducts = products!.filter(product => product.category === getCategory(modalCategoryIndex));


    const handleForwardClick = () => {
        setModalCategoryIndex((prevIndex) => (prevIndex + 1) % 3); // Cycle through 3 categories
    };
    const handleBackwardClick = () => {
        setModalCategoryIndex((prevIndex) => (prevIndex - 1 + 3) % 3); // Ensure positive index
    };

    return (
        isLoading ? <div>Loading...</div> :
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
                            {Array.from({ length: 20 }).map((_, rowIndex) => (
                                <tr key={rowIndex}>
                                    {tableHeaders.map((_, colIndex) => (
                                        <td key={colIndex} className="text-center" style={{ verticalAlign: 'middle', minWidth: cellWidth }}>
                                            <button
                                                className="btn btn-outline-secondary product-button"
                                                onClick={() => handleButtonClick(rowIndex, colIndex)}
                                            >

                                                {(() => {

                                                    const cell = selectedCells.find((cell) => cell.rowIndex === rowIndex && cell.colIndex === colIndex);
                                                    return cell
                                                        ? `${cell.count}-${cell.selectedProduct.name}`
                                                        : '_______________';
                                                })()}
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
                                <button className="btn btn-secondary" onClick={handleBackwardClick}>{'<'}</button>
                                <h5 className="modal-title">{getCategory(modalCategoryIndex)}</h5>

                                <div>
                                    <button className="btn btn-secondary" onClick={handleForwardClick}>{'>'}</button>

                                    <button type="button" className="close" data-dismiss="modal" onClick={handleCloseModal}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>

                            </div>


                            <div className="modal-body d-flex flex-wrap">
                                {/* Render product buttons */}
                                {filteredProducts!.map((product) => (
                                    <button
                                        key={product.id}
                                        className={`btn btn-outline-primary mb-2 mx-2 ${getButtonStyle(product.category)}`}
                                        style={{ flexBasis: 'calc(33.3333% - 20px)' }}
                                        onClick={() => handleProductClick(product)}
                                    >
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
