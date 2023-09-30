import { useTable, useSortBy } from 'react-table'
import React, { useState, useEffect } from 'react'
import {toast} from 'react-toastify'
import dataService from '../../../../../Service/dataService'

const Operations = () => {

  const [showForm, setShowForm] = useState(false);
  const [operationName, setOperationName] = useState('');
  const [operation, setOperation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [rowId, setRowId] = useState(null);

  const handleRowClick = (row) => {
    console.log("ROW CLICKED - ROW ID:", row.original.id)
    setRowId(row.original.id);
    setOperationName(row.original.operationName);
  }

  const handleBlur = () => {
    console.log("INPUT BLUR");
    editform();
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log('INPUT KEY PRESS');
      editform();
    }
  };

  const showToastMessage = (value) => {

    if(value === 'SUCCESS'){
      toast.success('SUCCESS', {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    }
    else if (value === 'UPDATE'){
      toast.info('UPDATED', {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    }
    else {
      toast.error('DELETED', {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    }

  }

  const initOperation = () => {
    dataService.getexe("operation/operation")
      .then(response => {
        console.log("GET OPERATION", response.data);
        if (response.data.list !== null) {
          setOperation(response.data.list);
          setIsLoading(false);
        }
        else {
          setOperation([]);
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.error("ERROE- GET OPERATION", error);
      })
  }

  const submitform = (event) => {
    event.preventDefault();
    const postDate = {
      operationName: operationName
    }
    console.log("NEW OPERATION", postDate);
    dataService.postexe("operation/operation", postDate)
      .then(response => {
        console.log("SUCCESS- ADD OPERATION", response.data);
        showToastMessage('SUCCESS');
        initOperation();
        setShowForm(false);
      })
      .catch(error => {
        console.error("ERROR- ADD OPERATION",error);
      })
  }

  const editform = () => {
    const postDate = {
      operationName: operationName
    }
    console.log("UPDATE OPERATION", postDate);
    dataService.putexe(`operation/operation/${rowId}`, postDate)
      .then(response => {
        console.log("SUCCESS- UPDATED OPERATION", response.data);
        showToastMessage('UPDATE');
        initOperation();
        setRowId(null);
      })
      .catch(error => {
        console.error("ERROR- UPDATED OPERATION", error);
      })
  }

  useEffect(() => {
    initOperation();
  }, [])

  const columns = React.useMemo(() => [
    { Header: 'Operation Name', accessor: 'operationName',width:200 },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <div>
        <button onClick={() => setDeleteVisible(true)} className="btn btn-danger btn-sm"><i className='fa fa-trash'></i></button>
      </div>),width:90
    }
  ], []);



  const deleteContent = () => {

    const deleteform = () => {
      dataService.deleteexe(`operation/operation/${rowId}`)
        .then(response => {
          console.log("SUCCESS- DELETED OPERATION", response.data);
          showToastMessage('ERROR');
          initOperation();
          setRowId(null);
          setDeleteVisible(false);
        })
        .catch(error => {
          console.error("ERROR- DELETED OPERATION", error);
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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = useTable({ columns, data: operation }, useSortBy);

  return (
    <div className="container-fluid mt-5">
      <div className="mb-3"><h5>Operations</h5></div>
      <div className="row mb-5">
        <div className="col">
          <div>{isLoading ? (<p>Loading...</p>):(
            <div className="table-responsive">
              <table {...getTableProps()} className="table table-bordered">
                <thead className='table-active'>
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
                    const isEditing = row.original.id === rowId;
                    return (
                      <React.Fragment key={row.id}>
                      <tr {...row.getRowProps()} onClick={() => handleRowClick(row)}>
                        {row.cells.map(cell => (
                          <td {...cell.getCellProps()} key={cell.column.id} className={cell.column.id === 'categoryName' ? 'editable' : ''}>
                                                          {cell.column.id === 'operationName' && isEditing ? (
                                <div className="">
                                <input
                                  type="text"
                                  className=''
                                  value={operationName}
                                  onChange={event => setOperationName(event.target.value)}
                                  onBlur={handleBlur}
                                  onKeyDown={handleKeyDown}
                                  autoFocus
                                />
                                </div>
                              ) : (
                                cell.render('Cell'))}</td>
                        ))}
                      </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>)}
          </div>
          {!showForm && (<button className="btn btn-outline-secondary" onClick={() => setShowForm(true)}>+Add new row</button>)}
          {showForm && (
            <form onSubmit={submitform}>
              <table className='table table-bordered'>
                <tbody>
                  <tr>
                    <td >
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control border-0"
                          placeholder="Operation Name"
                          onChange={event => setOperationName(event.target.value)}
                          required
                        />
                      </div>
                    </td>
                    <td>
                      <div className="input-group">
                        <button className='btn btn-secondary'><span aria-hidden="true">+</span></button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          )}
        </div>
        <div className="col"></div>
      </div>
      {deleteVisible && deleteContent()}
    </div>
  )
}

export default Operations