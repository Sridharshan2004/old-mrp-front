import React, { useState } from 'react'
// import SortTable from '../../Components/Table/SortTable'
// import ColumnFilterTable from '../../Components/Table/ColumnFilterTable'
// import ColumnFilter from '../../Components/Table/Filter/ColumnFilter'
import dataService from "../../Service/dataService"
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTable, useFilters, useSortBy } from 'react-table'


const ListManufacturingOrders = () => {
    const [measure, setMeasure] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rowId, setRowId] = useState(null);
    const [deleteVisible, setDeleteVisible] = useState(false);

    const initManufacturingOrders = () => {
        dataService.getexe("manufacturingorder/manufacturingorder")
            .then(response => {
                console.log("SUCCESS- GET MANUFACTURING ORDER DATA", response.data);
                if (response.data !== '') {
                    setMeasure(response.data)
                    setIsLoading(false)
                }
                else {
                    setMeasure([])
                    setIsLoading(false)
                }
            })
            .catch(error => {
                console.error("ERROR- GET MANUFACTURING ORDER DATA", error);
            })
    }

    useEffect(() => {
        initManufacturingOrders();
    }, [])

    const formatData= (data) => {

        let date = new Date(data);
        let year = date.getFullYear();
        let month = String(date.getMonth()+1).padStart(2,'0');
        let day = String(date.getDate()).padStart(2,'0');
        return `${day}-${month}-${year}`
      } 

          // Calculate ingredient availability based on required ingredients
    const calculateIngredientAvailability = (requiredIngredients) => {
        
        const availabilityvalue = requiredIngredients.map(ingredient => ingredient.ingredient_availability);

        if(availabilityvalue.every(value => value === 1)) {
            console.log(1);
            return 1;
        }
        if(availabilityvalue.every(value => value === 2)) {
            console.log(2);
            return 2;
        }
        if(availabilityvalue.every(value => value === 3)) {
            console.log(3);
            return 3;
        }
        if(availabilityvalue.every(value => value === 4)) {
            console.log(4);
            return 4;
        }
        if(availabilityvalue.includes(2)) {
            console.log(22);
            return 2;
        }
        if(availabilityvalue.includes(1)) {
            console.log(11);
            return 1;
        }
        // return allIngredientsAvailable ? 1 : 0;
        return ''
    };

    const columns = React.useMemo(() => [
        { Header: 'S.No', accessor: (_, index) => index + 1 },
        { Header: 'Order', accessor: 'manufacturingOrder', },
        { Header: 'Customer', accessor: 'customer', },
        { Header: 'Product', accessor: 'product.productName', },
        { Header: 'Category', accessor: 'product.category.categoryName', },
        { Header: 'Completed ', accessor: 'Completed', },
        { Header: 'Quantity', accessor: 'plannedQuantity', },
        { Header: 'Planned', accessor: 'pro', },
        { Header: 'Production', accessor: 'productionDeadline', 
            Cell : ({value}) =>
            <span> {formatData(value)}</span> 
        },
        { Header: 'Delivery ', accessor: 'delivery', },
        {
            Header: 'Ingredients ', accessor: 'manufacturingOrderIngredients',
            Cell: ({ value }) => {
                const IngredientAvailability = calculateIngredientAvailability(value);

                return (
                <span className={IngredientAvailability === 4 ? "badge bg-success" :IngredientAvailability === 3 ? "badge bg-success" : IngredientAvailability === 2 ? "badge bg-warning" : "badge bg-danger"}>
                    {IngredientAvailability === 4 ? "PROCESSED" :IngredientAvailability === 3 ? "IN STOCK" : IngredientAvailability === 2 ? "EXCEPTED" : "NOT AVAILABLE"}
                </span>
                );

        }},
        {
            Header: 'Production', accessor: 'status',
            Cell: ({ value }) =>
                <span className={value === 1 ? "badge bg-secondary" : value === 2 ? "badge bg-warning" : "badge bg-success"}>
                    {value === 1 ? "NOT STARTED" : value === 2 ? "WORK IN PROGRESS" : "DONE"}
                </span>

        },
        {
            Header: 'Actions',
            Cell: ({ row }) => (
                <div>
                <Link to={`/manufacturingorder/${row.original.id}`} className="btn btn-primary btn-sm me-2"><i className='fa fa-pencil'></i></Link>
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
            dataService.deleteexe(`manufacturingorder/manufacturingorder/${rowId}`)
                .then(response => {
                    console.log("SUCCESS- DELETED MANUFACTURING ORDER DATA", response.data);
                    initManufacturingOrders();
                    setDeleteVisible(false);
                })
                .catch(error => {
                    console.error("ERROR- DELETED MANUFACTURING ORDER DATA", error);
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

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = useTable({ columns, data: measure }, useFilters, useSortBy);
    return (
        <div className="container-fluid">
            <div className="d-flex flex-row align-items-center justify-content-between py-3">
                <h5 className="m-0 font-weight-bold text-primary ">Manufacturing Orders</h5>
                <Link to="/Manufacturingorder" className="btn btn-sm btn-primary shadow-sm">Manufacturing Orders </Link>
            </div>
            {/* <div className="mb-3"><h5>User</h5></div> */}
            <div className="row">
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

export default ListManufacturingOrders