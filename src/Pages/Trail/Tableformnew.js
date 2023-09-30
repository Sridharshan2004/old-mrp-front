import { useTable, useSortBy  } from 'react-table'
import React, { useState, useEffect } from 'react'
import dataService from "../../Service/dataService"

const Tableformnew = () => {

    const [name, setName] = useState('');
    const [measure, setMeasure] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [rowId, setRowId] = useState(null);
    const [addEmptyRow, setAddEmptyRow] = useState(null);

    useEffect(() => {
        initMeasure();
      }, [])
    
      const handleRowClick = (row) => {
        console.log("ROW CLICKED - ROW ID:", row.original.id)
        setRowId(row.original.id);
        setName(row.original.name);
      }
    
      const handleBlur = () => {
        console.log("INPUT BLUR");
        console.log(name);
        setAddEmptyRow(false)
        // editform();
      }

    const initMeasure = () => {
        dataService.getexe("unit/unit")
          .then(response => {
            console.log("GET MEASURE", response.data);
            if (response.data.list !== null) {
              setMeasure(response.data.list);
              setIsLoading(false);
            }
            else {
              setMeasure([]);
              setIsLoading(false);
            }
          })
          .catch(error => {
            console.error("ERROR- GET MEASURE", error);
          })
      }

      
  const deleteContent = () => {

    const deleteform = () => {
      dataService.deleteexe(`unit/unit/${rowId}`)
        .then(response => {
          console.log("SUCCESS- DELETED MEASURE", response.data);
          initMeasure();
          setRowId(null);
          setDeleteVisible(false);
        })
        .catch(error => {
          console.error("ERROR- DELETED MEASURE", error);
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

  const columns = React.useMemo(() => [
    { Header: 'Name', accessor: 'name', width:100 },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <div>
          <button onClick={() => setDeleteVisible(true)} className="btn btn-danger btn-sm"><i className='fa fa-trash'></i></button>
        </div>),
        width:100 
    }
  ], []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = useTable({ columns, data: measure }, useSortBy);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log('INPUT KEY PRESS');
      
    }
  };  
  const submitform = (event) => {
    event.preventDefault();
    const postDate = {
      name: name
    }
    console.log("NEW MEASURE", postDate);
    dataService.postexe("unit/unit", postDate)
      .then(response => {
        console.log("SUCCESS- ADD MEASURE", response.data);
        
        initMeasure();
        
      })
      .catch(error => {
        console.error("ERROR- ADD MEASURE", error);
      })
  }
  return (
    <div><div className="container-fluid mt-5">
    <div className="mb-3">
      <h5>Units of Measure</h5>
    </div>
    <div className="row mb-5">
      <div className="col">
        <div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="table-responsive">
              <table {...getTableProps()} className="table table-bordered">
                {/* Table header rendering code */}
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
                {/* Table body rendering code */}
                <tbody {...getTableBodyProps()}>
                  {/* ... */}
                  {/* If measure array is not empty, map and render rows */}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={columns.length + 1}>No data available</td>
                    </tr>
                  )}
                  {rows.map(row => {
                    prepareRow(row);
                    const isEditing = row.original.id === rowId;
                    return (
                      <React.Fragment key={row.id}>
                        <tr {...row.getRowProps()} onClick={() => handleRowClick(row)}>
                          {row.cells.map(cell => (
                            <td {...cell.getCellProps()} key={cell.column.id} >
                              {cell.column.id === 'name' && isEditing ? (
                                <div className="input-group">
                                  <input
                                    type="text"
                                    className='form-control'
                                    value={name}
                                    onChange={event => setName(event.target.value)}
                                    onBlur={handleBlur}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                  />
                                </div>
                              ) : (cell.render('Cell'))}</td>
                          ))}
                        </tr>
                      </React.Fragment>
                    );
                  })}
                  {/* If measure array is empty, show input row */}
                  {measure.length === 0 && (
                    <tr>
                      <td colSpan={columns.length + 1}>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Enter a new unit name"
                            onKeyDown={handleKeyDown}
                          />
                          <div className="input-group">
                            <button
                              className="btn btn-success"
                              onClick={submitform}
                              disabled={!name}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {/* If addEmptyRow button is clicked, show empty row */}
                  {addEmptyRow && (
                    <tr>
                      <td colSpan={columns.length + 1}>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control border-0"
                            placeholder="Enter a new unit name"
                            onChange={event => setName(event.target.value)}
                            onBlur={handleBlur}
                            // onKeyDown={handleKeyDown}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                const newName = event.target.value;
                                if (newName.trim() !== '') {
                                  const emptyRow = { id: 'new', name: newName };
                                  setMeasure([...measure, emptyRow]);
                                  setAddEmptyRow(false);
                                }
                              }
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* Add button to show empty row */}
              <div className="mt-3 ">
                <button
                  className="btn btn-secondary"
                  onClick={() => setAddEmptyRow(true)}
                >
                  Add Row
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="col"></div>
      </div>
    </div>
    {deleteVisible && deleteContent()}
  </div></div>
  )
}

export default Tableformnew