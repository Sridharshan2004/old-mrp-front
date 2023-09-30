import React, { useState, useEffect } from 'react'
import dataService from "../../Service/dataService"

const Profile = () => {

    const [measure, setMeasure] = useState('');

    const initMeasure = () => {
        dataService.getexe(`user/${dataService.getUser().id}`)
            .then(response => {
                console.log("UNIT DATA", response.data);
                if (response.data.data !== null) {
                    setMeasure(response.data.data)
                }
                else {
                    setMeasure('')
                }
            })
            .catch(error => {
                console.error("ERROE", error);
            })
    }
    //   initMeasure()
    useEffect(() => {
        initMeasure();
    }, [])


    return (
        <div className="container-fluid">
            <div><h6>Profile</h6></div>
            <div className="row mb-5">

                <div className="col-xl-6">
                    <form>
                        <div className="row gx-3 mb-3">
                            <div className="col-md-6 ">
                                <label className="small mb-1" htmlFor="inputContactNo">Name</label>
                                <input
                                    className="form-control form-control-lg bg-light fs-6"
                                    id="inputContactNo"
                                    type="text"
                                    value={measure.name}>
                                </input>
                            </div>
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputContactNo">Email</label>
                                <input
                                    className="form-control form-control-lg bg-light fs-6"
                                    id="inputContactNo"
                                    type="text"
                                    value={measure.email}>
                                </input>
                            </div>
                        </div>
                        <div className="row gx-3 mb-3">
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputContactNo">Phone Number</label>
                                <input
                                    className="form-control form-control-lg bg-light fs-6"
                                    id="inputContactNo"
                                    type="text"
                                    value={measure.phoneNumber}>
                                </input>
                            </div>
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputContactNo">Location</label>
                                <input
                                    className="form-control form-control-lg bg-light fs-6"
                                    id="inputContactNo"
                                    type="text"
                                    placeholder="Eg: chennai">
                                </input>
                            </div>
                        </div>
                        <div>
                            <button className="btn btn-primary me-2" type="submit">Save</button>
                            <button className="btn btn-secondary" type="reset">cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile