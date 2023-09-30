import React, { useState } from 'react';
import axios from 'axios';

const SalesOrderForm = () => {
  const [id, setId] = useState('');
  const [customer_id, setCustomer_id] = useState('');
  const [order_no, setOrder_no] = useState('');
  const [order_created_date, setOrder_created_date] = useState('');
  const [delivery_date, setDelivery_date] = useState('');
  const [location_id, setLocation_id] = useState('');
  const [status, setStatus] = useState('');
  const [total, setTotal] = useState(0);
  const [additional_info, setAdditional_info] = useState('');
  // const [sales_order_rows, setSales_order_rows] = useState([]);
  const [sales_order_rows, setSales_order_rows] = useState([
    { id: '', quantity: '0', variant_id: '', price_per_unit: '0', total: '0' },
  ]);

  const handleSalesOrderRowChange = (index, field, value) => {
    const updatedRows = [...sales_order_rows];
    updatedRows[index][field] = value;
    setSales_order_rows(updatedRows);
  };

  const addSalesOrderRow = () => {
    setSales_order_rows([...sales_order_rows, { id: '', quantity: 0, variant_id: '', price_per_unit: 0, total: 0 }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // const isEmptyRow = sales_order_rows.some(
    //   (row) =>
    //     row.id === '' &&
    //     row.quantity === 0 &&
    //     row.variant_id === '' &&
    //     row.price_per_unit === 0 &&
    //     row.total === 0
    // );
    // const isEmptyRow = ( 
    //   sales_order_rows[0].id === ""&& 
    //   sales_order_rows[0].quantity === '0' && 
    //   sales_order_rows[0].variant_id === ""&& 
    //   sales_order_rows[0].price_per_unit === '0' && 
    //   sales_order_rows[0].total === '0'
    // );

    // const updatedSalesOrderRows = isEmptyRow ? [] : sales_order_rows;
    const updatedSalesOrderRows = sales_order_rows.filter(
      (row) => row.quantity !== '' || row.variant_id !== '' || row.price_per_unit !== '' || row.total !== ''
    );

    const updatedSalesOrderRowsTwo = sales_order_rows.filter(
      (row) => row.quantity !== '' && row.variant_id !== '' && row.price_per_unit !== '' && row.total !== ''
    );
    const updatedSalesOrderRowsThree = sales_order_rows.filter(
      (row) =>  row.variant_id !== '' 
    );

    const formData = {
      id,
      customer_id,
      order_no,
      order_created_date,
      delivery_date,
      location_id,
      status,
      total,
      additional_info,
      sales_order_rows,
      updatedSalesOrderRows,
      updatedSalesOrderRowsTwo,
      updatedSalesOrderRowsThree
    };
    console.log(formData)
    axios.post('/sales-orders', formData)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Sales Order ID:
        <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
      </label>
      <label>
        Customer ID:
        <input type="text" value={customer_id} onChange={(e) => setCustomer_id(e.target.value)} />
      </label>
      <label>
        Order Number:
        <input type="text" value={order_no} onChange={(e) => setOrder_no(e.target.value)} />
      </label>
      <label>
        Order Created Date:
        <input type="datetime-local" value={order_created_date} onChange={(e) => setOrder_created_date(e.target.value)} />
      </label>
      <label>
        Delivery Date:
        <input type="datetime-local" value={delivery_date} onChange={(e) => setDelivery_date(e.target.value)} />
      </label>
      <label>
        Location ID:
        <input type="text" value={location_id} onChange={(e) => setLocation_id(e.target.value)} />
      </label>
      <label>
        Status:
        <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} />
      </label>
      <label>
        Total:
        <input type="number" value={total} onChange={(e) => setTotal(Number(e.target.value))} />
      </label>
      <label>
        Additional Info:
        <input type="text" value={additional_info} onChange={(e) => setAdditional_info(e.target.value)} />
      </label>

      {/* Input fields for sales_order_rows */}
      <div>
        <h3>Sales Order Rows:</h3>
        {/* {sales_order_rows.map((row, index) => (
          <div key={index}>
            <label>
              Row ID:
              <input type="text" value={row.id} onChange={(e) => handleSalesOrderRowChange(index, 'id', e.target.value)} />
            </label>
            <label>
              Quantity:
              <input type="number" value={row.quantity} onChange={(e) => handleSalesOrderRowChange(index, 'quantity', Number(e.target.value))} />
            </label>
            <label>
              Variant ID:
              <input type="text" value={row.variant_id} onChange={(e) => handleSalesOrderRowChange(index, 'variant_id', e.target.value)} />
            </label>
            <label>
              Price per Unit:
              <input type="number" value={row.price_per_unit} onChange={(e) => handleSalesOrderRowChange(index, 'price_per_unit', Number(e.target.value))} />
            </label>
            <label>
              Total:
              <input type="number" value={row.total} onChange={(e) => handleSalesOrderRowChange(index, 'total', Number(e.target.value))} />
            </label>
          </div>
        ))} */}

<table>
          <thead>
            <tr>
              <th>Row ID</th>
              <th>Quantity</th>
              <th>Variant ID</th>
              <th>Price per Unit</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {sales_order_rows.map((row, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={row.id}
                    onChange={(e) =>
                      handleSalesOrderRowChange(index, 'id', e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.quantity}
                    onChange={(e) =>
                      handleSalesOrderRowChange(
                        index,
                        'quantity',
                        Number(e.target.value)
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.variant_id}
                    onChange={(e) =>
                      handleSalesOrderRowChange(
                        index,
                        'variant_id',
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.price_per_unit}
                    onChange={(e) =>
                      handleSalesOrderRowChange(
                        index,
                        'price_per_unit',
                        Number(e.target.value)
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.total}
                    onChange={(e) =>
                      handleSalesOrderRowChange(
                        index,
                        'total',
                        Number(e.target.value)
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <button type="button" onClick={addSalesOrderRow}>Add Row</button>
      </div>

      <button type="submit">Create Sales Order</button>
    </form>
  );
};

export default SalesOrderForm;
