import React, { useCallback, useEffect, useState } from 'react'
import dataService from "../../../Service/dataService"
import { useParams } from 'react-router-dom';
import Select from 'react-select';

const ProductionOperations = () => {

    const [productOperation, setProductOperation] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [time, setTime] = useState('');
    const [cost, setCost] = useState('');
    const [operationId, setOperationId] = useState('');
    const [resourceId, setResourceId] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [listOperation, setListOperation] = useState([]);
    const [listResource, setListResource] = useState([]);
    const [totalTime, setTotalTime] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [rowId, setRowId] = useState(null);

    const { productId } = useParams();

    const initProductOperation = useCallback(() => {

        dataService.getexe(`productoperation/product/${productId}/productoperation`)
            .then(response => {
                console.log("SUCCESS - GET PRODUCT OPERATION", response.data);
                if (response.data !== '') {
                    setProductOperation(response.data)
                    setIsLoading(false);
                    calculateTotals(response.data)
                }
                else {
                    setProductOperation([]);
                    setIsLoading(false);
                }
            })
            .catch(error => {
                console.error("ERROR - GET PRODUCT OPERATION", error);
            })

    }, [productId])

    const initOperations = () => {
        const arr = [];
        dataService.getexe(`operation/operation`)
            .then(response => {
                console.log("SUCCESS- GET OPERATION", response.data);
                let result = response.data.list;
                result.map((opt) => {
                    return arr.push({ value: opt.id, label: opt.operationName })
                })
                setListOperation(arr)
            })
            .catch(error => {
                console.error("ERROR- GET OPERATION", error);
            })
    }

    const initResource = () => {
        const arr = [];
        dataService.getexe(`resource/resource`)
            .then(response => {
                console.log("SUCCESS- GET RESOURCE", response.data);
                let result = response.data.list;
                result.map((opt) => {
                    return arr.push({ value: opt.id, label: opt.resourceName })
                })
                setListResource(arr)
            })
            .catch(error => {
                console.error("ERROR- GET RESOURCE", error);
            })
    }

    const submitform = (event) => {
        event.preventDefault();
        const postDate = {
            time: time,
            cost: cost,
            operationId: operationId,
            resourceId: resourceId,
            productId: productId
        }
        console.log("NEW PRODUCT OPERATION", postDate);
        dataService.postexe("productoperation/productoperation", postDate)
            .then(response => {
                console.log("SUCCESS- ADD PRODUCT OPERATION", response.data);
                setShowForm(false);
                initProductOperation();
            })
            .catch(error => {
                console.error("ERROR- ADD PRODUCT OPERATION", error);
            })
    }

    const handleChangeOperation = (selectedOption) => {
        setOperationId(selectedOption ? selectedOption.value : null);
    }

    const handleChangeResource = (selectedOption) => {
        setResourceId(selectedOption ? selectedOption.value : null);
    }

    const calculateOperationCost = (cost, time) => {

        const [hours, minutes, seconds] = time.split(':').map(Number);

        const decimalHours = hours + (minutes / 60) + (seconds / 3600);
        // console.log("decimalHours",decimalHours);
        const amount = decimalHours * cost;
        // console.log("amount",amount);
        return amount.toFixed(2);

    }
    const calculateTotals = (data) => {
        let totalTimeSeconds = 0;
        let totalCost = 0;

        data.forEach((item) => {
            const [hours, minutes, seconds] = item.time.split(':').map(Number);
            const decimalHours = hours + (minutes / 60) + (seconds / 3600);
            const operationCost = decimalHours * item.cost;

            totalTimeSeconds += hours * 3600 + minutes * 60 + seconds;
            totalCost += operationCost;
        });

        const hours = Math.floor(totalTimeSeconds / 3600);
        const minutes = Math.floor((totalTimeSeconds % 3600) / 60);
        const seconds = totalTimeSeconds % 60;
        const formattedTotalTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        setTotalTime(formattedTotalTime);
        setTotalCost(totalCost.toFixed(2));
    };

    useEffect(() => {
        initProductOperation();
        initResource();
        initOperations();
    }, [initProductOperation])

    const handleDelete = (id) => {
        console.log("Delete", id);
        setRowId(id);
    }
    const handleEdit = (id) => {
        console.log("Edit", id);
        setRowId(id);
        initProductOperationById(id);
    }

    const initProductOperationById = (id) => {

        dataService.getexe(`productoperation/productoperation/${id}`)
            .then(response => {
                console.log("GET MATERIAL", response.data);
                if (response.data !== null) {
                    setOperationId(response.data.operation.id);
                    setResourceId(response.data.resource.id);
                    setCost(response.data.cost);
                    setTime(response.data.time);
                }
                else {

                }
            })
            .catch(error => {
                console.error("ERROR - GET MATERIAL", error);
            })


    };

    const deleteContent = () => {

        const deleteform = () => {
            dataService.deleteexe(`productoperation/productoperation/${rowId}`)
                .then(response => {
                    console.log("SUCCESS- DELETED PRODUCT OPERATION", response.data);
                    initProductOperation();
                    setDeleteVisible(false);
                })
                .catch(error => {
                    console.error("ERROR- DELETED PRODUCT OPERATION", error);
                })
        }

        return (
            <>
                <div className="modal-backdrop show"></div>
                <div className=" modal " style={{ display: 'block' }} tabIndex="-1" role="dialog" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content border-0">
                            <div className="modal-body p-0">
                                <div className="card border-0 p-sm-3 p-2 justify-content-center">
                                    <div className="card-header pb-0 bg-white border-0 ">
                                        <div className="row justify-content-end mb-3">
                                            <button type="button" className='btn btn-close' onClick={() => setDeleteVisible(false)}></button>
                                        </div>
                                        <p className="font-weight-bold mb-2"> Are you sure you wanna delete this ?</p>
                                    </div>
                                    <div className="card-body px-sm-4 mb-2 pt-1 pb-0">
                                        <div className="row justify-content-end no-gutters">
                                            <div className="col-auto">
                                                <button type="button" className="btn btn-light text-muted" onClick={() => setDeleteVisible(false)}>Cancel</button>
                                            </div>
                                            <div className="col-auto">
                                                <button type="button" className="btn btn-danger px-4" onClick={() => deleteform()}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    const EditContent = () => {

        const updateform = () => {
            const postDate = {
                time: time,
                cost: cost,
                operationId: operationId,
                resourceId: resourceId,
                productId: productId
            }
            dataService.putexe(`productoperation/productoperation/${rowId}`, postDate)
                .then(response => {
                    console.log("SUCCESS- UPDATE PRODUCT OPERATION", response.data);
                    initProductOperation();
                    setEditVisible(false);
                })
                .catch(error => {
                    console.error("ERROR- UPDATE PRODUCT OPERATION", error);
                })
        }

        return (
            <>
                <div className="modal-backdrop show"></div>
                <div className=" modal bd-example-modal-lg" style={{ display: 'block' }} tabIndex="-1" role="dialog" >
                    <div className="modal-dialog modal-lg " role="document">
                        <div className="modal-content border-0">

                            <div className="modal-body p-0">
                                <div className="card border-0 p-sm-3 p-2 justify-content-center">
                                    <div className="card-header pb-0 bg-white border-0 ">
                                        <div className="d-flex justify-content-between mb-3">
                                            <div><h5 className="modal-title">Edit Product Operation</h5></div>
                                            <div><button type="button" className='btn btn-close' onClick={() => setEditVisible(false)}></button></div>
                                        </div>
                                        <div className="col">
                                            <form onSubmit={updateform}>
                                                <div className="row gx-3 mb-3">
                                                    <div className="col-md-6 ">
                                                        <label className="small mb-1 " htmlFor="imputMaterialName">Operation</label>
                                                        <Select
                                                            className='basic-single'
                                                            value={listOperation.find((option) => option.value === operationId)}
                                                            options={listOperation}
                                                            filterOption={(option, searchText) =>
                                                                option.label.toLowerCase().includes(searchText.toLowerCase())}
                                                            placeholder={"Select operation"}
                                                            onChange={handleChangeOperation}
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="small mb-1" htmlFor="inputCategory">Resource</label>
                                                        <Select
                                                            className='basic-single'
                                                            value={listResource.find((option) => option.value === resourceId)}
                                                            options={listResource}
                                                            filterOption={(option, searchText) =>
                                                                option.label.toLowerCase().includes(searchText.toLowerCase())}
                                                            placeholder={"Select resource"}
                                                            onChange={handleChangeResource}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row gx-3 mb-3">
                                                    <div className="col-md-6 ">
                                                        <label className="small mb-1 " htmlFor="imputMaterialName">Cost per hour</label>
                                                        <input
                                                            className="form-control fs-6"
                                                            id="imputMaterialName"
                                                            type="text"
                                                            placeholder="Type cost per hour"
                                                            value={cost}
                                                            onChange={event => setCost(event.target.value)}
                                                        >
                                                        </input>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="small mb-1" htmlFor="inputCategory">Time</label>
                                                        <input
                                                            className="form-control fs-6"
                                                            id="imputMaterialName"
                                                            type="time"
                                                            placeholder="Type time"
                                                            value={time}
                                                            onChange={event => setTime(event.target.value)}
                                                        >
                                                        </input>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="card-body px-sm-4 mb-2 pt-1 pb-0">
                                        <div className="row justify-content-end no-gutters">
                                            <div className="col-auto">
                                                <button type="button" className="btn btn-light text-muted" onClick={() => setEditVisible(false)}>Cancel</button>
                                            </div>
                                            <div className="col-auto">
                                                <button type="button" className="btn btn-primary px-4" onClick={() => updateform()}>save</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className="container-fluid m-1">
            <div className="row mt-3 mb-5">
                <div className="col">

                    <div>{isLoading ? (<p>Loading</p>) : (
                        <div className="table-responsive">
                            <table className='table table-bordered mt-4'>
                                <thead className='table-active'>
                                    <tr>
                                        <td><span className='text-muted'>Operation</span></td>
                                        <td><span className='text-muted'>Resource</span></td>
                                        <td><span className='text-muted'>Cost per hour</span></td>
                                        <td><span className='text-muted'>Time</span></td>
                                        <td><span className='text-muted'>Cost</span></td>
                                        <td><span className='text-muted'></span></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productOperation && productOperation.length > 0 ? (
                                        productOperation.map((item, index) => {
                                            return (
                                                <tr key={index} >
                                                    <td>{item.operation.operationName}</td>
                                                    <td>{item.resource.resourceName}</td>
                                                    <td>{item.cost}</td>
                                                    <td>{item.time}</td>
                                                    <td>{calculateOperationCost(item.cost, item.time)}</td>
                                                    <td>
                                                        <button onClick={() => handleEdit(item.id) > setEditVisible(true)} className="btn btn-primary btn-sm me-2"><i className='fa fa-pencil'></i></button>
                                                        <button onClick={() => handleDelete(item.id) > setDeleteVisible(true)} className="btn btn-danger btn-sm"><i className='fa fa-trash'></i></button>
                                                    </td>
                                                </tr>
                                            )
                                        })

                                    ) : (<tr><td colSpan="5">No data</td></tr>)}

                                </tbody>
                            </table>
                        </div>
                    )}
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        {!showForm && (<button className="btn btn-outline-secondary" onClick={() => setShowForm(true)}>+Add new row</button>)}
                    </div>
                    {showForm && (
                        <form onSubmit={submitform}>
                            <div className="table">
                                <table className='table table-bordered'>
                                    <tbody>
                                        <tr>
                                            <td >
                                                <div className="input-group">
                                                    <Select
                                                        className='basic-single'
                                                        value={listOperation.find((option) => option.value === operationId)}
                                                        options={listOperation}
                                                        filterOption={(option, searchText) =>
                                                            option.label.toLowerCase().includes(searchText.toLowerCase())}
                                                        placeholder={"Select operation"}
                                                        onChange={handleChangeOperation}
                                                    />
                                                </div>
                                            </td>
                                            <td >
                                                <div className="input-group">
                                                    <Select
                                                        className='basic-single'
                                                        value={listResource.find((option) => option.value === resourceId)}
                                                        options={listResource}
                                                        filterOption={(option, searchText) =>
                                                            option.label.toLowerCase().includes(searchText.toLowerCase())}
                                                        placeholder={"Select Resource"}
                                                        onChange={handleChangeResource}
                                                    />
                                                </div>
                                            </td>
                                            <td >
                                                <div className="input-group">
                                                    <input
                                                        type="text"
                                                        className="form-control border-0"
                                                        placeholder="Cost per hour"
                                                        onChange={event => setCost(event.target.value)}
                                                    />
                                                </div>
                                            </td>
                                            <td >
                                                <div className="input-group">
                                                    <input
                                                        type="time"
                                                        className="form-control border-0"
                                                        placeholder="Time"
                                                        onChange={event => setTime(event.target.value)}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="input-group">
                                                    <button className='btn btn-secondary'><span aria-hidden="true">+</span></button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </form>
                    )}
                </div>
                <div className='row'>
                    <div className='col-sm-8'></div>
                    <div className='col-sm-4'>
                        <hr className='border-5' />
                        <table className='table '>
                            <tbody>
                                <tr>
                                    <td>Total time:</td>
                                    <td>{totalTime}</td>
                                </tr>
                                <tr>
                                    <td>Total Cost:</td>
                                    <td>{totalCost}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {editVisible && EditContent()}
            {deleteVisible && deleteContent()}
        </div>
    )
}

export default ProductionOperations