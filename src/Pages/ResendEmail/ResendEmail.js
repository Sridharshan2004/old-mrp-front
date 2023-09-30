import React from 'react'
import dataService from "../../Service/dataService"
import mail from "../../Assets/image/mail.svg"
import { useNavigate } from 'react-router-dom'

const ResendEmail = () => {

    const navigate = useNavigate();

    const resendToken = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        console.log(token);
        dataService.getexe(`resend-token?token=${token}`)
            .then(response => {
                console.log("EMAIL SEND",response.data);
                navigate('/userVerification')
            })
            .catch(error => {
                console.error(error);
            })
    }
    
    return (
        //container start
        <div className="container">
            <div className="row">
                <div className="col-sm-9 col-md-9 col-lg-4 mx-auto">
                    {/* forgot password Card */}
                    <div className="card border-0 shadow-lg rounded-3 my-5">
                        <div className="card-body p-4 p-sm-5">
                            <div className="row justify-content-center align-items-center  mt-4 mb-3">
                                <img src={mail} className="img-fluid d-none d-sm-block" style={{ width: "100px" }} alt="" />
                            </div>
                            <h5 className="card-title text-center mb-3 fw-bold fs-5">Email Verification Link Expired!.</h5>
                            <p className="text-center"> Not to worry, We can send the link again.</p>
                            <div className="d-grid gap-2 col-10 mx-auto">
                                <button className="btn btn-primary" type="button" onClick={resendToken}>Resend Verification Link</button>
                            </div>
                        </div>
                    </div>
                    {/* forgot password Card end*/}
                </div>
            </div>
        </div>
        // container end
    )
}

export default ResendEmail