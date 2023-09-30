import React, { useState } from 'react'
import Select from 'react-select';
const ProdcuctPage = () => {
    const [productType, setProductType] = useState('make');
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [variantsCode, setVariantsCode] = useState('');
    const [product_BOM, setProduct_BOM] = useState([
        { item: '', quantity: '0', notes: '', stockCost: '0' },
    ]);

    const handleSalesOrderRowChange = (index, field, value) => {
        const updatedRows = [...product_BOM];
        updatedRows[index][field] = value;
        setProduct_BOM (updatedRows);
      };

      const addSalesOrderRow = () => {
        setProduct_BOM([...product_BOM, { item: '', quantity: '0', notes: '', stockCost: '0' }]);
      };
    return (
        <div className="container-fluid m-1">
            <div className="row mt-3 mb-5 text-muted">
                <div className="col">
                    <form >
                        <div className="row gx-3 mb-3">
                            <div className="col-md-6 ">
                                <label className="small mb-1 " htmlFor="inputProductName">Product Name</label>
                                <input
                                    className="form-control fs-6"
                                    id="inputProductName"
                                    type="text"
                                    placeholder="Type product Name"
                                    value={productName}
                                    onChange={event => setProductName(event.target.value)}
                                >
                                </input>
                            </div>
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputCategory">Category</label>
                                <Select
                                    className='basic-single'
                                // value={listCategory.find((option) => option.value === categoryId)}
                                // options={listCategory}
                                // filterOption={(option, searchText) =>
                                //     option.label.toLowerCase().includes(searchText.toLowerCase())}
                                // placeholder={"Select Category"}
                                // onChange={event => setCategoryId(event.value)}
                                />
                            </div>
                        </div>
                        <div className="row gx-3 mb-3">
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputMeasure">Units of measure</label>
                                <Select
                                    className='basic-single'
                                // value={listMeasure.find((option) => option.value === measureId)}
                                // options={listMeasure}
                                // filterOption={(option, searchText) =>
                                //     option.label.toLowerCase().includes(searchText.toLowerCase())}
                                // placeholder={"Select Category"}
                                // onChange={event => setMeasureId(event.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="small mb-2" htmlFor="inputContactNo"> Product</label><br></br>
                                <div className="form-check checkbox-xl form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="checkbox" id="inlineCheckbox1"
                                        value="make"
                                        checked={productType === 'make'}
                                        onChange={event => setProductType(event.target.value)}
                                    />
                                    <label className="form-check-label" htmlFor="inlineCheckbox1">I make this product</label>
                                </div>
                                <div className="form-check checkbox-xl form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="checkbox" id="inlineCheckbox2"
                                        value="buy"
                                        checked={productType === 'buy'}
                                        onChange={event => setProductType(event.target.value)}
                                    />
                                    <label className="form-check-label" htmlFor="inlineCheckbox2">I buy this product</label>
                                </div>
                            </div>
                        </div>

                        <table className='table table-bordered mt-4'>
                            <thead className='table-active'>
                                <tr>
                                    <td><span className='text-muted'>Variant code / SKU</span></td>
                                    <td><span className='text-muted'>Default sales price</span></td>
                                    <td><span className='text-muted'>Ingredients cost</span></td>
                                    <td><span className='text-muted'>operation cost</span></td>
                                    <td><span className='text-muted'>In stock</span></td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td >
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control border-0 p-0"
                                                placeholder="Eg: P-1, M-1"
                                                value={variantsCode}
                                                onChange={event => setVariantsCode(event.target.value)}
                                            />
                                        </div>
                                    </td>
                                    <td >
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control border-0 p-0"
                                                placeholder="Type sales price "
                                                value={price}
                                                onChange={event => setPrice(event.target.value)}
                                            />
                                        </div>
                                    </td>
                                    <td >
                                        <p className='m-0'>0 INR</p>
                                    </td>
                                    <td >
                                        <p className='m-0'>0 INR</p>
                                    </td>
                                    <td >
                                        <p className='m-0'>0 pcs</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p>Add Bom</p>
                        <table className='table table-bordered mt-4'>
                            <thead className='table-active'>
                                <tr>
                                    <td><span className='text-muted'>Item</span></td>
                                    <td><span className='text-muted'>Quantity</span></td>
                                    <td><span className='text-muted'>Notes </span></td>
                                    <td><span className='text-muted'>Stock Cost</span></td>
                                </tr>
                            </thead>
                            <tbody>
                                {product_BOM.map((row, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            className='form-control border-0 p-0'
                                            type="text"
                                            value={row.id}
                                            onChange={(e) =>handleSalesOrderRowChange(index, 'item', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className='form-control border-0 p-0'
                                            type="text"
                                            value={row.id}
                                            onChange={(e) =>handleSalesOrderRowChange(index, 'quantity', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className='form-control border-0 p-0'
                                            type="text"
                                            value={row.id}
                                            onChange={(e) =>handleSalesOrderRowChange(index, 'notes', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className='form-control border-0 p-0'
                                            type="text"
                                            value={row.id}
                                            onChange={(e) =>handleSalesOrderRowChange(index, 'stockCost', e.target.value)}
                                        />
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                        <button type="button" onClick={addSalesOrderRow}>Add Row</button>
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
                                                placeholder="Notes"
                                                value={description}
                                                onChange={event => setDescription(event.target.value)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <button className="btn btn-primary me-2" type="submit">Save'</button>
                            <button className="btn btn-secondary" type="reset">cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProdcuctPage