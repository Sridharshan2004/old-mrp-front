// Import Bootstrap css & JavaScript
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min";
import "../node_modules/react-toastify/dist/ReactToastify.css";

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { Component, Suspense } from 'react';

import './App.css';

import dataService from "./Service/dataService";

const ForgotPasswordMailVerification = React.lazy(() => import('./Pages/ForgotPasswordMailVerification/ForgotPasswordMailVerification'))
const PasswordResetMessage = React.lazy(() => import('./Pages/PasswordResetMessage/PasswordResetMessage'))
const UserVerification = React.lazy(() => import('./Pages/UserVerification/UserVerification'))
const ForgotPassword = React.lazy(() => import('./Pages/ForgotPassword/ForgotPassword'))
const CreatePassword = React.lazy(() => import('./Pages/CreatePassword/CreatePassword'))
const EmailVerified = React.lazy(() => import('./Pages/EmailVerified/EmailVerified'))
const DefaultLayout = React.lazy(() => import('./Components/Layout/DefaultLayout'))
const Registration = React.lazy(() => import('./Pages/Registation/Registration'))
const ResendEmail = React.lazy(() => import('./Pages/ResendEmail/ResendEmail'))
const EnableUser = React.lazy(() => import('./Pages/EnableUser/EnableUser'))
const Verified = React.lazy(() => import('./Pages/Verified/Verified'))
const Login = React.lazy(() => import('./Pages/Login/Login'))

const loading = (
  <div className="text-center">
    <div className="spinner-border primary" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
)

class App extends Component {

  render() {
    let userLoggedIn = dataService.isUserLoggedIn();
    let targetPage
    if (userLoggedIn) {
      targetPage = (<Route path="*" name="Home" element={<DefaultLayout />} />)
    }
    else {
      targetPage = (<Route path="*" element={<Navigate to="login" replace />} />)
    }

    return (
      <Router>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/registration" name="Registartion Page" element={<Registration />} />
            <Route exact path="/forgotPassword" name="Login Page" element={<ForgotPassword />} />
            <Route exact path="/forgotPasswordMailVerification" name="Login Page" element={<ForgotPasswordMailVerification />} />
            <Route exact path="/userVerification" name="Login Page" element={<UserVerification />} />
            <Route exact path="/createPassword" name="Login Page" element={<CreatePassword />} />
            <Route exact path="/enableuser" name="Login Page" element={<EnableUser />} />
            <Route exact path="/emailVerified" name="Login Page" element={<EmailVerified />} />
            <Route exact path="/tokenexpired" name="Login Page" element={<ResendEmail/>} />
            <Route exact path="/verified" name="Login Page" element={<Verified/>} />
            <Route exact path="/passwordresetmessage" name="Login Page" element={<PasswordResetMessage/>} />
            {targetPage}
          </Routes>
        </Suspense>
      </Router>
    )
  }
}

export default App;
