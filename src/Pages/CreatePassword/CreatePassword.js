import React, { useState } from 'react'
import dataService from "../../Service/dataService"
import { useNavigate } from 'react-router-dom'

const CreatePassword = () => {

    let [password, setPassword] = useState('')
    let [alert, setAlert] = useState(false)
    let [linkExpiredAlert, setLinkExpiredAlert] = useState(false)

    const navigate = useNavigate();

    const checkPassword = (newPassword) => {
        if(password === newPassword) {
            setAlert(false)
        }
        else {
            setAlert(true)
        }
    }

    const submitform = (event) => {
        event.preventDefault()
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        console.log(token);
        const postData = 
        {
            password: password
        }
        console.log(postData)
        dataService.postexe(`changepassword?token=${token}`,postData)
            .then(response => {
                console.log("PASSWORD RESET", response.data);
                initPassword(response.data);
            })
            .catch(error => {
                console.error(error);
            })
    }

    const initPassword = (data) => {
        if (data.data === null) {
            setLinkExpiredAlert(true)
        }
        else {
            navigate('/passwordresetmessage')
        }
    }

    return (
        // container start
        <div className="container">
            <div className="row">
                <div className="col-sm-9 col-md-9 col-lg-5 mx-auto">
                    {/* Password Card start */}
                    <div className="card border-0 shadow-lg rounded-3 my-5">
                        <div className="card-body p-4 p-sm-5">
                            <h5 className="card-title mb-3 fw-bold fs-5">Create New Password</h5>
                            <p> Your new password must be different from previous used passwords.</p>
                            <form onSubmit={submitform}>
                                {/* password  */}
                                <div className="mb-3">
                                    <label className="mb-2" htmlFor="inputUsername">Enter New Password</label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        id="inputUsername"
                                        placeholder="Atleast 6 characters"
                                        onChange={event => setPassword(event.target.value)} >
                                    </input>
                                </div>
                                {/* Confirm Password */}
                                <div className="mb-3">
                                    <label className="mb-2" htmlFor="inputPassword">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        id="inputPassword"
                                        placeholder="Confirm Password"
                                        onChange={event => checkPassword(event.target.value)} >
                                    </input>
                                </div>
                                {alert && <span style={{ color: 'red' }}>Passwords do not match</span>}
                                <br></br>
                                {/* submit Button  */}
                                <div className="d-grid gap-2 mb-3">
                                    <button className="btn btn-primary btn-lg" disabled={alert} type="submit">Continue</button>
                                </div>
                            </form>
                            {linkExpiredAlert && (
                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                </svg>                        
                                    Link Expired. <a href='/login'>Click here to Resend email.</a>
                                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        )}
                        </div>
                    </div>
                    {/* Password card end  */}
                </div>
            </div>
        </div>
        // container end
    )
}

export default CreatePassword