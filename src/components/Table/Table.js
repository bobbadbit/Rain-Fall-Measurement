import React from 'react';
import { useTable, useFilters } from 'react-table';
import defaultColumnFilter from '../DefaultFilter';
import { Link } from 'react-router-dom';

function MyTable({ columns, data }) {
  const defaultColumn = React.useMemo(
    () => ({
      Filter: defaultColumnFilter,
    }),
    []
  );

  console.log(data);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        defaultColumn,
        data,
      },
      useFilters
    );

  const getColor = (index, value) => {
    var className = '';
    if (index === 4 ) {
      if(parseInt(value) >= 0 && parseInt(value) < 100)
      {
        className = "bg-success + bg-gradient";
      }
      else if (parseInt(value) > 100 && parseInt(value) < 200)
      {
        className = "bg-warning + bg-gradient";
      }
      else{
        className = "bg-danger + bg-gradient";
      }
    }
    if (index === 3 ) {
      if(parseInt(value) >= 0 && parseInt(value) < 100)
      {
        className = "bg-success + bg-gradient";
      }
      else if (parseInt(value) > 100 && parseInt(value) < 400)
      {
        className = "bg-warning + bg-gradient";
      }
      else{
        className = "bg-danger + bg-gradient";
      }
    }
    return className;
  };

  const renderColumn = (column) => {
    return (
      <th {...column.getHeaderProps()} className="align-middle ">
        {column.render('Header')}
        <div>{column.canFilter ? column.render('Filter') : null}</div>
      </th>
    );
  };

  // Render the UI for your table
  return (
    <table {...getTableProps()} className="table table-bordered">
      <thead className="table-light ">
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => renderColumn(column))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.length ? (
          rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  return cell.value === 'Xem' ? (
                    <td {...cell.getCellProps()} className="align-middle">
                      <Link to="/Details" state={'gmail'}>
                        {cell.render('Cell')}
                      </Link>
                    </td>
                  ) : (
                    <td
                      {...cell.getCellProps()}
                      className={`align-middle + ${getColor(
                        index,
                        cell.value
                      )}`}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })
        ) : (
          <td className="text-center p-4" colSpan={100}>
            No data
          </td>
        )}
      </tbody>
    </table>
  );
}

export default MyTable;
