import React from 'react'
import { useTable, useSortBy } from 'react-table'

const SortTable = ({ columns, data, onDelete }) => {

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = useTable({ columns, data }, useSortBy);
    return (
        <div className="table-responsive">
            {/* {data === null ? (<div> No data</div>):( */}
            <table {...getTableProps()} className="table table-bordered">
                <thead>
                    {headerGroups.map(headerGroups => (
                        <tr {...headerGroups.getFooterGroupProps()}>
                            {headerGroups.headers.map((column) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                    </span>
                                </th>
                            ))}
                            {onDelete && <th>Action</th>}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={columns.length + 1}> No data available</td>
                        </tr>
                    )}
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                ))}
                                {onDelete && (
                                    <td><button onClick={() => console.log("CLICKED")} className="btn btn-secondary"><i className='fa fa-trash'></i></button></td>
                                )}
                            </tr>
                        );
                    })}
                    
                </tbody>
            </table>
            {/* )} */}
        </div>
        
    )
}

export default SortTable