import React, { useCallback, useEffect, useState } from 'react'
import dataService from "../../../Service/dataService"
import { useParams } from 'react-router-dom';
import Select from 'react-select';

const ProductBOM = () => {

    const [productBom, setProductBom] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [materialId, setMaterialId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [notes, setNotes] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [listMaterial, setListMaterial] = useState([]);
    const [materialStockCost, setMaterialStockCost] = useState('')
    const [totalCost, setTotalCost] = useState(0);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [rowId, setRowId] = useState(null);

    const {productId} = useParams();
    
    
    const initProductBom = useCallback(() => {

        console.log(productId);
        dataService.getexe(`bom/product/${productId}/bom`)
        .then(response => {
            console.log("GET BOM", response.data);
            if (response.data !== '') {
                setProductBom(response.data)
                setIsLoading(false);
                
            }
            else {
                setProductBom([]);
                setIsLoading(false);
            }
        })
        .catch(error => {
            console.error("ERROR - GET CUSTOMER", error);
        })

    },[productId])

    useEffect(() => {
        // Fetch material stock cost for each material in the productBom
        productBom.forEach((item) => {
          getMaterialCost(item.material.id);
        });
      }, [productBom])
        

    

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

      const handleChangeMaterial = (selectedOption) => {
        setMaterialId(selectedOption ? selectedOption.value : null);
      }

    const submitform = (event) => {
        event.preventDefault();
        const postDate = {
            quantity: quantity,
            notes: notes,
            materialId: materialId,
            productId: productId
        }
        console.log("NEW CUSTOMER", postDate);
        dataService.postexe("bom/bom", postDate)
            .then(response => {
                console.log("SUCCESS- ADD CUSTOMER", response.data);
                setShowForm(false);
                initProductBom();
            })
            .catch(error => {
                console.error("ERROR- ADD CUSTOMER", error);
            })
    }

    const getMaterialCost = (id) => {

        dataService.getexe(`material/material/${id}`)
        .then(response => {
            console.log("GET MATERIAL COST", response.data);
            const stockCost = response.data.price;
            setMaterialStockCost((prevMaterialStockCost) => ({
                ...prevMaterialStockCost,
                [id]:stockCost,
            }) )
        })
        .catch(error => {
            console.error("ERROR - GET MATERIAL COST ERROR", error);
            
        })

    }

    useEffect(() => {
        initProductBom();
        initMaterial();
    }, [initProductBom])



  const calculateTotalCost = useCallback(() => {
    let total = 0;
    productBom.forEach((item) => {
      const stockCost = materialStockCost[item.material.id] || 0;
      total += stockCost * item.quantity;
    });
    setTotalCost(total.toFixed(2));
  },[productBom,materialStockCost]);

        useEffect(() => {
    calculateTotalCost();
  }, [calculateTotalCost, productBom, materialStockCost]);

  const handleDelete = (id) => {
    console.log("Delete", id);
    setRowId(id);
}
const handleEdit = (id) => {
    console.log("Edit", id);
    setRowId(id);
    initProductBOMById(id);
}

const initProductBOMById = (id) => {

    dataService.getexe(`bom/bom/${id}`)
        .then(response => {
            console.log("GET BOM", response.data);
            if (response.data !== null) {
                setQuantity(response.data.quantity);
                setNotes(response.data.notes);
                setMaterialId(response.data.material.id);
            }
            else {

            }
        })
        .catch(error => {
            console.error("ERROR - GET BOM", error);
        })


};

const deleteContent = () => {

    const deleteform = () => {
        dataService.deleteexe(`bom/bom/${rowId}`)
            .then(response => {
                console.log("SUCCESS- DELETED BOM OPERATION", response.data);
                initProductBom();
                setDeleteVisible(false);
            })
            .catch(error => {
                console.error("ERROR- DELETED BOM OPERATION", error);
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
            quantity: quantity,
            notes: notes,
            materialId: materialId,
            productId: productId
        }
        console.log("POST DATA", postDate)
        dataService.putexe(`bom/bom/${rowId}`, postDate)
            .then(response => {
                console.log("SUCCESS- UPDATE PRODUCT BOM", response.data);
                initProductBom();
                setEditVisible(false);
            })
            .catch(error => {
                console.error("ERROR- UPDATE PRODUCT BOM", error);
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
                                        <div><h5 className="modal-title">Edit Product BOM</h5></div>
                                        <div><button type="button" className='btn btn-close' onClick={() => setEditVisible(false)}></button></div>
                                    </div>
                                    <div className="col">
                                        <form onSubmit={updateform}>
                                            <div className="row gx-3 mb-3">
                                                <div className="col-md-6 ">
                                                    <label className="small mb-1 " htmlFor="imputMaterialName">Material</label>
                                                    <Select
                                                        className='basic-single'
                                                        value={listMaterial.find((option) => option.value === materialId)}
                                                        options={listMaterial}
                                                        filterOption={(option, searchText) =>
                                                            option.label.toLowerCase().includes(searchText.toLowerCase())}
                                                        placeholder={"Select operation"}
                                                        onChange={handleChangeMaterial}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="small mb-1" htmlFor="inputCategory">Quantity</label>
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
                                                    <label className="small mb-1 " htmlFor="imputMaterialName">Notes</label>
                                                    <input
                                                        className="form-control fs-6"
                                                        id="imputMaterialName"
                                                        type="text"
                                                        placeholder="Type notes"
                                                        value={notes}
                                                        onChange={event => setNotes(event.target.value)}
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
                    <div>{isLoading ? (<p>Loading</p>):(
                        
                            <div className="table-responsive">
                                <table className='table table-bordered mt-4'>
                                    <thead className='table-active'>
                                        <tr>
                                            <td><span className='text-muted'>Item</span></td>
                                            <td><span className='text-muted'>Quantity</span></td>
                                            <td><span className='text-muted'>Notes</span></td>
                                            <td><span className='text-muted'>Stock cost</span></td> 
                                            <td><span className='text-muted'></span></td> 
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productBom && productBom.length > 0 ? (
                                            productBom.map((item, index) => {
                                                const stockCost = materialStockCost[item.material.id] || 0;
                                                return (
                                                    <tr key={index}>
                                                        <td>{item.material.materialName}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.notes}</td>
                                                        <td>{(stockCost * item.quantity).toFixed(2)}</td>
                                                        <td>
                                                        <button onClick={() => handleEdit(item.id) > setEditVisible(true)} className="btn btn-primary btn-sm me-2"><i className='fa fa-pencil'></i></button>
                                                        <button onClick={() => handleDelete(item.id) > setDeleteVisible(true)} className="btn btn-danger btn-sm"><i className='fa fa-trash'></i></button>
                                                    </td>
                                                    </tr>
                                                )
                                            })

                                        ) : (<tr><td colSpan="4">No data</td></tr>)}

                                    </tbody>
                                </table>
                            </div>)}
                        
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
                                                        value={listMaterial.find((option) => option.value === materialId)}
                                                        options={listMaterial}
                                                        filterOption={(option, searchText) =>
                                                            option.label.toLowerCase().includes(searchText.toLowerCase())}
                                                        placeholder={"Select Material"}
                                                        onChange={handleChangeMaterial}
                                                    />
                                                </div>
                                            </td>
                                            <td >
                                                <div className="input-group">
                                                    <input
                                                        type="text"
                                                        className="form-control border-0"
                                                        placeholder="Type Quantity"
                                                        onChange={event => setQuantity(event.target.value)}
                                                    />
                                                </div>
                                            </td>
                                            <td >
                                                <div className="input-group">
                                                    <input
                                                        type="text"
                                                        className="form-control border-0"
                                                        placeholder="Notes"
                                                        onChange={event => setNotes(event.target.value)}
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
                        <div className='row justify-content-between'>
                            <div className='col'>Total cost:</div>
                            <div className='col'>{totalCost}</div>
                        </div>
                        <hr className='border-3' />
                    </div>
                </div>
            </div>
            {editVisible && EditContent()}
            {deleteVisible && deleteContent()}
        </div>
    )
}

export default ProductBOM