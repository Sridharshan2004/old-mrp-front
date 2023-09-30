import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import ProductStockList from './Product/ProductStockList'
import MaterialStockList from './Material/MaterialStockList'

const StockContent = () => {

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
            <Route exact path='/' element={<Navigate to="ProductStockList" replace />} />
            <Route exact path="/ProductStockList" name="Login Page" element={<ProductStockList />} />
            <Route exact path="/MaterialStockList" name="Login Page" element={<MaterialStockList />} />
            {/* {Children} */}
        </Routes>
    </Suspense>
</div>
  )
}

export default StockContent