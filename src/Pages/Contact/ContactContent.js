import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import Measure from '../General/Settings/Pages/Measure/Measure';
import Categories from '../General/Settings/Pages/Categories/Categories';
import Operations from '../General/Settings/Pages/Operations/Operations';
import Resources from '../General/Settings/Pages/Resources/Resources';
import Locations from '../General/Settings/Pages/Locations/Locations';
import ListCustomer from './Customer/ListCustomer';
import ListSupplier from './Suppliers/ListSupplier';

const ContactContent = () => {

    const loading = (
        <div className="text-center">
            <div className="spinner-border danger" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )

    return (
        <div className="">
            <Suspense fallback={loading}>
                <Routes>
                    <Route exact path='/' element={<Navigate to="customers" replace />} />
                    <Route exact path="/customers" name="Login Page" element={<ListCustomer />} />
                    <Route exact path="/suppliers" name="Login Page" element={<ListSupplier />} />
                    <Route exact path="/categories" name="Login Page" element={<Categories />} />
                    <Route exact path="/operations" name="Login Page" element={<Operations />} />
                    <Route exact path="/resources" name="Login Page" element={<Resources />} />
                    <Route exact path="/locations" name="Login Page" element={<Locations />} />
                    {/* {Children} */}
                </Routes>
            </Suspense>
        </div>
    )
}

export default ContactContent