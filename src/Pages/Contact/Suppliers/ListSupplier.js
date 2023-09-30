import React, { useState } from 'react'
import dataService from "../../../Service/dataService"
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTable, useFilters, useSortBy } from 'react-table'

const ListSupplier = () => {

    const [supliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [rowId, setRowId] = useState(null);

    const initSupplier = () => {
        dataService.getexe("supplier/supplier")
            .then(response => {
                console.log("GET SUPPLIERS", response.data);
                if (response.data.list !== null) {
                    setSuppliers(response.data.list);
                    setIsLoading(false);
                }
                else {
                    setSuppliers([]);
                    setIsLoading(false);
                }
            })
            .catch(error => {
                console.error("ERROR - GET SUPPLIERS", error);
            })
    }

    useEffect(() => {
        initSupplier();
    }, [])

    const columns = React.useMemo(() => [
        { Header: 'Name', accessor: 'supplierName' },
        { Header: 'Email', accessor: 'emailAddress' },
        { Header: 'phoneNumber', accessor: 'phNumber' },
        { Header: 'Comment', accessor: 'comment' },
        {
            Header: 'Actions',
            Cell: ({ row }) => (
                <div>
                    <Link to={`/supplier/${row.original.id}`} className="btn btn-primary btn-sm me-2"><i className='fa fa-pencil'></i></Link>
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
            dataService.deleteexe(`supplier/supplier/${rowId}`)
                .then(response => {
                    console.log("SUCCESS- DELETED SUPPLIER", response.data);
                    initSupplier();
                    setDeleteVisible(false);
                })
                .catch(error => {
                    console.error("ERROR- DELETED SUPPLIER", error);
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

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = useTable({ columns, data: supliers }, useFilters, useSortBy);

    return (
        <div className="container-fluid">
            <div className="d-flex flex-row align-items-center justify-content-between py-3">
                <h5 className="m-0 font-weight-bold text-primary ">Suppliers</h5>
                <Link to="/supplier" className="btn btn-sm btn-primary shadow-sm">Add Supplier </Link>
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

export default ListSupplier