import React from 'react'
import mail from "../../Assets/image/mail.svg"

const Verified = () => {
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
                            <h5 className="card-title text-center mb-3 fw-bold fs-5">Email Verified Already!</h5>
                            <p className="text-center"> You have successfully verified the account.</p>
                            <div className="d-grid gap-2 col-6 mx-auto">
                                <a href="/login" className="btn btn-primary active" role="button" aria-pressed="true">Login</a>
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

export default Verified