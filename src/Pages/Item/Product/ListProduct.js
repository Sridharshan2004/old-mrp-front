import React, { useState } from 'react'
import dataService from "../../../Service/dataService"
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTable, useFilters, useSortBy } from 'react-table'

const ListProduct = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [rowId, setRowId] = useState(null);

    const initProducts = () => {
        dataService.getexe("product/product")
            .then(response => {
                console.log("GET PRODUCT", response.data);
                if (response.data !== "") {
                    setProducts(response.data)
                    setIsLoading(false)
                }
                else {
                    setProducts([])
                    setIsLoading(false)
                }
            })
            .catch(error => {
                console.error("ERROR - GET PRODUCT", error);
            })
    }

    const calculateProductOperationTotalTime = (product) => {
        let totalSeconds = 0;
        product.productOperation.forEach((operation) => {
          const [hours, minutes, seconds] = operation.time.split(':');
          totalSeconds += parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
        });
      
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
      
        return `${hours}:${minutes}:${seconds}`;
      };

    const calculateProductOperationTotalCost = (product) => {
        let totalCost = 0;
        product.productOperation.forEach((operation) => {
          const [hours, minutes, seconds] = operation.time.split(':').map(Number);
          const decimalHours = hours + (minutes / 60) + (seconds / 3600);
          const operationCost = decimalHours * operation.cost;
          totalCost += operationCost;
        });
        return totalCost;
      };

      const calculateProductBOMTotalCost = (product) => {
        let totalCost = 0;
        product.bom.forEach((material) => {
          totalCost += material.quantity * material.material.price;
        });
        return totalCost;
      };
      
    useEffect(() => {
        initProducts();
    }, [])

    const columns = React.useMemo(() => [
        { Header: 'Name', accessor: 'productName' },
        { Header: 'Variant code / SKU', accessor: 'variantsCode' },
        { Header: 'Category', accessor: 'category.categoryName' },
        { 
            Header: 'Default sales price', 
            accessor: (row) => parseFloat(row.price).toFixed(2),
        },
        {
            Header: 'Cost',
            accessor: (row) => ((calculateProductBOMTotalCost(row)) + (calculateProductOperationTotalCost(row))).toFixed(2),
        },
        { 
            Header: 'Profit', 
            accessor: (row) => ((row.price) - ((calculateProductBOMTotalCost(row)) + (calculateProductOperationTotalCost(row)))).toFixed(2)
        },
        { 
            Header: 'Margin', 
            accessor: (row) => (((((row.price) - ((calculateProductBOMTotalCost(row)) + (calculateProductOperationTotalCost(row))))/ (row.price))*100).toFixed(2))+ '%'
        },
        {
            Header: 'Prod.time',
            accessor: (row) => calculateProductOperationTotalTime(row),
        },
        {
            Header: 'Actions',
            Cell: ({ row }) => (
                <div>
                    <Link to={`/product/new/${row.original.id}`} className="btn btn-primary btn-sm me-2"><i className='fa fa-pencil'></i></Link>
                    <button onClick={() => handleDelete(row.original.id) > setDeleteVisible(true)} className="btn btn-danger btn-sm"><i className='fa fa-trash'></i></button>
                </div>)
        }
    ], []);

    const handleDelete = (id) => {
        console.log("Delete", id);
        setRowId(id);
    }

    const deleteContent = () => {

        const deleteform = () => {
            dataService.deleteexe(`product/product/${rowId}`)
                .then(response => {
                    console.log("SUCCESS- UPDATED CATEGORY", response.data);
                    initProducts();
                    setDeleteVisible(false);
                })
                .catch(error => {
                    console.error("ERROR- UPDATED CATEGORY", error);
                })
        }

        return (
            <>
                <div className="modal-backdrop show"></div>
                <div className=" modal " style={{ display: 'block' }} tabIndex="-1" role="dialog" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content border-0">
                            <div className="modal-body p-0">
                                <div className="card border-0 p-sm-3 p-2 justify-content-center">
                                    <div className="card-header pb-0 bg-white border-0 ">
                                        <div className="row justify-content-end mb-3">
                                            <button type="button" className='btn btn-close' onClick={() => setDeleteVisible(false)}></button>
                                        </div>
                                        <p className="font-weight-bold mb-2"> Are you sure you wanna delete this ?</p>
                                    </div>
                                    <div className="card-body px-sm-4 mb-2 pt-1 pb-0">
                                        <div className="row justify-content-end no-gutters">
                                            <div className="col-auto">
                                                <button type="button" className="btn btn-light text-muted" onClick={() => setDeleteVisible(false)}>Cancel</button>
                                            </div>
                                            <div className="col-auto">
                                                <button type="button" className="btn btn-danger px-4" onClick={() => deleteform()}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = useTable({ columns, data: products }, useFilters, useSortBy);

  return (
    <div className="container-fluid">
    <div className="d-flex flex-row align-items-center justify-content-between py-3">
        <h5 className="m-0 font-weight-bold text-primary ">Products</h5>
        <Link to="/product" className="btn btn-sm btn-primary shadow-sm">Add Product </Link>
    </div>
    <div className="row mb-5">
        <div className="col">
            {isLoading ? (<p>Loading...</p>) : (
                <div className="table-responsive">
                    <table {...getTableProps()} className="table table-bordered">
                        <thead>
                            {headerGroups.map(headerGroups => (
                                <tr {...headerGroups.getFooterGroupProps()}>
                                    {headerGroups.headers.map(column => (
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                            {column.render('Header')}
                                            <span>
                                                {column.isSorted ? (column.isSortedDesc ? ' ⇩' : ' ⇧') : ''}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length}>No data available</td>
                                </tr>
                            )}
                            {rows.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    </div>
    {deleteVisible && deleteContent()}
</div>
  )
}

export default ListProduct