import React, { useCallback, useEffect, useState } from 'react'
import dataService from "../../Service/dataService"
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify'
import Select from 'react-select';

const Manfactoder = () => {
    const [status, setstatus] = useState('');
    const [productId, setProductId] = useState('');
    const [createdDate, setCreatedDate] = useState('');
    const [listProduct, setListProduct] = useState([]);
    const [listProductBOM, setListProductBOM] = useState([]);
    // const [listProductBOMM, setListProductBOMM] = useState([]);
    const [actualQuantity, setActualQuantity] = useState('');
    const [plannedQuantity, setPlannedQuantity] = useState(1);
    const [totalMaterialCost, setTotalMaterialCost] = useState(0);
    const [totalOperationCost, setTotalOperationCost] = useState(0);
    const [manufacturingOrder, setManufacturingOrder] = useState('');
    const [productionDeadline, setProductionDeadline] = useState('');
    const [listProductOperation, setListProductOperation] = useState([]);

    const { manufacturingOrderId } = useParams();
    const isEditMode = !!manufacturingOrderId;

    const calculateOperationTotalCost = useCallback((data) => {
        let totalCost = 0;
        data.forEach((item) => {
            const [hours, minutes, seconds] = item.time.split(':').map(Number);
            const decimalHours = hours + (minutes / 60) + (seconds / 3600);
            const operationCost = decimalHours * item.cost * plannedQuantity;
            totalCost += operationCost
        });
        setTotalOperationCost(totalCost);
    }, [plannedQuantity]);

    const calculateMaterialTotalCost = useCallback((data) => {
        let totalCost = 0;
        data.forEach((item) => {
            const materialCost = item.material.price * plannedQuantity;
            totalCost += materialCost;
        });
        setTotalMaterialCost(totalCost);
    }, [plannedQuantity]);

    const formatDate = (data) => {
        const date = new Date(data);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate
    }

    const option = [
        { value: 1, label: 'NOT STARTED' },
        { value: 2, label: 'WORK IN PROGESS' },
        { value: 3, label: 'DONE' }
    ]

    const showToastMessage = () => {
        toast.success('SUCCESS', {
            position: toast.POSITION.BOTTOM_RIGHT
        })
    }

    const navigate = useNavigate();

    const submitform = (event) => {
        event.preventDefault();
        const postDate = {
            productId: productId,
            status: status,
            plannedQuantity: plannedQuantity,
            createdDate: createdDate,
            manufacturingOrder: manufacturingOrder,
            productionDeadline: productionDeadline,
            listProductBOM: listProductBOM.map(item => {
                return {
                    // ...item,
                    
                    cost: item.cost,
                    notes: item.notes,
                    material_id:item.material.id,
                    total_actual_quantity: item.total_actual_quantity,
                    planned_quantity_per_unit: item.planned_quantity_per_unit,
                    ingredient_availability: item.ingredient_availability ,
                };
            }),
            listProductOperation: listProductOperation
        }

        if (isEditMode) {
            console.log("UPDATE MANUFACTURING ORDER", postDate);
            dataService.putexe(`manufacturingorder/manufacturingorder/${manufacturingOrderId}`, postDate)
                .then(response => {
                    console.log("SUCCESS- UPDATE MANUFACTURING ORDER", response.data);
                    showToastMessage();
                    navigate("/manufacturingorders")
                })
                .catch(error => {
                    console.error("ERROR- UPDATE MANUFACTURING ORDER", error);
                })
        }
        else {
            console.log("NEW MANUFACTURING ORDER", postDate);
            dataService.postexe("manufacturingorder/manufacturingorderrr", postDate)
                .then(response => {
                    console.log("SUCCESS- ADD MANUFACTURING ORDER", response.data);
                    showToastMessage();
                    navigate("/manufacturingorders")
                })
                .catch(error => {
                    console.error("ERROR- ADD MANUFACTURING ORDER", error);
                })
        }
    }

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

    //  Bom
    const initProductBOM = useCallback((id) => {

        dataService.getexe(`bom/product/${id}/bom`)
            .then(response => {
                console.log("SUCCESS - GET PRODUCT BOM DATA", response.data);
                if (response.data !== '') {
                    // setListProductBOM(response.data)
                    calculateMaterialTotalCost(response.data);
                    // console.log(response.data.material)
                    const modifidArray = response.data.map(item => {
                        console.log("planned",plannedQuantity);
                        console.log("qua",item.quanity);
                        const availabilityStatus = ((item.quantity * plannedQuantity) <= item.material.quanity) ? "In stock" : "Not available";
                        console.log("aval",availabilityStatus);
                        return {
                            cost: item.material.price,
                            notes: '',
                            material: item.material,
                            total_actual_quantity:"",
                            planned_quantity_per_unit:item.quantity,
                            ingredient_availability:availabilityStatus,
                            
                        }
                    })
                    // setIsLoading(false);
                    console.log("modified array", modifidArray);
                    setListProductBOM(modifidArray)
                }
                else {
                    setListProductBOM([]);
                    // setIsLoading(false);
                }
            })
            .catch(error => {
                console.error("ERROR- GET PRODUCT BOM DATA", error);
            })
    }, [calculateMaterialTotalCost,plannedQuantity])

    // const updateProductBOM = () => {

    //     const updatedList = listProductBOM.map(item => {
    //         console.log("Quantity",item.quantity);
    //         console.log("Planned Quantity",item.planned_quantity_per_unit);
    //         console.log("Material Quantity",item.material.quanity);
    //         console.log("p Quantity",plannedQuantity);
    //         const availabilityStatus = ((item.planned_quantity_per_unit * plannedQuantity) <= item.material.quanity) ? "In stock" : "Not available";
    //         console.log('availabilityStatus',availabilityStatus);
    //         return {
    //             ...item,
    //             ingredient_availability: availabilityStatus
    //         }
    //     })
    //     setListProductBOM(updatedList)

    // }
    const updateProductBOM = useCallback(() => {

        const updatedList = listProductBOM.map(item => {
            console.log("Quantity",item.quantity);
            console.log("Planned Quantity",item.planned_quantity_per_unit);
            console.log("Material Quantity",item.material.quanity);
            console.log("p Quantity",plannedQuantity);
            const availabilityStatus = ((item.planned_quantity_per_unit * plannedQuantity) <= item.material.quanity) ? "In stock" : "Not available";
            console.log('availabilityStatus',availabilityStatus);
            return {
                ...item,
                ingredient_availability: availabilityStatus
            }
        })
        setListProductBOM(updatedList)

    },[listProductBOM,plannedQuantity])

    //  operation
    const initProductOperation = useCallback((id) => {

        dataService.getexe(`productoperation/product/${id}/productoperation`)
            .then(response => {
                console.log("SUCCESS- GET PRODUCT OPERATION", response.data);
                if (response.data !== '') {
                    // setListProductOperation(response.data);
                    calculateOperationTotalCost(response.data);
                    const modifidArray = response.data.map(item => {
                        return {
                        //     material: item.material,
                        //     notes: '',
                        //     quantity: item.quantity,
                        //     cost: item.material.price
                            operation: item.operation,
                            resource: item.resource,
                            total_actual_time:"",
                            total_actual_cost:"",
                            planned_cost_per_unit:item.cost,
                            planned_time_per_unit:item.time,

                        }
                    })
                    setListProductOperation(modifidArray);
                    // setIsLoading(false);
                }
                else {
                    setListProductOperation([]);
                    // setIsLoading(false);
                }
            })
            .catch(error => {
                console.error("ERROR- GET PRODUCT OPERATION", error);
            })
    }, [calculateOperationTotalCost]);

    // get product quantity
    // const checkMaterialAvailability  = () => {
    //     dataService.getexe("material/material")
    //         .then(response => {
    //             console.log("SUCCESS- GET MANUFACTURING ORDER DATA", response.data);
    //             if (response.data !== '') {
    //                 // setMeasure(response.data)
    //                 // setIsLoading(false)
    //             }
    //             else {
    //                 // setMeasure([])
    //                 // setIsLoading(false)
    //             }
    //         })
    //         .catch(error => {
    //             console.error("ERROR- GET MANUFACTURING ORDER DATA", error);
    //         })
    // }

// get by id

    const initManufacturingOrder = useCallback(() => {

        dataService.getexe(`manufacturingorder/manufacturingorder/${manufacturingOrderId}`)
            .then(response => {
                console.log("GET MANUFACTURING ORDER BY ID", response.data);
                if (response.data !== null) {
                    setManufacturingOrder(response.data.manufacturingOrder)
                    setProductionDeadline(formatDate(response.data.productionDeadline));
                    setCreatedDate(formatDate(response.data.createdDate));
                    setProductId(response.data.product.id);
                    setstatus(response.data.status);
                    initProductBOM(response.data.product.id);
                    initProductOperation(response.data.product.id);

                }
                else {

                }
            })
            .catch(error => {
                console.error("ERROR - GET MATERIAL", error);
            })


    }, [initProductOperation, initProductBOM, manufacturingOrderId]);

    useEffect(() => {
        if (isEditMode) {
            initManufacturingOrder();
        }
    }, [initManufacturingOrder, isEditMode]);

    useEffect(() => {
        initProduct();
    }, []);

    // useEffect(() => {
    //     console.log("PRODUCT BOM LIST", listProductBOM);
    // }, [listProductBOM]);

    // useEffect(() => {
    //     console.log("PRODUCT OPERATION LIST", listProductOperation);
    // }, [listProductOperation]);

    // useEffect(() => {
    //     updateProductBOM();
    // }, [updateProductBOM]);

    // Handle Changes 

    const handleInputChange = (index, attribute, value) => {
        console.log(index, attribute, value)
        const updatedList = [...listProductBOM];
        updatedList[index][attribute] = value;
        setListProductBOM(updatedList);
      };

    const handleChangeProduct = (selectedOption) => {
        console.log("selectedOption", selectedOption)
        // console.log("selectedOption", selectedOption.value.id)
        setProductId(selectedOption ? selectedOption.value : null);

        initProductBOM(selectedOption.value);
        initProductOperation(selectedOption.value);

    }
    const handleChangeStatus = (selectedOption) => {
        console.log("selectedOption", selectedOption)
        console.log("selectedOption", selectedOption.value)
        setstatus(selectedOption ? selectedOption.value : null);
    }

    // Calculation

    const calculateMaterialQuantity = (quantity) => {
        const total = quantity * plannedQuantity;
        return total;
    }
    const calculateMaterialCost = (cost) => {
        const total = cost * plannedQuantity;
        return total;
    }
    const calculateOperationCost = (cost, time) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);

        const decimalHours = hours + (minutes / 60) + (seconds / 3600);
        const total = decimalHours * cost * plannedQuantity;
        return total;
    }
    const timeInSecondsForOneQuantity = (time) => {
        const [hours, minutes, seconds] = time.split(':');
        return (parseInt(hours, 10) * 3600) + (parseInt(minutes, 10) * 60) + parseInt(seconds, 10);
    };
    const calculateOperationTime = (time) => {
        const timeInSeconds = timeInSecondsForOneQuantity(time);
        const updatedTimeInSeconds = timeInSeconds * plannedQuantity;
        const hours = Math.floor(updatedTimeInSeconds / 3600);
        const minutes = Math.floor((updatedTimeInSeconds - hours * 3600) / 60);
        const seconds = updatedTimeInSeconds - hours * 3600 - minutes * 60;
        const updatedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        return updatedTime;
    }

    

    return (
        <div className="container-fluid m-1">
            <div><h6>Add New Manufacturing Order</h6></div>
            <div className="row mb-5 text-muted">
                <div className="col">
                    <form onSubmit={submitform}>
                        <div className="row gx-3 mb-3">
                            <div className="col-md-6 ">
                                <label className="small mb-1 " htmlFor="imputMaterialName">Manufacturing order#</label>
                                <input
                                    className="form-control fs-6"
                                    id="imputMaterialName"
                                    type="text"
                                    placeholder="Mo-1 Name"
                                    value={manufacturingOrder}
                                    onChange={event => setManufacturingOrder(event.target.value)}
                                >
                                </input>
                            </div>
                            <div className="col-md-6">

                                <div className="row gx-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="small mb-1" htmlFor="inputMeasure">Production deadline </label>
                                        <input
                                            className="form-control fs-6"
                                            id="imputMaterialName"
                                            type="date"
                                            placeholder="Mo-1 Name"
                                            value={productionDeadline}
                                            onChange={event => setProductionDeadline(event.target.value)}
                                        >
                                        </input>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="small mb-1" htmlFor="inputSupplier">Created date</label>
                                        <input
                                            className="form-control fs-6"
                                            id="imputMaterialName"
                                            type="date"
                                            placeholder="Mo-1 Name"
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
                                <label className="small mb-1" htmlFor="inputMeasure">Product</label>
                                <Select
                                    className='basic-single'
                                    value={listProduct.find((option) => option.value === productId)}
                                    options={listProduct}
                                    filterOption={(option, searchText) =>
                                        option.label.toLowerCase().includes(searchText.toLowerCase())}
                                    placeholder={"Select product"}
                                    onChange={handleChangeProduct}
                                />
                            </div>
                            <div className='col-md-6'>
                                <div className="row gx-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="small mb-1" htmlFor="inputMeasure">Status</label>
                                        <Select
                                            className='basic-single'
                                            options={option}
                                            value={option.find((option) => option.value === status)}
                                            filterOption={(option, searchText) =>
                                                option.label.toLowerCase().includes(searchText.toLowerCase())}
                                            placeholder={"Select"}
                                            onChange={handleChangeStatus}
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="row gx-3 mb-3">
                            <div className="col-md-6">

                                <div className="row gx-3 mb-3">
                                    <div className="col-md-4">
                                        <label className="small mb-1" htmlFor="inputMeasure">Planned quantity </label>
                                        <input
                                            className="form-control fs-6"
                                            id="imputMaterialName"
                                            type="number"
                                            placeholder="Mo-1 Name"
                                            value={plannedQuantity}
                                            onChange={event => { setPlannedQuantity(event.target.value);}}
                                        >
                                        </input>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="small mb-1" htmlFor="inputSupplier">Actual quantity</label>
                                        <input
                                            className="form-control fs-6"
                                            id="imputMaterialName"
                                            type="number"
                                            placeholder=""
                                            value={actualQuantity}
                                            onChange={event => setActualQuantity(event.target.value)}
                                        >
                                        </input>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="small mb-1" htmlFor="inputSupplier">Total Cost</label>

                                        <p className='fw-bold fs-5'> {(totalOperationCost + totalMaterialCost) * plannedQuantity}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h5>Ingredients</h5>
                            <table className='table table-bordered mt-4'>
                                <thead className='table-active'>
                                    <tr>
                                        <td><span className='text-muted'>Item</span></td>
                                        <td><span className='text-muted'>Notes</span></td>
                                        <td><span className='text-muted'>Planned/actual qty</span></td>
                                        <td><span className='text-muted'>Cost</span></td>
                                        <td><span className='text-muted'>Availability</span></td>
                                        <td><span className='text-muted'></span></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listProductBOM && listProductBOM.length > 0 ? (
                                        listProductBOM.map((item, index) => {
                                            // const availabilityStatus = ((item.planned_quantity_per_unit * plannedQuantity) <= item.material.quanity) ? "In stock " : "Not avaialble";
                                            // const availabilityClass = availabilityStatus === 'In stock ' ? 'bg-success text-white bg-opacity-75' : 'bg-danger text-white ';
                                            return (
                                                <tr key={index}>
                                                    
                                                    

                                                    <td ><span className='p-0'>{item.material.materialName}</span></td>
                                                    <td className='bg-success'>
                                                        <input
                                                            className=''
                                                            type='text'
                                                            value={item.notes}
                                                            onChange={e => handleInputChange(index,'notes', e.target.value)}
                                                            />
                                                    </td>
                                                    <td className='bg-success'>
                                                        <input
                                                            className=''
                                                            type='text'
                                                            value={calculateMaterialQuantity(item.planned_quantity_per_unit)}
                                                            onChange={e => handleInputChange(index,'planned_quantity_per_unit', e.target.value)}
                                                            />
                                                    </td>
                                                    {/* <td><span className='p-0 cell-hover-dark-border '>{calculateMaterialQuantity(item.planned_quantity_per_unit)}</span></td> */}
                                                    {/* <td><span className='p-0'>{item.planned_quantity_per_unit * plannedQuantity}</span></td> */}
                                                    {/* <td><span className='p-0'>{calculateMaterialCost(item.material.price)}</span></td> */}
                                                    <td><span className='p-0'>{item.material.price * plannedQuantity}</span></td>
                                                    {/* <td className={availabilityClass}><span className='p-0'>{availabilityStatus}</span></td> */}
                                                    <td className={`${item.ingredient_availability === "In stock" ? 'bg-success':'bg-danger'} text-white`}><span className='p-0'>{item.ingredient_availability}</span></td>
                                                    {/* <td className='bg-success text-white'><span className='p-0'>{((item.planned_quantity_per_unit * plannedQuantity) <= item.material.quanity) ? "In stock " : "Not avaialble"}</span></td> */}
                                                    <td><button className="btn btn-sm text-primary p-0"><i className='fa fa-square-plus'></i> Buy</button></td>
                                                </tr>
                                            )
                                        })
                                    ) : (<tr><td colSpan={5}>No data</td></tr>)}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h5>Operations</h5>
                            <table className='table table-bordered mt-4'>
                                <thead className='table-active'>
                                    <tr>
                                        <td><span className='text-muted'>Operation step</span></td>
                                        <td><span className='text-muted'>Resource</span></td>
                                        <td><span className='text-muted'>Planned/actual time</span></td>
                                        <td><span className='text-muted'>Cost</span></td>
                                        <td><span className='text-muted'>Status</span></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listProductOperation && listProductOperation.length > 0 ? (
                                        listProductOperation.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{item.operation.operationName}</td>
                                                    <td>{item.resource.resourceName}</td>
                                                    {/* <td>{item.time}</td> */}
                                                    {/* <td>{calculateOperationTime(item.time)}</td> */}
                                                    <td>{calculateOperationTime(item.planned_time_per_unit)}</td>
                                                    
                                                    {/* <td>{item.cost}</td> */}
                                                    {/* <td>{calculateOperationCost(item.cost, item.time)}</td> */}
                                                    <td>{calculateOperationCost(item.planned_cost_per_unit, item.planned_time_per_unit)}</td>
                                                    <td></td>
                                                </tr>
                                            )
                                        })
                                    ) : (<tr><td colSpan={5}>No data</td></tr>)}
                                </tbody>
                            </table>
                        </div>
                        <div>

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
                                                    placeholder="Eg: Notes"
                                                // value={description}
                                                // onChange={event => setDescription(event.target.value)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <button className="btn btn-primary me-2" type="submit">{isEditMode ? 'Update' : 'Save'}</button>
                            <button className="btn btn-secondary" type="reset">cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Manfactoder