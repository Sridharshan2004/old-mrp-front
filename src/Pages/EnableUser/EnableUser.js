import React, { useState } from 'react'
import dataService from "../../Service/dataService"
import { useNavigate } from 'react-router-dom';

const EnableUser = () => {

    let [email, setEmail] = useState('');

    const navigate = useNavigate();

    const submitform = (event) => {
        event.preventDefault();
        const postDate = 
        {
            email: email
        }
        console.log("POSTDATA", postDate);
        dataService.postexe("auth/enable",postDate)
            .then(response => {
                console.log(response.data);
                navigate('/userVerification')
            })
            .catch(error => {
                console.error(error)
            })
    }

    return (
        //container start
        <div className="container">
            <div className="row">
                <div className="col-sm-9 col-md-9 col-lg-5 mx-auto">
                    {/* forgot password Card */}
                    <div className="card border-0 shadow-lg rounded-3 my-5">
                        <div className="card-body p-4 p-sm-5">
                            <h5 className="card-title mb-3 fw-bold fs-5">Verify your Email</h5>
                            <p> Enter your registered email address to active your account.</p>
                            <form onSubmit={submitform}>
                                {/*Email address*/}
                                <div className="mb-3 mt-3">
                                    <label className="mb-2 fw-bold" htmlFor="inputEmail">Email address</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg fs-6"
                                        id="inputEmail"
                                        placeholder="user@yourdomain.com"
                                        onChange={event => setEmail(event.target.value)}>
                                    </input>
                                </div>
                                {/* submit Button  */}
                                <div className="d-grid gap-2">
                                    <button className="btn btn-primary btn-lg" type="submit">Continue</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    {/* forgot password Card end*/}
                </div>
            </div>
        </div>
        // container end
    )
}

export default EnableUser