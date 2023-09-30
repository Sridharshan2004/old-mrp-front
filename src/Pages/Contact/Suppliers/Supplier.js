import React, { useCallback, useEffect, useState } from 'react'
import dataService from "../../../Service/dataService"
import { useNavigate,useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify'

const Supplier = () => {

    const [supplierName, setSupplierName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [phNumber, setphNumber] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [address, setAddress] = useState('');
    const [comment, setComment] = useState('');

    const { supplierId } = useParams();
    const isEditMode = !!supplierId;


    const showToastMessage = () => {
        toast.success('SUCCESS', {
          position: toast.POSITION.BOTTOM_RIGHT
        })
      }

    const navigate = useNavigate();

    const submitform = (event) => {
        event.preventDefault();
        const postDate = {
            supplierName: supplierName,
            emailAddress: emailAddress,
            comment: comment,
            companyName: companyName,
            phNumber: phNumber,
            address: address
        }
        if(isEditMode) {
            console.log("UPDATE SUPPLIER", postDate);
            dataService.putexe(`supplier/supplier/${supplierId}`, postDate)
                .then(response => {
                    console.log("SUCCESS- UPDATE SUPPLIER", response.data);
                    showToastMessage();
                    navigate("/contact/suppliers")
                })
                .catch(error => {
                    console.error("ERROR- UPDATE SUPPLIER", error);
                })
    }
    else {
        console.log("NEW SUPPLIER", postDate);
        dataService.postexe("supplier/supplier", postDate)
          .then(response => {
            console.log("SUCCESS- ADD SUPPLIER", response.data);
            showToastMessage();
            navigate("/contact/suppliers")
          })
          .catch(error => {
            console.error("ERROR- ADD SUPPLIER",error);
          })
        }
      }

      const initSuppliers = useCallback(() => {
        
        dataService.getexe(`supplier/supplier/${supplierId}`)
        .then(response => {
            console.log("GET SUPPLIER", response.data);
            if (response.data.data !== null) {
                setComment(response.data.data.comment);
                setEmailAddress(response.data.data.emailAddress);
                setSupplierName(response.data.data.supplierName);
                setCompanyName(response.data.data.companyName);
                setAddress(response.data.data.address);
                setphNumber(response.data.data.phNumber);
            }
            else {
                
            }
        })
        .catch(error => {
            console.error("ERROR - GET SUPPLIER", error);
        })
    

},[supplierId]);

useEffect(() => {
    if (isEditMode) {
        initSuppliers();
    }
    // initCustomers();
},[initSuppliers,isEditMode] );

    return (
        <div className="container-fluid m-1">
            <div><h6>Add New Supplier</h6></div>
            <div className="row mb-5">
                <div className="col-xl-6">
                    <form onSubmit={submitform}>
                        <div className="row gx-3 mb-3">
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputCompanyName">Company Name</label>
                                <input
                                    className="form-control form-control-lg bg-light fs-6"
                                    id="inputCompanyName"
                                    type="text"
                                    placeholder="Eg: example@gmail.com"
                                    value={companyName}
                                    onChange={event => setCompanyName(event.target.value)}
                                    required
                                >
                                </input>
                            </div>
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputName">Name</label>
                                <input
                                    className="form-control form-control-lg bg-light fs-6"
                                    id="inputName"
                                    type="text"
                                    placeholder="Eg: Rajesh"
                                    value={supplierName}
                                    onChange={event => setSupplierName(event.target.value)}
                                    required
                                    >
                                </input>
                            </div>
                        </div>
                        <div className="row gx-3 mb-3">
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputEmail">Email</label>
                                <input
                                    className="form-control form-control-lg bg-light fs-6"
                                    id="inputEmail"
                                    type="text"
                                    placeholder="Eg: example@gmail.com"
                                    value={emailAddress}
                                    onChange={event => setEmailAddress(event.target.value)}
                                >
                                </input>
                            </div>
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputPhone">Phone</label>
                                <input
                                    className="form-control form-control-lg bg-light fs-6"
                                    id="inputPhone"
                                    type="text"
                                    placeholder="Eg: 9003745682"
                                    value={phNumber}
                                    onChange={event => setphNumber(event.target.value)}
                                    >
                                </input>
                            </div>
                        </div>
                        <div className="row gx-3 mb-3">
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputAddress">Address</label>
                                <input
                                    className="form-control form-control-lg bg-light fs-6"
                                    id="inputAddress"
                                    type="text"
                                    placeholder="Eg: Chennai"
                                    value={address}
                                onChange={event => setAddress(event.target.value)}
                                >
                                </input>
                            </div>
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputComment">Comment</label>
                                <input
                                    className="form-control form-control-lg bg-light fs-6"
                                    id="inputComment"
                                    type="text"
                                    placeholder="Eg: More Information"
                                    value={comment}
                                    onChange={event => setComment(event.target.value)}
                                    >
                                </input>
                            </div>
                        </div>
                        <div>
                            <button className="btn btn-primary me-2" type="submit">{isEditMode ?'Update':'Save'}</button>
                            <Link to="/contact/suppliers" className="btn btn-secondary ">cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Supplier