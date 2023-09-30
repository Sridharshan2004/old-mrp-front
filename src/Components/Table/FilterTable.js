import React from 'react'
import GlobalFilter from './Filter/GlobalFilter'

const FilterTable = () => {

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state, setGlobalFilter, } = useTable({ columns, data }, useGlobalFilter, useSortBy);
    const { globalFilter } = state

    return (
        <div>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <table {...getTableProps()} className="table table-bordered">
                <thead>
                    {headerGroups.map(headerGroups => (
                        <tr {...headerGroups.getFooterGroupProps()}>
                            {headerGroups.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={columns.length}> No data available</td>
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
    )
}

export default FilterTable