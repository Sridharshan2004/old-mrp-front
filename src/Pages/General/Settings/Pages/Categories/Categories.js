import { useTable, useSortBy   } from 'react-table'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

import dataService from '../../../../../Service/dataService'

const Categories = () => {

  const [showForm, setShowForm] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [category, setcategory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [rowId, setRowId] = useState(null);

  const handleRowClick = (row) => {
    console.log("ROW CLICKED - ROW ID:", row.original.id)
    setRowId(row.original.id);
    setCategoryName(row.original.categoryName);
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

    if (value === 'SUCCESS') {
      toast.success('SUCCESS', {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    }
    else if (value === 'UPDATE') {
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

  const initcategory = () => {
    dataService.getexe("category/category")
      .then(response => {
        console.log("GET CATEGORY", response.data);
        if (response.data.list !== null) {
          setcategory(response.data.list);
          setIsLoading(false);
        }
        else {
          setcategory([]);
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.error("ERROR- GET CATEGORY", error);
      })
  }

  const submitform = (event) => {
    event.preventDefault();
    const postDate = {
      categoryName: categoryName
    }
    console.log("NEW CATEGORY", postDate);
    dataService.postexe("category/category", postDate)
      .then(response => {
        console.log("SUCCESS- ADD CATEGORY", response.data);
        showToastMessage('SUCCESS');
        initcategory();
        setShowForm(false);
      })
      .catch(error => {
        console.error("ERROR- ADD CATEGORY", error);
      })
  }

  const editform = () => {
    const postDate = {
      categoryName: categoryName
    }
    console.log("UPDATE CATEGORY", postDate);
    dataService.putexe(`category/category/${rowId}`, postDate)
      .then(response => {
        console.log("SUCCESS- UPDATED CATEGORY", response.data);
        showToastMessage('UPDATE');
        initcategory();
        setRowId(null);
      })
      .catch(error => {
        console.error("ERROR- UPDATED CATEGORY", error);
      })
  }

  useEffect(() => {
    initcategory();
  }, [])

  const columns = React.useMemo(() => [
    { Header: 'Name', accessor: 'categoryName',width:100 },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <div>
          <button onClick={() => setDeleteVisible(true)} className="btn btn-danger btn-sm"><i className='fa fa-trash'></i></button>
        </div>),
        width:90
    }
  ], []);




  const deleteContent = () => {

    const deleteform = () => {
      dataService.deleteexe(`category/category/${rowId}`)
        .then(response => {
          console.log("SUCCESS- DELETED CATEGORY", response.data);
          showToastMessage('ERROR');
          initcategory();
          setRowId(null);
          setDeleteVisible(false);
        })
        .catch(error => {
          console.error("ERROR- DELETED CATEGORY", error);
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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = useTable({ columns, data: category }, useSortBy);

  return (
    <div className="container-fluid mt-5">
      <div className="mb-3"><h5>Categories</h5></div>
      <div className="row mb-5">
        <div className="col">
          <div>{isLoading ? (<p>Loading...</p>) : (
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
                      <td>No data available</td>
                      <td>No data available</td>
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
                              {cell.column.id === 'categoryName' && isEditing ? (
                                <div className="">
                                  <input
                                    type="text"
                                    className=''
                                    value={categoryName}
                                    onChange={event => setCategoryName(event.target.value)}
                                    onBlur={handleBlur}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                  />
                                </div>
                              ) : (
                                cell.render('Cell'))}
                            </td>
                          ))}
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>)}
          </div>
          {!showForm && (<button className="btn btn-outline-secondary btn-sm" onClick={() => setShowForm(true)}>+Add new row</button>)}
          {showForm && (
            <form onSubmit={submitform}>
              <div className="table-responsive">
                <table className='table table-bordered'>
                  <tbody>
                    <tr>
                      <td >
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control border-0"
                            placeholder=" Category Name"
                            onChange={event => setCategoryName(event.target.value)}
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
              </div>
            </form>
          )}
        </div>
        <div className="col"></div>
      </div>
      {deleteVisible && deleteContent()}
    </div>
  )
}

export default Categories