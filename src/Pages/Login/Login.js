import React, { useState } from 'react'
import dataService from "../../Service/dataService"
import dashboard from "../../Assets/image/dashboard.svg"
import "../Registation/style.css"
import { Link } from 'react-router-dom'

const Login = () => {

    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [loginAlert, setLoginAlert] = useState(false)
    let [emailVerifyAlert, setEmailVerifyAlert] = useState(false)

    const submitform = (event) => {
        event.preventDefault()
        const postDate =
        {
            email: email,
            password: password
        }
        console.log("POSTDATA", postDate);
        dataService.postexe("signin", postDate)
            .then(response => {
                console.log("LOGIN SUCCESS", response.data);
                initLogin(response.data)
            })
            .catch(error => {
                setLoginAlert(true)
                console.log("LOGIN ERROR", error)
            })
    }

    const initLogin = (data) => {
        if (data.data != null) {
            dataService.setUser(data.data)
            dataService.setRole(data.roles)
            dataService.setToken(data.token)
            window.location.href = '/'
        }
        else {
            setEmailVerifyAlert(true)
            console.log("UASE DATA NOT AVAILABLE");
        }
    }

    return (
        // container start
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="row border rounded-5 p-3 bg-white shadow box-area">
                {/* left box start */}
                <div className="col-md-6 rounded-4 d-flex  flex-column left-box" style={{ background: "#103cbe" }}>
                    <div className="row">
                        <small className="text-white mt-5 ms-3 fs-5" style={{ width: "20rem", fontfamily: "Courier New', Courier, monospace" }}>The simplest way to manage your workforce</small>
                    </div>
                    <div className="featured-image mt-4">
                        <img src={dashboard} className="img-fluid d-none d-sm-block" alt="" />
                    </div>
                    <div className="row">
                        <small className="text-white ms-3 fs-5" style={{ fontfamily: "Courier New', Courier, monospace" }}>Start manufacturing in the cloud</small>
                    </div>
                </div>
                {/* left box end */}
                {/* right box start */}
                <div className="col-md-6 d-flex  flex-column right-box">
                    <div className="row align-items-center">
                        <div className="logo">
                            <h2 style={{ color: "#103cbe" }}>MindMRP</h2>
                        </div>
                        <div className="header-text mt-1 mb-4">
                            <h4>Login</h4>
                            <small>Enter your credentials to access your account.</small>
                        </div>

                        {loginAlert && (
                            <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                </svg>                        
                                    Incorrect Username or Password.
                                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        )}
                        {emailVerifyAlert && (
                            <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                </svg>                        
                                    Your email is not verified. <a href="/enableuser">Click here to verify</a>. 
                                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        )}

                        {/* form start */}
                        <form onSubmit={submitform}>
                            {/*email*/}
                            <div className="input-group mt-4 mb-3">
                                <input type="text"
                                    className="form-control form-control-lg bg-light fs-6"
                                    placeholder="Email address"
                                    onChange={event => setEmail(event.target.value)} />
                            </div>
                            {/* password */}
                            <div className="input-group mb-1">
                                <input type="password"
                                    className="form-control form-control-lg bg-light fs-6"
                                    placeholder="Password"
                                    onChange={event => setPassword(event.target.value)} />
                            </div>
                            {/* forgot password */}
                            <div className="input-group mb-5 d-flex justify-content-end">
                                <div className="forgot">
                                    <small><Link to="/forgotpassword">Forgot Password?</Link></small>
                                </div>
                            </div>
                            {/* submit button */}
                            <div className="input-group mb-3">
                                <button className="btn btn-lg btn-primary w-100 fs-6">Login</button>
                            </div>
                        </form>
                        {/* form end */}
                        <div className="row">
                            {/* create account*/}
                            <small>Don't have account? <Link to="/registration">Sign Up</Link></small>
                        </div>
                    </div>
                </div>
                {/* right box end */}
            </div>
        </div>
        // container end
    )
}

export default Login