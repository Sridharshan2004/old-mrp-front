import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
// import routes from '../../Routes/Routes';
import Dashboard from '../../Components/Dashboard';
import Hotel from '../../Components/Hotel';
import Image from '../../Components/Image';
import Contact from '../../Pages/Contact/Contact';
import Item from '../../Pages/Item/Item';
import Sell from '../../Pages/Sell/Sell'
import Make from '../../Pages/Make/Make'
import Settings from '../../Pages/General/Settings/Settings';
import PageNotFound from '../../Pages/PageNotFound/PageNotFound';
import ListUser from '../../Pages/User/ListUser';
import User from '../../Pages/User/User';
import Profile from '../../Pages/User/Profile';
import Customer from '../../Pages/Contact/Customer/Customer';
import Supplier from '../../Pages/Contact/Suppliers/Supplier';
import Material from '../../Pages/Item/Material/Material';
import Product from '../../Pages/Item/Product/Product';
import Stock from '../../Pages/Stock/Stock';
import PurchaseOrder from '../../Pages/Buy/PurchaseOrder';
import PurchaseOrderList from '../../Pages/Buy/PurchaseOrderList';
import Sales from '../../Pages/Sell/Sales';
import NewProductExample from '../../Pages/Item/Product/NewProductExample';
import ListManufacturingOrders from '../../Pages/Make/ListManufacturingOrders';
import ManufacturingOrder from '../../Pages/Make/ManufacturingOrder';
// import SettingContent from '../../Pages/General/Settings/SettingContent';
// import Settingsnext from '../../Pages/General/Settings/Settingsnext';
import SalesOrderForm from '../../Pages/Trail/SalesOrderForm';
import Table from '../../Pages/Trail/Table';
import ProdcuctPage from '../../Pages/Trail/ProdcuctPage';
import Tableformnew from '../../Pages/Trail/Tableformnew';
import Manfactoder from '../../Pages/Make/Manfactoder';
import NewManufacturingOrder from '../../Pages/Make/NewManufacturingOrder';
import NewPurchaseOrder from '../../Pages/Trail/NewPurchaseOrder';
import NewSalesOrder from '../../Pages/Trail/NewSalesOrder';

const Content = () => {

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
                <Route exact path="/" element={<Navigate to="dashboard" replace />} />
                <Route  path="/dashboard" name="Login Page" element={<Dashboard />} />
                <Route  path="/hotel" name="Login Page" element={<Hotel />} />
                <Route  path="/image" name="Login Page" element={<Image />} />
                <Route  path="/listuser" name="Login Page" element={<ListUser />} />
                <Route  path="/user" name="Login Page" element={<User />} />
                <Route  path="/profile" name="Login Page" element={<Profile />} />
                <Route  path="/customer" name="Login Page" element={<Customer />} />
                <Route  path="/customer/:customerId" name="Login Page" element={<Customer />} />
                {/* <Route  path="/Purchase" name="Login Page" element={<Purchase />} /> */}
                <Route  path="/manufacturingorders" name="Login Page" element={<ListManufacturingOrders />} />
                <Route  path="/manufacturingorder" name="Login Page" element={<ManufacturingOrder />} />
                <Route  path="/manufacturingorder/:manufacturingOrderId" name="Login Page" element={<ManufacturingOrder />} />
                <Route  path="/sales" name="Login Page" element={<Sales />} />
                <Route  path="/sales/:salesId" name="Login Page" element={<Sales />} />
                <Route  path="/NewProductExample" name="Login Page" element={<NewProductExample />} />
                <Route  path="/NewProductExample/:id" name="Login Page" element={<NewProductExample />} />
                <Route  path="/NewProductExample/:id/bom" name="Login Page" element={<NewProductExample />} />
                <Route  path="/NewProductExample/:id/ops" name="Login Page" element={<NewProductExample />} />
                <Route  path="/stock/*" name="Login Page" element={<Stock />} />
                {/* <Route  path="/product" name="Login Page" element={<Product />} /> */}
                <Route  path="/product/*" name="Login Page" element={<Product />} />
                <Route  path="/material" name="Login Page" element={<Material />} />
                <Route  path="/material/:materialId" name="Login Page" element={<Material />} />
                <Route  path="/supplier" name="Login Page" element={<Supplier />} />
                <Route  path="/supplier/:supplierId" name="Login Page" element={<Supplier />} />
                <Route  path="/contact/*" name="Login Page" element={<Contact />} />
                <Route  path="/items/*" name="Login Page" element={<Item />} />
                <Route  path="/sell" name="Login Page" element={<Sell />} />
                <Route  path="/purchases" name="Login Page" element={<PurchaseOrderList />} />
                <Route  path="/purchase" name="Login Page" element={<PurchaseOrder />} />
                <Route  path="/purchase/:purchaseOrderId" name="Login Page" element={<PurchaseOrder />} />
                <Route  path="/make/*" name="Login Page" element={<Make />} />
                <Route  path="*" name="Login Page" element={<PageNotFound />} />
                <Route  path="/settings/*" name="Login Page" element={<Settings />} />  
                <Route  path="/salesform" name="Login Page" element={<SalesOrderForm />} />  
                <Route  path="/tableform" name="Login Page" element={<Table />} />  
                <Route  path="/productform" name="Login Page" element={<ProdcuctPage />} />  
                <Route  path="/tablenewform" name="Login Page" element={<Tableformnew />} />  
                <Route  path="/manfacorder" name="Login Page" element={<Manfactoder />} />  
                <Route  path="/newmanf" name="Login Page" element={<NewManufacturingOrder />} />  
                <Route  path="/newmanf/:manufacturingOrderId" name="Login Page" element={<NewManufacturingOrder />} />  
                <Route  path="/NewPurchaseOrder" name="Login Page" element={<NewPurchaseOrder />} />  
                <Route  path="/NewPurchaseOrder/:purchaseOrderId" name="Login Page" element={<NewPurchaseOrder />} />  
                <Route  path="/NewSalesOrder" name="Login Page" element={<NewSalesOrder />} />  
                <Route  path="/NewSalesOrder/:salesId" name="Login Page" element={<NewSalesOrder />} />  
                {/* <Route  path="/settings" name="Login Page" element={<Settings />} /> */}
                {/* <Route  path="/make" name="Login Page" element={<Make />} /> */}
                {/* <Route  path="/items" name="Login Page" element={<Item />} /> */}
                {/* <Route  path="/contact" name="Login Page" element={<Contact />} /> */}
                {/* <Route  path="/settings/*" name="Login Page" element={<Settingsnext />} /> */}
            </Routes>
        </Suspense>
    </div>
  )
}

export default Content