import React from 'react'

const Dashboard = React.lazy(() => import('../Pages/General/dashboard'))
const Hotel = React.lazy(() => import('../Pages/General/hotel'))

const Routes = [
    { path : '/', exact : true, name: "Home"},
    { path : '/dashboard', name: "Dashboard", element: Dashboard},
    { path : '/hotel', name: "Hotel", element: Hotel},
]

export default Routes