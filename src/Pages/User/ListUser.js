import React, { useState } from 'react'
// import SortTable from '../../Components/Table/SortTable'
// import ColumnFilterTable from '../../Components/Table/ColumnFilterTable'
// import ColumnFilter from '../../Components/Table/Filter/ColumnFilter'
import dataService from "../../Service/dataService"
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTable, useFilters, useSortBy } from 'react-table'

const ListUser = () => {

  const [measure, setMeasure] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const initMeasure = () => {
    dataService.getexe("user/user")
      .then(response => {
        console.log("UNIT DATA", response.data);
        if (response.data.list !== null) {
          setMeasure(response.data.list)
          setIsLoading(false)
        }
        else {
          setMeasure([])
        }
      })
      .catch(error => {
        console.error("ERROE", error);
      })
  }

  useEffect(() => {
    initMeasure();
  }, [])


  const ColumnFilter = ({ column }) => {
    const { filterValue, setFilter } = column;
    return (
      <input value={filterValue || ''} onChange={(e) => setFilter(e.target.value)} />
    )
  }


  const columns = React.useMemo(() => [
    { Header: 'S.No', accessor: (_, index) => index + 1 },
    { Header: 'Name', accessor: 'name', },
    { Header: 'Email', accessor: 'email', },
    { Header: 'phoneNumber', accessor: 'phoneNumber', Filter: ColumnFilter },
    // { Header: 'phoneNumber', accessor: 'phoneNumber', Filter: ColumnFilter },
    {
      Header: 'Status', accessor: 'enabled',
      Cell: ({ value }) =>
        <span className={value === true ? "badge bg-success" : "badge bg-warning"}>
          {value ? 'Active' : 'Inactive'}
        </span>

    },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <button onClick={() => handleDelete(row.original.id)} className="btn btn-danger btn-sm"><i className='fa fa-trash'></i></button>)
    }
  ], []);

  const handleDelete = (id) => {
    console.log("Delete", id);
  }



  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = useTable({ columns, data: measure }, useFilters, useSortBy);



  return (
    <div className="container-fluid">
      <div className="d-flex flex-row align-items-center justify-content-between py-3">
        <h5 className="m-0 font-weight-bold text-primary ">User</h5>
        <Link to="/user" className="btn btn-sm btn-primary shadow-sm">
          Add User </Link>
      </div>
      {/* <div className="mb-3"><h5>User</h5></div> */}
      <div className="row">
        <div className="col">
          {isLoading ? (<p>Loading...</p>):(
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
    </div>
  )
}

export default ListUser