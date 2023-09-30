import React, { useCallback, useEffect, useState } from 'react'
import dataService from "../../Service/dataService"
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify'
import Select from 'react-select';


const Sales = () => {

  const [customerId, setCustomerId] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [createdDate, setCreatedDate] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [comments, setComments] = useState('');

  // const [quanitity, setQuanitity] = useState('');
  // const [price, setPrice] = useState('');
  // const [salesMaterialId, setSalesMaterialId] = useState('');
  const [totalProductUnits, setTotalProductUnits] = useState(0);
  const [totalProductCost, setTotalProductCost] = useState(0);
  const [locationId, setLocationId] = useState('');

  const [listProduct, setListProduct] = useState([]);
  const [listCustomer, setListCustomer] = useState([]);
  const [listLocation, setListLocation] = useState([]);

  const [salesOrderProduct, setSalesOrderProduct] = useState([
    { product: '', quantity: 1, price: 0 },
  ]);

  const navigate = useNavigate();

  const { salesId } = useParams();
  const isEditMode = !!salesId;

  // SUCCESS MESSAGE NOTIFICATION

  const showToastMessage = () => {
    toast.success('SUCCESS', {
      position: toast.POSITION.BOTTOM_RIGHT
    })
  }

  // OPTION

  const options = [
    { value: 0, label: 'NOT STARTED' },
    { value: 1, label: 'WORK IN PROGESS' },
    { value: 2, label: 'DONE' }
  ]

  // FORMAT DATE

  const formatDate = (data) => {
    const date = new Date(data);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }

  // SUMBIT FORM

  const submitform = (event) => {
    event.preventDefault();

    const updateSalesOrderProduct = salesOrderProduct.filter(
      (item) => item.product !== ''
    );

    const postDate = {
      customerId: customerId,
      deliveryDate: deliveryDate,
      createdDate: createdDate,
      name: name,
      status: status,
      locationId: locationId,
      comments: comments,
      orderProducts: updateSalesOrderProduct.map((item) => {
        return {
          id: item.id,
          productId: item.product.id,
          quantity: item.quantity,
          price: item.price
        }
      })
    }
    if (isEditMode) {

      console.log("UPDATE SALES ORDER", postDate);

      dataService.putexe(`salesorders/salesorders/${salesId}`, postDate)
        .then(response => {
          console.log("SUCCESS- UPDATE SALES ORDER", response.data);
          showToastMessage();
          navigate("/sell")
        })
        .catch(error => {
          console.error("ERROR- UPDATE SALES ORDER", error);
        })
    }
    else {
      console.log("NEW SALES ORDER", postDate);
      dataService.postexe("salesorders/salesorders", postDate)
        .then(response => {
          console.log("SUCCESS- ADD SALES ORDER", response.data);
          showToastMessage();
          navigate("/sell")
        })
        .catch(error => {
          console.error("ERROR- ADD SALES ORDER", error);
        })
    }
  }

  // GET CUSTOMER

  const initCustomer = () => {
    const arr = [];
    dataService.getexe(`customer/customer`)
      .then(response => {
        console.log("SUCCESS- GET CUSTOMER", response.data);
        let result = response.data.list;
        result.map((opt) => {
          const label = `${opt.customerName} - ${opt.companyName}`;
          // return arr.push({ value: opt.id, label: opt.customerName})
          return arr.push({ value: opt.id, label: label})
        })
        setListCustomer(arr)
      })
      .catch(error => {
        console.error("ERROR- GET CUSTOMER", error);
      })
  }

  // GET LOCATION

  const initLocation = () => {
    const arr = [];
    dataService.getexe(`location/location`)
      .then(response => {
        console.log("SUCCESS- GET LOCATION", response.data);
        let result = response.data.list;
        result.map((opt) => {
          return arr.push({ value: opt.id, label: opt.locationName })
        })
        setListLocation(arr)
      })
      .catch(error => {
        console.error("ERROR- GET LOCATION", error);
      })
  }

  //   GET PRODUCT

  const initProduct = () => {
    const arr = [];
    dataService.getexe(`product/product`)
      .then(response => {
        console.log("SUCCESS- GET PRODUCT", response.data);
        let result = response.data;
        result.map((opt) => {
          return arr.push({ value: opt.id, label: opt.productName })
        })
        setListProduct(arr)
      })
      .catch(error => {
        console.error("ERROR- GET PRODUCT", error);
      })
  }

  //   GET PRODUCT

  const initProductGetByID = async(id) => {
      try {
        const response = await dataService.getexe(`product/product/${id}`);
        console.log("SUCCESS- GET PRODUCT", response.data);
        return response.data
        
      } catch (error) {
        console.error("ERROR- GET PRODUCT", error);
      }
  }

  // GET SALES ORDER

  const initSalesOrder = useCallback(() => {

    dataService.getexe(`salesorders/salesorders/${salesId}`)
      .then(response => {
        console.log("GET MANUFACTURING ORDER BY ID", response.data);
        if (response.data !== null) {
          setName(response.data.name);
          setCustomerId(response.data.customer.id);
          setStatus(response.data.status);
          setLocationId(response.data.location.id);
          setCreatedDate(formatDate(response.data.createdDate));
          setDeliveryDate(formatDate(response.data.deliveryDate));
          setComments(response.data.comments);
          setSalesOrderProduct(response.data.salesOrderProduct);
        }
        else {

        }
      })
      .catch(error => {
        console.error("ERROR - GET SALES ORDER", error);
      })


  }, [salesId]);

  // useEffect

  useEffect(() => {
    initCustomer();
    initLocation();
    initProduct();
  }, []);

  useEffect(() => {

    // Calculate Product Total Cost & Unit
    const calculateProductTotal = (data) => {
      let totalCost = 0;
      let totalUnit = 0;
      data.forEach((item) => {
        const productCost = parseFloat(item.quantity) * parseFloat(item.price);
        const productUnit = parseFloat(item.quantity);
        totalCost += productCost;
        totalUnit += productUnit

      });
      setTotalProductCost(totalCost);
      setTotalProductUnits(totalUnit)
    };

    calculateProductTotal(salesOrderProduct);

  }, [salesOrderProduct])


  useEffect(() => {
    if (isEditMode) {
      initSalesOrder();
    }
  }, [initSalesOrder, isEditMode]);


  // ADD SALES ORDER ROW

  const addSalesOrderRow = () => {
    setSalesOrderProduct([...salesOrderProduct, { product: '', quantity: 1, price: 0 }]);
  };

  //  HANDLE CHANGE

  const handleSalesOrderRowChange = async (index, field, value) => {
    console.log(index, field, value);
    if (field === 'product') {
      const productData = await initProductGetByID(value.id);
      console.log(productData);
      const updatedRows = [...salesOrderProduct];
      updatedRows[index].price = productData.price;
      setSalesOrderProduct(updatedRows);
    }
    const updatedRows = [...salesOrderProduct];
    updatedRows[index][field] = value;
    setSalesOrderProduct(updatedRows);
  };

  const handleDeleteRow = async (index) => {
    const updatedRows = [...salesOrderProduct];
    const deletedRow = updatedRows.splice(index, 1)[0]; // Remove the row at the specified index
    setSalesOrderProduct(updatedRows);
    if (isEditMode && deletedRow.id) {
      console.log(deletedRow.id);
      const deleteProductData = await deleteform(deletedRow.id);
      console.log(deleteProductData)
    }
  }

  const handleChangeCustomer = (selectedOption) => {
    console.log("selectedOption", selectedOption)
    setCustomerId(selectedOption ? selectedOption.value : null);

  }

  const handleChangeLocation = (selectedOption) => {
    console.log("selectedOption", selectedOption)
    setLocationId(selectedOption ? selectedOption.value : null);

  }

  const handleChangeStatus = (selectedOption) => {
    console.log("selectedOption", selectedOption)
    setStatus(selectedOption ? selectedOption.value : null);

  }

  // DELETE CONTENT

  const deleteform = async(id) => {
      try {
        const response = await dataService.deleteexe(`salesorderproduct/salesorderproduct/${id}`);
        console.log("SUCCESS- DELETED SALES ORDER DATA", response.data);
        return response.data;
        
      } catch (error) {
        console.error("ERROR- DELETED SALES ORDER DATA", error);
      }
  }

  return (
    <div className="container-fluid m-1">
      <div><h6>Create Sales order</h6></div>
      <div className="row mb-5 text-muted">
        <div className="col">
          <form onSubmit={submitform}>
            <div className="row gx-3 mb-3">
              <div className="col-md-6 ">
                <label className="small mb-1 " htmlFor="inputContactNo">Customer Name</label>
                <Select
                  className='basic-single'
                  value={listCustomer.find((option) => option.value === customerId)}
                  options={listCustomer}
                  filterOption={(option, searchText) =>
                    option.label.toLowerCase().includes(searchText.toLowerCase())}
                  placeholder={"Select customer"}
                  onChange={handleChangeCustomer}
                />
              </div>
              <div className="col-md-6">
                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputContactNo">Delivery deadline</label>
                    <input
                      className="form-control fs-6"
                      id="inputContactNo"
                      type="date"
                      value={deliveryDate}
                      onChange={event => setDeliveryDate(event.target.value)}
                    >
                    </input>
                  </div>
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputContactNo">Created date</label>
                    <input
                      className="form-control fs-6"
                      id="inputContactNo"
                      type="date"
                      value={createdDate}
                      onChange={event => setCreatedDate(event.target.value)}
                    >
                    </input>
                  </div>
                </div>

              </div>
            </div>
            <div className="row gx-3 mb-3">
              <div className="col-md-6">
                <label className="small mb-1" htmlFor="inputContactNo">Sales Order #</label>
                <input
                  className="form-control fs-6"
                  id="inputContactNo"
                  type="text"
                  placeholder="SO-1"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  required
                >
                </input>
              </div>
              <div className="col-md-6">
                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputContactNo">Ship From</label>
                    <Select
                      className='basic-single'
                      value={listLocation.find((option) => option.value === locationId)}
                      options={listLocation}
                      filterOption={(option, searchText) =>
                        option.label.toLowerCase().includes(searchText.toLowerCase())}
                      placeholder={"Select Location"}
                      onChange={handleChangeLocation}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputContactNo">Status</label>
                    <Select
                      className='basic-single'
                      value={options.find((option) => option.value === status)}
                      options={options}
                      filterOption={(option, searchText) =>
                        option.label.toLowerCase().includes(searchText.toLowerCase())}
                      placeholder={"Select status"}
                      onChange={handleChangeStatus}
                    />
                  </div>
                </div>
              </div>
            </div>

            <table className='table table-bordered mt-4'>
              <thead className='table-active'>
                <tr>
                  <td><span className='text-muted'>Item</span></td>
                  <td><span className='text-muted'>Quantity</span></td>
                  <td><span className='text-muted'>Price per uint</span></td>
                  <td><span className='text-muted'>Total price</span></td>
                  <td><span className='text-muted'>Sales items</span></td>
                  <td><span className='text-muted'>Ingredients</span></td>
                  <td><span className='text-muted'>Production</span></td>
                  <td><span className='text-muted'></span></td>
                </tr>
              </thead>
              <tbody>
                {salesOrderProduct.map((item, index) => (
                  <tr key={index}>

                    <td className='p-0'>
                      <Select
                        styles={{
                          control: provided => ({
                            ...provided,
                            border: 'none', // Remove the border
                            boxShadow: 'none',// Remove the box shadow
                          }),
                          indicatorSeparator: provided => ({
                            ...provided,
                            display: 'none', // Hide the indicator separator
                          }),
                          dropdownIndicator: provided => ({
                            ...provided,
                            display: 'none', // Hide the dropdown indicator
                          }),
                        }}
                        className='basic-single'
                        value={listProduct.find((option) => option.value === (item.product === null ? 0 : item.product.id))}
                        options={listProduct}
                        filterOption={(option, searchText) =>
                          option.label.toLowerCase().includes(searchText.toLowerCase())}
                        placeholder={"Select Item"}
                        onChange={e => handleSalesOrderRowChange(index, 'product', { ...item.product, id: e.value })}
                      />
                    </td>

                    <td>
                      <input
                        type='text'
                        value={item.quantity}
                        onChange={e => handleSalesOrderRowChange(index, 'quantity', e.target.value)}
                      />
                    </td>

                    <td>
                      <input
                        type='text'
                        value={item.price}
                        onChange={e => handleSalesOrderRowChange(index, 'price', e.target.value)}
                      />
                    </td>

                    <td>
                      <span className='p-0'>{item.price * item.quantity}</span>
                    </td>

                    <td></td>

                    <td></td>

                    <td></td>

                    <td>
                      <button className="btn btn-sm text-secondary p-0" onClick={() => handleDeleteRow(index)}><i className='fa fa-trash'></i></button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn btn-sm btn-secondary opacity-75" type="button" onClick={addSalesOrderRow}>+ Add Row</button>

            <div className='row'>
              <div className='col-sm-7'></div>
              <div className='col-sm-5'>
                <hr className='border-3' />
                <table className='table'>
                  <tbody>
                    <tr>
                      <td>Total Units</td>
                      <td className='text-end'>{totalProductUnits.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Total Cost</td>
                      <td className='text-end'>{totalProductCost.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <table className='table table-bordered mt-4'>
              <thead className='table-active'>
                <tr>
                  <td><span className='text-muted'>Additional info</span></td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td >
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control border-0"
                        placeholder="Eg: Type comment here"
                        value={comments}
                        onChange={event => setComments(event.target.value)}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div>
              <button className="btn btn-primary me-2" type="submit">{isEditMode ? 'Update' : 'Save'}</button>
              <Link to="/sell" className="btn btn-secondary ">cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Sales