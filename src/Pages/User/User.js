import React, { useEffect, useState } from 'react'
import dataService from "../../Service/dataService"
import Select from 'react-select';
import { useNavigate, Link } from 'react-router-dom';

const User = () => {

    let [name, setName] = useState('');
    let [email, setEmail] = useState('');
    let [phoneNumber, setPhoneNumber] = useState('');
    let [role, setRole] = useState('')
    let [listRole, setListRole] = useState([])

    let companyName = "Mindplm";

    const navigate = useNavigate();

    const initRole = () => {

        const arr = [];
        dataService.getexe("role")
            .then((response) => {
                console.log("Role", response.data);
                let result = response.data.list;
                console.log('result', result);
                result.map((opt) => {
                    return arr.push({ value: opt.role, label: opt.role })
                })
                setListRole(arr)
            })
            .catch(error => {
                console.error("ERROR", error);
            })
    }

    const submitform = (event) => {
        event.preventDefault()
        const postDate = {
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            companyName: companyName,
            role: role
        }
        console.log("POST DATA", postDate);
        dataService.postexe("user/user", postDate)
            .then(response => {
                console.log(response.data);
                navigate('/listuser')
            })
            .catch(error => {
                console.error(error);
            })
    }

    const handleSelect = (e) => {
        console.log('ROLE', e);
        setRole(Array.isArray(e) ? e.map(x => x.value) : []);
    }

    useEffect(() => {
        initRole();
    }, [])

    return (
        <div className="container-fluid m-1">
            <div><h6>Add New Employee</h6></div>
            <div className="row mb-5">
                <div className="col-xl-6">
                    <form onSubmit={submitform}>
                        <div className="row gx-3 mb-3">
                            <div className="col-md-6 ">
                                <label className="small mb-1" htmlFor="inputContactNo">Name</label>
                                <input
                                    className="form-control form-control-lg bg-light fs-6"
                                    id="inputContactNo"
                                    type="text"
                                    placeholder="Eg: Rajesh Dayalan"
                                    onChange={event => setName(event.target.value)}>
                                </input>
                            </div>
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputContactNo">Email</label>
                                <input
                                    className="form-control form-control-lg bg-light fs-6"
                                    id="inputContactNo"
                                    type="text"
                                    placeholder="Eg: rajesh.dayalan@mindplm.com"
                                    onChange={event => setEmail(event.target.value)}>
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
                                    placeholder="Eg: 9003745682"
                                    onChange={event => setPhoneNumber(event.target.value)}>
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
                        <div className="mb-3">
                            <label className="small mb-1" htmlFor="inputUsername">Role</label>
                            <Select
                                options={listRole}
                                isMulti
                                onChange={handleSelect}
                                value={listRole.filter(obj => role.includes(obj.value))}
                            />
                        </div>
                        <div>
                            <button className="btn btn-primary me-2" type="submit">Save</button>
                            <Link to="/user" className="btn btn-secondary ">cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default User