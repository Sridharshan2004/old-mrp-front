import React, { useState } from 'react'
import dataService from "../../Service/dataService"
import dashboard from "../../Assets/image/dashboard.svg"
import "./style.css"
import { useNavigate } from 'react-router-dom'

const Registration = () => {

    let [name, setName] = useState('');
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [companyName, setCompanyName] = useState('');
    let [phoneNumber, setPhoneNumber] = useState('');
    let [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const submitform = (event) => {
        event.preventDefault();
        setIsLoading(true)
        const postDate = 
        {
            name: name,
            email: email,
            password: password,
            companyName: companyName,
            phoneNumber: phoneNumber,
            role: ["SUPER ADMIN"]
        }
        console.log('POSTDATA', postDate);
        dataService.postexe("signup",postDate)
            .then(response => {
                console.log("USER REGISTRATION SUCCESS",response.data);
                navigate('/userVerification')
            })
            .catch(error => {
                console.error("ERROR OCCUR DURING USER REDISTARTION",error);
            })
    }

    return (
        // container start
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="row border rounded-5 p-3 bg-white shadow box-area">
                {/* Left box */}
                <div className="col-md-6 rounded-4 d-flex  flex-column left-box" style={{ background: "#103cbe" }}>
                    <div className="row">
                        <small className="text-white mt-5 ms-3 fs-5" style={{ width: "20rem", fontfamily: "Courier New', Courier, monospace" }}>The simplest way to manage your workforce</small>
                    </div>
                    <div className="featured-image mt-4">
                        <img src={dashboard} className="img-fluid d-none d-sm-block" alt=""/>
                    </div>
                    <div className="row">
                        <small className="text-white ms-3 fs-5" style={{ fontfamily: "Courier New', Courier, monospace" }}>Start manufacturing in the cloud</small>
                        <small className="text-white ms-3 ">*No credit card required</small>
                    </div>
                </div>
                {/* Left box end */}
                {/* Right box start */}
                <div className="col-md-6 d-flex  flex-column right-box">
                    <div className="row align-items-center">
                        <div className="logo">
                            <h2 style={{ color: "#103cbe" }}>MindMRP</h2>
                        </div>
                        <div className="header-text mt-1 mb-4">
                            <h4>Create an account</h4>
                            <small>Start your 14 day free trail.</small>
                        </div>
                        {/* Form start */}
                        <form onSubmit={submitform}>
                            {/* Name */}
                            <div className="input-group mb-3">
                                <input type="text" 
                                className="form-control form-control-lg bg-light fs-6" 
                                placeholder="Name" 
                                onChange={event => setName(event.target.value)} />
                            </div>
                            {/* Email */}
                            <div className="input-group mb-3">
                                <input type="text" 
                                className="form-control form-control-lg bg-light fs-6" 
                                placeholder="Email address" 
                                onChange={event => setEmail(event.target.value)} />
                            </div>
                            {/* Company name */}
                            <div className="input-group mb-3">
                                <input type="text" 
                                className="form-control form-control-lg bg-light fs-6" 
                                placeholder="Company Name"
                                onChange={event => setCompanyName(event.target.value)} />
                            </div>
                            {/* Phone number */}
                            <div className="input-group mb-3">
                                <input type="text" 
                                className="form-control form-control-lg bg-light fs-6" 
                                placeholder="Phone Number" 
                                onChange={event => setPhoneNumber(event.target.value)} />
                            </div>
                            {/* password */}
                            <div className="input-group mb-3">
                                <input type="password" 
                                className="form-control form-control-lg bg-light fs-6" 
                                placeholder="Password" 
                                onChange={event => setPassword(event.target.value)}/>
                            </div>
                            {/* submit button */}
                            <div className="input-group mt-3 mb-3">
                                <button className={`btn btn-lg btn-primary w-100 fs-6 ${isLoading ? 'loading' :' '}`} disabled={isLoading}>
                                    {isLoading ? 'Loading ...' : 'CREATE ACCOUNT'}
                                </button>
                            </div>
                        </form>
                        {/* form end */}
                        <div className="row">
                            <small>Already have an account? <a href="/login">Sign in</a></small>
                        </div>
                    </div>
                </div>
                {/* Right Box end */}
            </div>
        </div>
        // container end
    )
}

export default Registration