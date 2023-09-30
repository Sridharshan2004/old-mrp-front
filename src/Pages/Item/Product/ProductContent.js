import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import ProductBOM from './ProductBOM';
import ProductionOperations from './ProductionOperations';
import NewProduct from './NewProduct';

const ProductContent = ({productId, handleProductId}) => {
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
            <Route exact path='/' element={<Navigate to="new" replace />} />
            <Route  path="/new" name="Login Page" element={<NewProduct handleProductId={handleProductId}/>} />
            <Route  path="/new/:id" name="Login Page" element={<NewProduct handleProductId={handleProductId}/>} />
            {/* <Route  path="/bom" name="Login Page" element={<ProductBOM />} /> */}
            {/* <Route  path={`/pa/${productId}/bom`} name="Login Page" element={<ProductBOM />} />
            <Route  path={`/pa/${productId}/ops`} name="Login Page" element={<ProductionOperations />} /> */}
            {/* <Route  path={`/pa/:${productId}/bom`} name="Login Page" element={<ProductBOM />} />
            <Route  path={`/pa/:${productId}/ops`} name="Login Page" element={<ProductionOperations />} /> */}
            <Route  path={`/pa/:productId/bom`} name="Login Page" element={<ProductBOM />} />
            <Route  path={`/pa/:productId/ops`} name="Login Page" element={<ProductionOperations />} />
        </Routes>
    </Suspense>
</div>
  )
}

export default ProductContent