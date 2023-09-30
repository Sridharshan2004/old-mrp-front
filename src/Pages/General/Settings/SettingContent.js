import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import Measure from './Pages/Measure/Measure';
import Categories from './Pages/Categories/Categories';
import Operations from './Pages/Operations/Operations';
import Resources from './Pages/Resources/Resources';
import Locations from './Pages/Locations/Locations';

const SettingContent = () => {

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
                <Route exact path='/' element={<Navigate to="measure" replace />} />
                <Route exact path="/measure" name="Login Page" element={<Measure />} />
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

export default SettingContent