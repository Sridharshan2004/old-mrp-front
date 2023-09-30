import React, { useCallback, useEffect, useState } from 'react'
import dataService from "../../../Service/dataService"
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify'

const Customer = () => {
    const [customerName, setCustomerName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [address, setAddress] = useState('');
    const [emailId, setEmailId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [comment, setComment] = useState('');
    

    const { customerId } = useParams();
    const isEditMode = !!customerId;

    const showToastMessage = () => {
        toast.success('SUCCESS', {
            position: toast.POSITION.BOTTOM_RIGHT
        })
    }

    const navigate = useNavigate();

    const submitform = (event) => {
        event.preventDefault();
        const postDate = {
            customerName: customerName,
            companyName: companyName,
            address: address,
            emailId: emailId,
            phoneNumber: phoneNumber,
            comment: comment
        }
        if(isEditMode) {
                console.log("UPDATE CUSTOMER", postDate);
                dataService.putexe(`customer/customer/${customerId}`, postDate)
                    .then(response => {
                        console.log("SUCCESS- UPDATE CUSTOMER", response.data);
                        showToastMessage();
                        navigate("/contact/customers")
                    })
                    .catch(error => {
                        console.error("ERROR- UPDATE CUSTOMER", error);
                    })
        }
        else {
            console.log("NEW CUSTOMER", postDate);
            dataService.postexe("customer/customer", postDate)
                .then(response => {
                    console.log("SUCCESS- ADD CUSTOMER", response.data);
                    showToastMessage();
                    navigate("/contact/customers")
                })
                .catch(error => {
                    console.error("ERROR- ADD CUSTOMER", error);
                })
        }

    }

    const initCustomers = useCallback(() => {
        
            dataService.getexe(`customer/customer/${customerId}`)
            .then(response => {
                console.log("GET CUSTOMER", response.data);
                if (response.data.data !== null) {
                    
                    setCompanyName(response.data.data.companyName);
                    setCustomerName(response.data.data.customerName);
                    setEmailId(response.data.data.emailId);
                    setPhoneNumber(response.data.data.phoneNumber);
                    setAddress(response.data.data.address);
                    setComment(response.data.data.comment);
                }
                else {
                    
                }
            })
            .catch(error => {
                console.error("ERROR - GET CUSTOMER", error);
            })
        

    },[customerId]);

    useEffect(() => {
        if (isEditMode) {
            initCustomers();
        }
        // initCustomers();
    },[initCustomers,isEditMode] );


    return (
        <div className="container-fluid m-1">
            <div><h6>Add New Customer</h6></div>
            <div className="row mb-5">
                <div className="col-xl-6">
                    <form onSubmit={submitform}>
                        <div className="row gx-3 mb-3">
                            <div className="col-md-6 ">
                                <label className="small mb-1" htmlFor="inputCustomerNmae">Customer Name</label>
                                <input
                                    className="form-control form-control-lg bg-light fs-6"
                                    id="inputCustomerNmae"
                                    type="text"
                                    placeholder="Eg: Rajesh Dayalan"
                                    value={customerName}
                                    onChange={event => setCustomerName(event.target.value)}
                                    required
                                >
                                </input>
                            </div>
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputCompanyName">Company Name</label>
                                <input
                                    className="form-control form-control-lg bg-light fs-6"
                                    id="inputCompanyName"
                                    type="text"
                                    placeholder="Eg: ABC Company"
                                    value={companyName}
                                    onChange={event => setCompanyName(event.target.value)}
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
                                    value={emailId}
                                    onChange={event => setEmailId(event.target.value)}
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
                                    value={phoneNumber}
                                    onChange={event => setPhoneNumber(event.target.value)}
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
                            <Link to="/contact/customers" className="btn btn-secondary ">cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Customer