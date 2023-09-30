import React, { useState } from 'react'
import dataService from "../../Service/dataService"
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTable, useFilters, useSortBy } from 'react-table'

const Sell = () => {
  const [salesorders, setSalesorders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rowId, setRowId] = useState(null);
  const [deleteVisible, setDeleteVisible] = useState(false);

  const initSalesOrder = () => {
      dataService.getexe("salesorders/salesorders")
          .then(response => {
              console.log("SALES ORDER DATA", response.data);
              if (response.data !== '') {
                  setSalesorders(response.data)
                  setIsLoading(false)
              }
              else {
                setSalesorders([])
              }
          })
          .catch(error => {
              console.error("ERROR", error);
          })
  }

  useEffect(() => {
    initSalesOrder();
  }, [])

  const calculateProductPrice = (data) => {
    let totalProductPrice = 0;
    data.salesOrderProduct.forEach((item) => {
        totalProductPrice += parseFloat(item.quantity) * parseFloat(item.price);
    });
    return totalProductPrice;
  }
  const formatData= (data) => {

    let date = new Date(data);
    let year = date.getFullYear();
    let month = String(date.getMonth()+1).padStart(2,'0');
    let day = String(date.getDate()).padStart(2,'0');
    return `${day}-${month}-${year}`
  } 

  const columns = React.useMemo(() => [
      { Header: 'Order #', accessor: 'name', },
      { Header: 'Customer', accessor: 'customer.customerName', },
    { 
        Header: 'Total amount ', 
        accessor: (row) => (calculateProductPrice(row)).toFixed(2),
    },
      
      { Header: 'Delivery deadline', accessor: 'deliveryDate', 
      Cell : ({value}) =>
      <span> {formatData(value)}</span> },
      {
        Header: 'Sales items', accessor: 'enabled',
        Cell: ({ value }) =>
            <span className={value === true ? "badge bg-success" : "badge bg-danger"}>
                {value ? 'In stock' : 'Not available'}
            </span>

    },
    {
        Header: 'Ingredients ', accessor: 'enabledd',
        Cell: ({ value }) =>
            <span className={value === true ? "badge bg-success" : "badge bg-danger"}>
                {value ? 'In stock' : 'Not available'}
            </span>

    },
    {
        Header: 'Production ', accessor: 'enabledsd',
        Cell: ({ value }) =>
            <span className={value === true ? "badge bg-success" : "badge bg-danger"}>
                {value ? 'In stock' : 'Not available'}
            </span>

    },
    {
        Header: 'Actions',
        Cell: ({ row }) => (
            <div>
            <Link to={`/sales/${row.original.id}`} className="btn btn-primary btn-sm me-2"><i className='fa fa-pencil'></i></Link>
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
        dataService.deleteexe(`salesorders/salesorders/${rowId}`)
            .then(response => {
                console.log("SUCCESS- DELETED SALES ORDER DATA", response.data);
                initSalesOrder();
                setDeleteVisible(false);
            })
            .catch(error => {
                console.error("ERROR- DELETED SALES ORDER DATA", error);
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



  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = useTable({ columns, data: salesorders }, useFilters, useSortBy);


  return (
    <div className="container-fluid">
    <div className="d-flex flex-row align-items-center justify-content-between py-3">
        <h5 className="m-0 font-weight-bold text-primary ">Sales List</h5>
        <Link to="/sales" className="btn btn-sm btn-primary shadow-sm">
            Create sale order </Link>
    </div>
    {/* <div className="mb-3"><h5>User</h5></div> */}
    <div className="row mt-4">
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

export default Sell