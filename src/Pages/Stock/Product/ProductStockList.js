import React, { useCallback, useState } from 'react'
import dataService from "../../../Service/dataService"
import { useEffect } from 'react'
// import { Link } from 'react-router-dom'
import { useTable, useFilters, useSortBy } from 'react-table'

const ProductStockList = () => {
    const [productStock, setProductStock] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [manufacturingOrderModalVisible, setManufacturingOrderModalVisible] = useState(false);
    const [productId, setProductId] = useState('');
    const [createdDate, setCreatedDate] = useState('');
    const [productionDeadline, setProductionDeadline] = useState('');
    const [plannedQuantity, setPlannedQuantity] = useState(1);
    const [listProduct, setListProduct] = useState([]);
    const [manufacturingOrder, setManufacturingOrder] = useState('');
    const [stock, setStock] = useState('');
    const [listProductBOM, setListProductBOM] = useState([]);
    const [listProductOperation, setListProductOperation] = useState([]);

    // SET EXPECTED TIME

    const initDate = () => {
        const currentDate = new Date();

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(currentDate.getDate() + 7);

        const formattedTodayDate = currentDate.toISOString().slice(0, 10);
        const formattedSevenDaysAgo = sevenDaysAgo.toISOString().slice(0, 10);
        setProductionDeadline(formattedSevenDaysAgo);
        setCreatedDate(formattedTodayDate)
    }

    // GET PRODUCT INVENTORY

    const initMeasure = () => {
        dataService.getexe("product/product")
            .then(response => {
                console.log("PRODUCT DATA", response.data);
                if (response.data !== "") {
                    setProductStock(response.data)
                    setIsLoading(false)
                }
                else {
                    setProductStock([])
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

        // PRODUCT BOM

        const initProductBOM = useCallback((id) => {

            dataService.getexe(`bom/product/${id}/bom`)
                .then(response => {
                    console.log("SUCCESS - GET PRODUCT BOM DATA", response.data);
                    if (response.data !== '') {
    
                        const modifidArray = response.data.map(item => {
                            const availabilityStatus =
                                ((item.quantity * plannedQuantity) <= item.material.quanity) ? 1: 0;
    
                            return {
                                cost: item.material.price,
                                notes: '',
                                material: item.material,
                                total_actual_quantity: "",
                                planned_quantity_per_unit: item.quantity,
                                ingredient_availability: availabilityStatus,
    
                            }
                        })
                        setListProductBOM(modifidArray)
                    }
                    else {
                        setListProductBOM([]);
                    }
                })
                .catch(error => {
                    console.error("ERROR- GET PRODUCT BOM DATA", error);
                })
        }, [plannedQuantity])
    
        // PRODUCT OPERATION
    
        const initProductOperation = useCallback((id) => {
    
            dataService.getexe(`productoperation/product/${id}/productoperation`)
                .then(response => {
                    console.log("SUCCESS- GET PRODUCT OPERATION", response.data);
    
                    if (response.data !== '') {
                        const modifidArray = response.data.map(item => {
                            return {
                                operation: item.operation,
                                resource: item.resource,
                                user: null,
                                status: 0,
                                cost_per_hour: item.cost,
                                total_actual_time: "",
                                total_actual_cost: "",
                                planned_cost_per_unit: (item.cost * (timeToDecimalSeconds(item.time) / 3600)),
                                planned_time_per_unit: item.time,
    
                            }
                        })
                        setListProductOperation(modifidArray);
                    }
                    else {
                        setListProductOperation([]);
                    }
                })
                .catch(error => {
                    console.error("ERROR- GET PRODUCT OPERATION", error);
                })
        }, []);
    

    // TIME IN TO SECOND

    const timeToDecimalSeconds = (data) => {
        const [hours, minutes, seconds] = data.split(':').map(Number);
        const totalSecond = hours * 3600 + minutes * 60 + seconds;
        return totalSecond;
    }

    // SET DATA TO POP FORM
    // GET DATA FROM ROW AND THEN SET DATA TO POP UP FORM
    const handleDelete = useCallback((item) => {
        console.log("Delete", item);
        console.log("Delete", item.id);
        setProductId(item.id);
        initProduct();
        initProductGet(item.id);
        initProductBOM(item.id);
        initProductOperation(item.id);
    }, [initProductBOM,initProductOperation])

    const columns = React.useMemo(() => [
        { Header: 'Name', accessor: 'productName', },
        { Header: 'Varaiant code', accessor: 'variantsCode', },
        { Header: 'Category', accessor: 'category.categoryName', },
        {
            Header: 'Average cost',
            accessor: (row) => {
                const price = row.price;
                const quantity = row.quantity;
                if (price === 0 || quantity === 0) {
                    return (0).toFixed(2);
                }
                else {
                    return ((price * quantity) / quantity).toFixed(2);
                }
            },
        },
        {
            Header: 'Value in cost',
            accessor: (row) => ((row.price) * (row.quantity)).toFixed(2),
        },
        { Header: 'In stock', accessor: 'quantity', },
        // { Header: 'Expected', accessor: 'Expected', },
        // { Header: 'Committed', accessor: 'Committed', },
        // { Header: 'Missing quantity', accessor: 'missquantity', },
        {
            Header: 'Actions',
            Cell: ({ row }) => (
                <button onClick={() => handleDelete(row.original) > setManufacturingOrderModalVisible(true)} className="btn btn-primary btn-sm"><i className='fa fa-square-plus'></i> Make</button>)
        }
    ], [handleDelete]);

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

    const initProductGet = (id) => {

        dataService.getexe(`product/product/${id}`)
            .then(response => {
                console.log("PRODUCT DATA", response.data);
                if (response.data !== "") {
                    console.log(response.data.quantity);
                    setStock(response.data.quantity)
                }
                else {
                    setStock(0)
                }
            })
            .catch(error => {
                console.error("ERROR", error);
            })
    }

        // UPDATE PRODUCT BOM

        const updateProductBOM = useCallback((qty) => {

            const updateBOM = listProductBOM.map(item => {
    
                const availabilityStatus =
                    ((item.planned_quantity_per_unit * qty) <= item.material.quanity) ? 1 : 0 ;
    
                return {
                    ...item,
                    ingredient_availability: availabilityStatus,
                }
            })
            console.log(updateBOM);
            setListProductBOM(updateBOM);
    
        }, [listProductBOM])

    const handleChangeProduct = (selectedOption) => {
        console.log("selectedOption", selectedOption)
        setProductId(selectedOption ? selectedOption.value : null);
    }

    const handleChangePlannedQuantity = (selectedOption) => {
        setPlannedQuantity(selectedOption ? selectedOption.target.value : null)
        updateProductBOM(selectedOption.target.value);
    }


    const manufacturingOrderContent = () => {

        const submitform = (event) => {
            event.preventDefault();
            const postDate = {
                productId: productId,
                status: 0,
                plannedQuantity: plannedQuantity,
                createdDate: createdDate,
                manufacturingOrder: manufacturingOrder,
                productionDeadline: productionDeadline,
                is_linked_to_sales_order: false,
                manufacturingOrderIngredientRequests: listProductBOM.map(item => {
                    return {
                        id: item.id,
                        cost: item.cost,
                        notes: item.notes,
                        material_id: item.material.id,
                        total_actual_quantity: item.total_actual_quantity,
                        planned_quantity_per_unit: item.planned_quantity_per_unit,
                        ingredient_availability: item.ingredient_availability,
                    };
                }),
                manufacturingOrderOperationRequests: listProductOperation.map(item => {
                    return {
                        id: item.id,
                        status: item.status,
                        cost_per_hour: item.cost_per_hour,
                        total_actual_time: item.total_actual_time,
                        total_actual_cost: item.total_actual_cost,
                        planned_cost_per_unit: item.planned_cost_per_unit,
                        planned_time_per_unit: item.planned_time_per_unit,
                        resource_id: item.resource.id,
                        operation_id: item.operation.id,
                        user_id: (item.user === null) ? null : item.user.id,
                    }
                })
            }
            console.log("NEW MANUFACTURING ORDER", postDate);
            dataService.postexe("manufacturingorder/manufacturingorder", postDate)
                .then(response => {
                    console.log("SUCCESS- ADD MANUFACTURING ORDER", response.data);

                    setManufacturingOrderModalVisible(false);
                    setListProductBOM([]);
                    setListProductOperation([]); 
                    setPlannedQuantity(1);
                })
                .catch(error => {
                    console.error("ERROR- ADD MANUFACTURING ORDER", error);
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
                                                <div><h5 className="modal-title">New Manufacturing Order</h5></div>
                                                <div><button type="button" className='btn btn-close' onClick={() => setManufacturingOrderModalVisible(false) > setListProductBOM([])> setListProductOperation([]) > setPlannedQuantity(1)} ></button></div>
                                            </div>
                                            <div className="col">
                                                <div className="row gx-3 mb-3">
                                                    <div className="col-md-6 ">
                                                        <label className="small mb-1 " htmlFor="imputMaterialName">Produc</label>

                                                        <input
                                                            className="form-control fs-6"
                                                            id="imputMaterialName"
                                                            type="text"
                                                            placeholder="Type cost per hour"
                                                            value={listProduct.find((option) => option.value === productId)?.label || ''}
                                                            onChange={handleChangeProduct}
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
                                                            value={plannedQuantity}
                                                            // onChange={event => setPlannedQuantity(event.target.value)}
                                                            onChange={handleChangePlannedQuantity}
                                                        >
                                                        </input>
                                                    </div>
                                                    <div className="col-md-6 ">
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
                                                        <label className="small mb-1 " htmlFor="imputMaterialName">Manufacturing Order#</label>
                                                        <input
                                                            className="form-control fs-6"
                                                            id="imputMaterialName"
                                                            type="text"
                                                            placeholder="MO-1 #"
                                                            onChange={event => setManufacturingOrder(event.target.value)}
                                                            required
                                                        >
                                                        </input>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body px-sm-4 mb-2 pt-1 pb-0">
                                            <div className="row justify-content-end no-gutters">
                                                <div className="col-auto">
                                                    <button type="button" className="btn btn-light text-muted" onClick={() => setManufacturingOrderModalVisible(false) > setListProductBOM([])> setListProductOperation([]) > setPlannedQuantity(1)}>Cancel</button>
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

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = useTable({ columns, data: productStock }, useFilters, useSortBy);

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
            {manufacturingOrderModalVisible && manufacturingOrderContent()}
        </div>
    )
}

export default ProductStockList