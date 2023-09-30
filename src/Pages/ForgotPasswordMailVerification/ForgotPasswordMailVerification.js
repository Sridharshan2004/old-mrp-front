import React from 'react'
import mail from "../../Assets/image/mail.svg"

const Mail = () => {
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
                            <h5 className="card-title text-center mb-3 fw-bold fs-5">Check Your mail</h5>
                            <p className="text-center"> We have sent a password recover instruction to your email.</p>
                            <div class="d-grid gap-2 col-6 mx-auto">
                                <button class="btn btn-primary" type="button">Open email app</button>
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

export default Mail