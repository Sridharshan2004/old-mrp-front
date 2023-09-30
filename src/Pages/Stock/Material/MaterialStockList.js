import React, { useCallback, useState } from 'react'
import dataService from "../../../Service/dataService"
import { useEffect } from 'react'
import { useTable, useFilters, useSortBy } from 'react-table'

import Select from 'react-select';

const MaterialStockList = () => {

    const [order, setOrder] = useState('');
    const [stock, setStock] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [materialId, setMaterialId] = useState('');
    const [supplierId, setSupplierId] = useState('');    
    const [createdtime, setCreatedtime] = useState('');
    const [expectedtime, setExpectedtime] = useState('');
    const [listSupplier, setListSupplier] = useState([]);
    const [listMaterial, setListMaterial] = useState([]);
    const [materialStock, setMaterialStock] = useState([]);
    const [purchaseMaterial, setpurchaseMaterial] = useState([]);
    const [purchaseOrderModalVisible, setPurchaseOrderModalVisible] = useState(false);

    // SET EXPECTED TIME

    const initDate = () => {
        const currentDate = new Date();

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(currentDate.getDate() + 7);

        const formattedTodayDate = currentDate.toISOString().slice(0, 10);
        const formattedSevenDaysAgo = sevenDaysAgo.toISOString().slice(0, 10);
        setExpectedtime(formattedSevenDaysAgo);
        setCreatedtime(formattedTodayDate)
    }

    // GET MATERIAL INVENTORY
    const initMeasure = () => {
        dataService.getexe("material/material")
            .then(response => {
                console.log("MATERIAL DATA", response.data);
                if (response.data !== "") {
                    setMaterialStock(response.data)
                    setIsLoading(false)
                }
                else {
                    setMaterialStock([])
                }
            })
            .catch(error => {
                console.error("ERROR", error);
            })
    }

    useEffect(() => {
        initMeasure();
        initDate();
    }, [])

    // SET DATA TO POP FORM
    // GET DATA FROM ROW AND THEN SET DATA TO POP UP FORM
    const handleDelete = useCallback((item) => {
        setMaterialId(item.id);
        setSupplierId(item.supplier.id);
        initMaterial();
        initSupplier();
        initMaterialGet(item.id)
    }, [])

    const columns = React.useMemo(() => [
        { Header: 'Name', accessor: 'materialName', },
        { Header: 'Varaiant code', accessor: 'variantCode', },
        { Header: 'Category', accessor: 'category.categoryName', },
        {
            Header: 'Average cost',
            accessor: (row) => {
                const price = row.price;
                const quanity = row.quanity;
                if (price === 0 || quanity === 0) {
                    return (0).toFixed(2);
                }
                else {
                    return ((price * quanity) / quanity).toFixed(2);
                }
            },
        },
        {
            Header: 'Value in cost',
            accessor: (row) => ((row.price) * (row.quanity)).toFixed(2),
        },
        { Header: 'In stock', accessor: 'quanity', },
        // { Header: 'Expected', accessor: 'Expected', },
        // { Header: 'Committed', accessor: 'Committed', },
        // { Header: 'Missing quantity', accessor: 'missquantity', },
        {
            Header: 'Actions',
            Cell: ({ row }) => (
                <button onClick={() => { handleDelete(row.original); setPurchaseOrderModalVisible(true) }} className="btn btn-primary btn-sm"><i className='fa fa-square-plus'></i> Buy</button>)
        }
    ], [handleDelete]);


    // GET SUPPLIER
    const initSupplier = () => {
        const arr = [];
        dataService.getexe(`supplier/supplier`)
            .then(response => {
                console.log("SUCCESS- GET SUPPLIER", response.data);
                let result = response.data.list;
                result.map((opt) => {
                    return arr.push({ value: opt.id, label: opt.supplierName })
                })
                setListSupplier(arr)
            })
            .catch(error => {
                console.error("ERROR- GET SUPPLIER", error);
            })
    }
    // GET MATERIAL
    const initMaterial = () => {
        const arr = [];
        dataService.getexe(`material/material`)
            .then(response => {
                console.log("SUCCESS- GET MATERIAL ", response.data);
                let result = response.data;
                result.map((opt) => {
                    return arr.push({ value: opt.id, label: opt.materialName })
                })
                setListMaterial(arr)
            })
            .catch(error => {
                console.error("ERROR- GET MATERIAL", error);
            })
    }
    const initMaterialGet = (id) => {

        dataService.getexe(`material/material/${id}`)
            .then(response => {
                console.log("MATERIAL DATA", response.data);
                if (response.data !== "") {
                    setStock(response.data.quanity)
                    const modifidArray = {
                        materialId: response.data.id,
                        quanity: 1,
                        cost: response.data.price
                    };
                    console.log(modifidArray);
                    setpurchaseMaterial(prevArray => [...prevArray, modifidArray]);
                }
                else {
                    setStock(0)
                }
            })
            .catch(error => {
                console.error("ERROR", error);
            })
    }

    const handleChangeSupplier = (selectedOption) => {
        console.log("selectedOption", selectedOption)
        setSupplierId(selectedOption ? selectedOption.value : null);

    }
    const handleChangeMaterial = (selectedOption) => {
        console.log("selectedOption", selectedOption)
        setMaterialId(selectedOption ? selectedOption.value : null);
    }

    // CREATE NEW PO

    const purchaseOrderContent = () => {

        const submitform = (event) => {
            event.preventDefault();
            const postDate = {
                order: order,
                createdtime: createdtime,
                expectedtime: expectedtime,
                notes: null,
                supplierId: supplierId,
                locationId: 1,
                status: 0,
                purchaseMaterial: purchaseMaterial.map((item) => {
                    return {
                        materialId: item.materialId,
                        quanity: quantity,
                        cost: item.cost
                    }
                })
            }
            console.log("NEW PURCHASE ORDER", postDate);
            dataService.postexe("purchaseorder/purchaseorder", postDate)
                .then(response => {
                    console.log("SUCCESS- ADD PURCHASE", response.data);
                    setPurchaseOrderModalVisible(false);
                    setpurchaseMaterial([]);
                    setQuantity(1);
                })
                .catch(error => {
                    console.error("ERROR- ADD PURCHASE", error);
                })
        }

        return (
            <>
                <div className="modal-backdrop show"></div>
                <div className=" modal " style={{ display: 'block' }} tabIndex="-1" role="dialog" >
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div className="modal-content border-0">
                            <div className="modal-body p-0">
                                <div className="card border-0 p-sm-3 p-2 justify-content-center">
                                    <form onSubmit={submitform}>
                                        <div className="card-header pb-0 bg-white border-0 ">
                                            <div className="d-flex justify-content-between mb-3">
                                                <div><h5 className="modal-title">New Purchase Order</h5></div>
                                                <div><button type="button" className='btn btn-close' onClick={() => setPurchaseOrderModalVisible(false) > setpurchaseMaterial([]) > setQuantity(1)}></button></div>
                                            </div>
                                            <div className="col">
                                                <div className="row gx-3 mb-3">
                                                    <div className="col-md-6 ">
                                                        <label className="small mb-1 " htmlFor="imputMaterialName">Material</label>

                                                        <input
                                                            className="form-control fs-6"
                                                            id="imputMaterialName"
                                                            type="text"
                                                            placeholder="Type cost per hour"
                                                            value={listMaterial.find((option) => option.value === materialId)?.label || ''}
                                                            onChange={handleChangeMaterial}
                                                            readOnly
                                                            disabled
                                                        >
                                                        </input>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="small mb-1" htmlFor="inputCategory">Stock</label><br />

                                                        <input
                                                            className="form-control fs-6"
                                                            id="imputMaterialName"
                                                            type="text"
                                                            placeholder="Type cost per hour"
                                                            value={stock}
                                                            onChange={event => setStock(event.target.value)}
                                                            readOnly
                                                            disabled
                                                        >
                                                        </input>
                                                    </div>
                                                </div>
                                                <div className="row gx-3 mb-3">
                                                    <div className="col-md-6 ">
                                                        <label className="small mb-1 " htmlFor="imputMaterialName">Quantity</label>
                                                        <input
                                                            className="form-control fs-6"
                                                            id="imputMaterialName"
                                                            type="text"
                                                            placeholder="Type cost per hour"
                                                            value={quantity}
                                                            onChange={event => setQuantity(event.target.value)}
                                                        >
                                                        </input>
                                                    </div>
                                                </div>
                                                <div className="row gx-3 mb-3">
                                                    <div className="col-md-6 ">
                                                        <label className="small mb-1 " htmlFor="imputMaterialName">Supplier</label>
                                                        <Select
                                                            className='basic-single'
                                                            value={listSupplier.find((option) => option.value === supplierId)}
                                                            options={listSupplier}
                                                            filterOption={(option, searchText) =>
                                                                option.label.toLowerCase().includes(searchText.toLowerCase())}
                                                            placeholder={"Select operation"}
                                                            onChange={handleChangeSupplier}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row gx-3 mb-3">
                                                    <div className="col-md-6 ">
                                                        <label className="small mb-1 " htmlFor="imputMaterialName">Purchase Order#</label>
                                                        <input
                                                            className="form-control fs-6"
                                                            id="imputMaterialName"
                                                            type="text"
                                                            placeholder="PO-1 #"
                                                            onChange={event => setOrder(event.target.value)}
                                                            required
                                                        >
                                                        </input>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="small mb-1" htmlFor="inputCategory">Expected arrival</label>
                                                        <input
                                                            className="form-control fs-6"
                                                            id="imputMaterialName"
                                                            type="date"
                                                            placeholder="Type time"
                                                            value={expectedtime}
                                                            onChange={event => setExpectedtime(event.target.value)}
                                                        >
                                                        </input>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body px-sm-4 mb-2 pt-1 pb-0">
                                            <div className="row justify-content-end no-gutters">
                                                <div className="col-auto">
                                                    <button type="button" className="btn btn-light text-muted" onClick={() => setPurchaseOrderModalVisible(false) > setpurchaseMaterial([]) > setQuantity(1)} >Cancel</button>
                                                </div>
                                                <div className="col-auto">
                                                    <button type="submit" className="btn btn-primary px-4" >save</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = useTable({ columns, data: materialStock }, useFilters, useSortBy);

    return (
        <div className="container-fluid">
            <div className="row mt-4">
                <div className="col">
                    {isLoading ? (<p>Loading...</p>) : (
                        <div className="table-responsive">
                            <table {...getTableProps()} className="table table-bordered">
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
                                <tbody {...getTableBodyProps()}>
                                    {rows.length === 0 && (
                                        <tr>
                                            <td colSpan={columns.length}>No data available</td>
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
                    )}
                </div>
            </div>
            {purchaseOrderModalVisible && purchaseOrderContent()}
        </div>
    )
}

export default MaterialStockList