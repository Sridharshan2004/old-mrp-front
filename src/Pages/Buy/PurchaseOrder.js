import React, { useCallback, useEffect, useState } from 'react'
import dataService from "../../Service/dataService"
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify'
import Select from 'react-select';

const PurchaseOrder = () => {

    const [order, setOrder] = useState('');
    const [createdtime, setCreatedtime] = useState('');
    const [expectedtime, setExpectedtime] = useState('');
    const [notes, setNotes] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [locationId, setLocationId] = useState(1);
    const [status, setstatus] = useState(0);
    const [totalMaterialUnits, setTotalMaterialUnits] = useState(0);
    const [totalMaterialCost, setTotalMaterialCost] = useState(0);
    const [listSupplier, setListSupplier] = useState([]);
    const [listLocation, setListLocation] = useState([]);
    const [listMaterial, setListMaterial] = useState([]);

    const [manufacturingOrderModalVisible, setManufacturingOrderModalVisible] = useState(false);

    const [purchaseMaterial, setpurchaseMaterial] = useState([
        { material: '', quanity: 1, cost: 0 },
    ]);

    const [purchaseBills, setpurchaseBills] = useState([]);// set purchase bill post
    
    const [createdDate, setcreatedDate] = useState('');

    const { purchaseOrderId } = useParams();
    const isEditMode = !!purchaseOrderId;

    const navigate = useNavigate();

    // SUCCESS MESSAGE NOTIFICATION

    const showToastMessage = () => {
        toast.success('SUCCESS', {
            position: toast.POSITION.BOTTOM_RIGHT
        })
    }

    // OPTIONS

    const options = [
        { value: 0, label: 'NOT STARTED' },
        { value: 1, label: 'PARTIALLY RECEIVED' },
        { value: 2, label: 'DONE' }
    ]

        // SET EXPECTED ARRIVAL DATE AND CREATED DATE

        const initDate = () => {
            const currentDate = new Date();
    
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(currentDate.getDate() + 7);
    
            const formattedTodayDate = currentDate.toISOString().slice(0, 10);
            const formattedSevenDaysAgo = sevenDaysAgo.toISOString().slice(0, 10);
            setExpectedtime(formattedSevenDaysAgo);
            setCreatedtime(formattedTodayDate);
        }
        // SET CREATED DATE BILL

        const BillDate = () => {
            const currentDate = new Date();
            const formattedTodayDate = currentDate.toISOString().slice(0, 10);
            setcreatedDate(formattedTodayDate);
        }

    // SUMBIT FORM

    const submitform = (event) => {
        event.preventDefault();

        const updatePurchaseMaterial = purchaseMaterial.filter(
            (item) => item.product !== ''
        );

        const postDate = {
            order: order,
            createdtime: createdtime,
            expectedtime: expectedtime,
            notes: notes,
            supplierId: supplierId,
            locationId: locationId,
            status: status,
            purchaseMaterial: updatePurchaseMaterial.map((item) => {
                return {
                    id: item.id,
                    materialId: item.material.id,
                    quanity: item.quanity,
                    cost: item.cost
                }
            })
        }
        if (isEditMode) {

            console.log("UPDATE PURCHASE ORDER", postDate);

            dataService.putexe(`purchaseorder/purchaseorder/${purchaseOrderId}`, postDate)
                .then(response => {
                    console.log("SUCCESS- UPDATE PURCHASE ORDER", response.data);
                    showToastMessage();
                    navigate("/purchases")
                })
                .catch(error => {
                    console.error("ERROR- UPDATE PURCHASE ORDER", error);
                })
        }
        else {
            console.log("NEW PURCHASE ORDER", postDate);
            dataService.postexe("purchaseorder/purchaseorder", postDate)
                .then(response => {
                    console.log("SUCCESS- ADD PURCHASE ORDER", response.data);
                    showToastMessage();
                    navigate("/purchases")
                })
                .catch(error => {
                    console.error("ERROR- ADD PURCHASE ORDER", error);
                })
        }
    }

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

    // GET MATERIAL

    const initMaterial = () => {
        const arr = [];
        dataService.getexe(`material/material`)
            .then(response => {
                console.log("SUCCESS- GET MATERIAL", response.data);
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

    // GET PURCHASE ORDER

    const initPurchaseOrder = useCallback(() => {

        dataService.getexe(`purchaseorder/purchaseorder/${purchaseOrderId}`)
            .then(response => {
                console.log("GET PURCHASE ORDER BY ID", response.data);
                if (response.data !== null) {
                    setCreatedtime(response.data.createdtime);
                    setExpectedtime(response.data.expectedtime);
                    setNotes(response.data.notes);
                    setLocationId(response.data.location.id);
                    setstatus(response.data.status);
                    setSupplierId(response.data.supplier.id);
                    setOrder(response.data.order);
                    setpurchaseMaterial(response.data.purchaseMaterials);
                }
                else {

                }
            })
            .catch(error => {
                console.error("ERROR - GET MATERIAL", error);
            })


    }, [purchaseOrderId]);

    useEffect(() => {
        initSupplier();
        initLocation();
        initMaterial();
        initDate();
    }, []);

    useEffect(() => {

        // Calculate Product Total Cost & Unit
        const calculateMaterialTotal = (data) => {
            let totalCost = 0;
            let totalUnit = 0;
            data.forEach((item) => {
                const productCost = parseFloat(item.quanity) * parseFloat(item.cost);
                const productUnit = parseFloat(item.quanity);
                totalCost += productCost;
                totalUnit += productUnit

            });
            setTotalMaterialCost(totalCost);
            setTotalMaterialUnits(totalUnit)
        };

        calculateMaterialTotal(purchaseMaterial);

    }, [purchaseMaterial])

    useEffect(() => {
        if (isEditMode) {
            initPurchaseOrder();
        }
    }, [initPurchaseOrder, isEditMode]);

    //   GET MATERIAL BY ID

    const initMaterialGetByID = async (id) => {
        console.log(id);
        try {
            const response = await dataService.getexe(`material/material/${id}`);
            console.log("SUCCESS- GET MATERIAL", response.data);
            return response.data;
        } catch (error) {
            console.error("ERROR- GET MATERIAL", error);
        }
    }

    // DELETE CONTENT

    const deleteform = async (id) => {
        try {
            const response = await dataService.deleteexe(`purchasematerial/purchasematerial/${id}`);
            console.log("SUCCESS- DELETED PURCHASE ORDER DATA", response.data);
            return response.data;
        } catch (error) {
            console.error("ERROR- DELETED PURCHASE ORDER DATA", error);
        }
    }

    // ADD SALES ORDER ROW

    const addPurchaseOrderRow = () => {
        setpurchaseMaterial([...purchaseMaterial, { material: '', quanity: 1, cost: 0 }]);
    };

    // HANDLE CHANGE

    const handlePurchaseMaterialRowChange = async (index, field, value) => {
        console.log(index, field, value);
        if (field === 'material') {
            const materialData = await initMaterialGetByID(value.id);
            console.log(materialData);
            const updatedRows = [...purchaseMaterial];
            updatedRows[index].cost = materialData.price;
            setpurchaseMaterial(updatedRows);
        }
        const updatedRows = [...purchaseMaterial];
        updatedRows[index][field] = value;
        setpurchaseMaterial(updatedRows);
    };

    const handleDeleteRow = async (index) => {
        const updatedRows = [...purchaseMaterial];
        const deletedRow = updatedRows.splice(index, 1)[0]; // Remove the row at the specified index
        setpurchaseMaterial(updatedRows);
        if (isEditMode && deletedRow.id) {
            console.log(deletedRow.id);
            const deleteProductData = await deleteform(deletedRow.id);
            console.log(deleteProductData)
        }
    }

    const handleChangeSupplier = (selectedOption) => {
        console.log("selectedOption", selectedOption)
        setSupplierId(selectedOption ? selectedOption.value : null);

    }
    const handleChangeLocation = (selectedOption) => {
        console.log("selectedOption", selectedOption)
        setLocationId(selectedOption ? selectedOption.value : null);

    }
    const handleChangeStatus = (selectedOption) => {
        console.log("selectedOption", selectedOption)
        setstatus(selectedOption ? selectedOption.value : null);
        if (selectedOption.value === 1) {
            setManufacturingOrderModalVisible(true);
            const modifidArray = purchaseMaterial.map(item => {
                return {
                    id:item.id,
                    material: item.material,
                    quanity:item.quanity
                }
            })    
            setpurchaseBills(modifidArray);
            BillDate();
        }
        else {
            setManufacturingOrderModalVisible(false)
        }

    }

    const handleInputChangeBOM = (index, attribute, value) => {
        console.log(index, attribute, value);
        const updatedList = [...purchaseBills];
        updatedList[index][attribute] = value;
        setpurchaseBills(updatedList);
        console.log("purchaseBills", purchaseBills);
    };

    const manufacturingOrderContent = () => {

        // const handlePostData = () => {
        //     const postData = purchaseBills.map((item) => ({
        //         poid: purchaseOrderId,
        //         pmid: item.id,
        //         matid: item.material.id,
        //         postatus: status,
        //         receivedQty: item.receivedQty,
        //         createdDate: createdDate,
        //     }));
        //     console.log("NEW MANUFACTURING ORDER", postData);
        //     dataService.postexe("manufacturingorder/manufacturingorderr", postData)
        //         .then(response => {
        //             console.log("SUCCESS- ADD MANUFACTURING ORDER", response.data);
        //             setManufacturingOrderModalVisible(false);
        //             setcreatedDate('');
        //         })
        //         .catch(error => {
        //             console.error("ERROR- ADD MANUFACTURING ORDER", error);
        //         })
        // }

        const handlePostData = () => {
            // Iterate through each item in purchaseBills and send them one by one
            purchaseBills.forEach((item) => {
              const postData = {
                poid: purchaseOrderId,
                pmid: item.id,
                matid: item.material.id,
                postatus: status,
                receivedQty: item.receivedQty,
                createdDate: createdDate,
              };
          
              console.log("NEW PURCHASEBILL", postData);
          
              dataService
                .postexe("purchasebill/purchasebill", postData)
                .then((response) => {
                  console.log("SUCCESS- ADD PURCHASEBILL ", response.data);
                  initPurchaseOrder();
                  // Optionally, you can handle the response for each item here if needed.
                })
                .catch((error) => {
                  console.error("ERROR- ADD PURCHASEBILL", error);
                  // Optionally, you can handle the error for each item here if needed.
                });
            });
          
            // After sending all items, you can close the modal or perform other actions.
            setManufacturingOrderModalVisible(false);
            setcreatedDate('');
            
          };
          

        return (
            <>
                <div className="modal-backdrop show"></div>
                <div className=" modal " style={{ display: 'block' }} tabIndex="-1" role="dialog" >
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div className="modal-content border-0">
                            <div className="modal-body p-0">
                                <div className="card border-0 p-sm-3 p-2 justify-content-center">
                                    <div className="card-header pb-0 bg-white border-0 ">
                                        <div className="d-flex justify-content-between mb-3">
                                            <div><h6 className="modal-title">Receive items from {order}</h6></div>
                                            <div><button type="button" className='btn btn-close' onClick={() => setManufacturingOrderModalVisible(false) > setcreatedDate('')} ></button></div>
                                        </div>
                                        <div className="row gx-3 mb-3">
                                            <div className="col-md-6 ">
                                            </div>
                                            <div className="col-md-6">
                                                <label className="small mb-1" htmlFor="inputCategory">Received date</label>
                                                <input
                                                    className="form-control fs-6"
                                                    id="imputMaterialName"
                                                    type="date"
                                                    placeholder="Type time"
                                                    value={createdDate}
                                                    onChange={event => setcreatedDate(event.target.value)}
                                                >
                                                </input>
                                            </div>
                                        </div>
                                        <div>
                                            <table className='table table-bordered mt-4'>
                                                <thead className='table-active'>
                                                    <tr>
                                                        <td><span className='text-muted'>Item</span></td>
                                                        <td><span className='text-muted'>To receive</span></td>
                                                        <td><span className='text-muted'>Quantity left</span></td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {purchaseBills && purchaseBills.length > 0 ? (
                                                        purchaseBills.map((item, index) => {

                                                            return (
                                                                <tr key={index}>

                                                                    <td ><span className='p-0'>{item.material.materialName}</span></td>

                                                                    <td>
                                                                        <input
                                                                            type='text'
                                                                            // value={item.notes}
                                                                            onChange={e => handleInputChangeBOM(index, 'receivedQty', e.target.value)}
                                                                        />
                                                                    </td>

                                                                    <td><span className='p-0'>{item.quanity}</span></td>


                                                                </tr>
                                                            )
                                                        })
                                                    ) : (<tr><td colSpan={6}>No data</td></tr>)}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="card-body mt-5 px-sm-4 mb-2 pt-1 pb-0">
                                        <div className="row justify-content-end no-gutters">
                                            <div className="col-auto">
                                                <button type="button" className="btn btn-light text-muted" onClick={() => setManufacturingOrderModalVisible(false) > setcreatedDate('')}>cancel</button>
                                            </div>
                                            <div className="col-auto">
                                                <button type="button" className="btn btn-primary px-4" onClick={handlePostData}>Receive</button>
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
            <div><h6>Create Purchase order</h6></div>
            <div className="row mb-5 text-muted">
                <div className="col">
                    <form onSubmit={submitform}>
                        <div className="row gx-3 mb-3">
                            <div className="col-md-6 ">
                                <label className="small mb-1 " htmlFor="inputContactNo">Supplier Name</label>
                                <Select
                                    className='basic-single'
                                    value={listSupplier.find((option) => option.value === supplierId)}
                                    options={listSupplier}
                                    filterOption={(option, searchText) =>
                                        option.label.toLowerCase().includes(searchText.toLowerCase())}
                                    placeholder={"Select supplier"}
                                    onChange={handleChangeSupplier}
                                />
                            </div>
                            <div className="col-md-6">
                                <div className="row gx-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="small mb-1" htmlFor="inputContactNo">Expected arrival</label>
                                        <input
                                            className="form-control fs-6"
                                            id="inputContactNo"
                                            type="date"
                                            value={expectedtime}
                                            onChange={event => setExpectedtime(event.target.value)}
                                        >
                                        </input>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="small mb-1" htmlFor="inputContactNo">Created date</label>
                                        <input
                                            className="form-control fs-6"
                                            id="inputContactNo"
                                            type="date"
                                            value={createdtime}
                                            onChange={event => setCreatedtime(event.target.value)}
                                        >
                                        </input>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="row gx-3 mb-3">
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputContactNo">Order #</label>
                                <input
                                    className="form-control fs-6"
                                    id="inputContactNo"
                                    type="text"
                                    placeholder="PO-1"
                                    value={order}
                                    onChange={event => setOrder(event.target.value)}
                                >
                                </input>
                            </div>
                            <div className="col-md-6">
                                <div className="row gx-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="small mb-1" htmlFor="inputContactNo">Ship to</label>
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
                        {status === 0 || status === 1 ? (
                        <div>
                            <h6>Item not received</h6>
                        <table className='table table-bordered mt-4'>
                            <thead className='table-active'>
                                <tr>
                                    <td><span className='text-muted'>Item</span></td>
                                    <td><span className='text-muted'>Quantity</span></td>
                                    <td><span className='text-muted'>Price per uint</span></td>
                                    <td><span className='text-muted'>Total price</span></td>
                                    <td><span className='text-muted'></span></td>
                                </tr>
                            </thead>
                            <tbody>
                                {purchaseMaterial.map((item, index) => (
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
                                                value={listMaterial.find((option) => option.value === (item.material === null ? 0 : item.material.id))}
                                                options={listMaterial}
                                                filterOption={(option, searchText) =>
                                                    option.label.toLowerCase().includes(searchText.toLowerCase())}
                                                placeholder={"Select Item"}
                                                onChange={e => handlePurchaseMaterialRowChange(index, 'material', { ...item.material, id: e.value })}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type='text'
                                                value={item.quanity}
                                                onChange={e => handlePurchaseMaterialRowChange(index, 'quanity', e.target.value)}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type='text'
                                                value={item.cost}
                                                onChange={e => handlePurchaseMaterialRowChange(index, 'cost', e.target.value)}
                                            />
                                        </td>

                                        <td>
                                            <span className='p-0'>{item.cost * item.quanity}</span>
                                        </td>

                                        <td>
                                            <button type="button" className="btn btn-sm text-secondary p-0" onClick={() => handleDeleteRow(index)}><i className='fa fa-trash'></i></button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>):null}

                        {status === 1 || status === 2 ?(
                        <div>
                            <h6>Item received</h6>
                        <table className='table table-bordered mt-4'>
                            <thead className='table-active'>
                                <tr>
                                    <td><span className='text-muted'>Item</span></td>
                                    <td><span className='text-muted'>Quantity</span></td>
                                    <td><span className='text-muted'>Price per uint</span></td>
                                    <td><span className='text-muted'>Total price</span></td>
                                    <td><span className='text-muted'>Date</span></td>
                                </tr>
                            </thead>
                            <tbody>
                                {purchaseMaterial.map((item) =>
                                    item.purchaseBills.map((bill,index) => (
                                    
                                    <tr key={index}>
                                        <td>
                                            <span className='p-0'>{bill.material.materialName}</span>
                                        </td>
                                        <td>
                                            <span className='p-0'>{bill.receivedQty}</span>
                                        </td>
                                        <td>
                                            <span className='p-0'>{item.cost}</span>
                                        </td>
                                        <td>
                                            <span className='p-0'>{item.cost * bill.receivedQty}</span>
                                        </td>
                                        <td>
                                            <span className='p-0'>{ bill.createdDate}</span>
                                        </td>
                                    </tr>
                                )))}
                            </tbody>
                        </table>
                        </div>):null}
                        <button className="btn btn-sm btn-secondary opacity-75" type="button" onClick={addPurchaseOrderRow}>+ Add Row</button>

                        <div className='row'>
                            <div className='col-sm-7'></div>
                            <div className='col-sm-5'>
                                <hr className='border-3' />
                                <table className='table'>
                                    <tbody>
                                        <tr>
                                            <td>Total Units</td>
                                            <td className='text-end'>{totalMaterialUnits.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td>Total Cost</td>
                                            <td className='text-end'>{totalMaterialCost.toFixed(2)}</td>
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
                                                placeholder="Type comments here"
                                                onChange={event => setNotes(event.target.value)}
                                                value={notes}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <button className="btn btn-primary me-2" type="submit">{isEditMode ? 'Update' : 'Save'}</button>
                            <Link to="/purchases" className="btn btn-secondary ">cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
            {manufacturingOrderModalVisible && manufacturingOrderContent()}
        </div>
    )
}

export default PurchaseOrder