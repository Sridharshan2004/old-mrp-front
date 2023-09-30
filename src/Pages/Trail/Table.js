import React, { useState } from 'react';
import { useTable } from 'react-table';
// import EditableCell from 'react-editable-cell';

const Table = () => {

    const data = React.useMemo(() => [
        { id: 1, name: 'John Doe', age: 30, email: 'john.doe@example.com' },
        { id: 2, name: 'Jane Smith', age: 25, email: 'jane.smith@example.com' },
        { id: 3, name: 'Bob Johnson', age: 35, email: 'bob.johnson@example.com' },
    ], []);

    const columns = React.useMemo(() => [
        { Header: 'ID', accessor: 'id' },
        { Header: 'Name', accessor: 'name' },
        { Header: 'Age', accessor: 'age' },
        { Header: 'Email', accessor: 'email' },
    ], []);

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
    });

    const EditableCell = ({ value: initialValue, row, column, updateCell }) => {
        const [isEditing, setIsEditing] = useState(false);
        const [value, setValue] = useState(initialValue);
      
        const handleInputChange = (e) => setValue(e.target.value);
        
      
        const handleKeyPress = (e) => {
          if (e.key === 'Enter') {
            setIsEditing(false);
            updateCell(row.index, column.id, value);
          }
        };
      
        return isEditing ? (
          <input
            value={value}
            onChange={handleInputChange}
            onBlur={() => setIsEditing(false)}
            onKeyPress={handleKeyPress}
            style={{ width: '100%' }}
            autoFocus
          />
        ) : (
          <div onClick={() => setIsEditing(true)}>{value}</div>
        );
      };

    const updateCell = (rowIndex, columnId, value) => {
        const updatedRows = [...rows];
        updatedRows[rowIndex].cells[columnId].value = value;
        // You may want to update the 'data' array with the updatedRows here, depending on your use case.
    };


    return (
        <div> 
            <div className="table-responsive">
               <table {...getTableProps()} className="table table-bordered">
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                                <td {...cell.getCellProps()}>
                                    <EditableCell
                                        value={cell.value}
                                        row={row}
                                        column={cell.column}
                                        updateCell={updateCell}
                                    />
                                </td>
                            ))}
                        </tr>
                    );
                })}
                                    {/* {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })} */}
            </tbody>
        </table></div></div>
    )
}

export default Table