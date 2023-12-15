import './App.css';
import * as React from "react";
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavbarLayout from './Layout/Navbar';
import DashboardLayout from './Layout/Dashboard';
import ProductsLayout from './Layout/Products';
import AnalyticsLayout from './Layout/Analytics';
import AccountLayout from './Layout/Account';
import Authentication from './Layout/Authentication'
import Error, { Unlisted } from './Layout/Error.jsx'
import { AdminMerchant } from './Layout/AdminMerchant.jsx';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { app } from './firebase-config.js';
import { getMerchantData } from './Javascript/MerchantHandler.js';
import FeedbackLayout from './Layout/Feedback.jsx';
import AdminLayout from './Layout/Admin.jsx';

export default function App() {

  const [merchant, setMerchant] = useState(null)
  const [authLoaded, setAuthLoaded] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), async (merchant) => {
      if(merchant && merchant.email !== "beefood.contact@gmail.com"){
        var merchantData = await getMerchantData(merchant.email)
        setMerchant(merchantData)
      } else {
        setMerchant(null)
      }
      setAuthLoaded(true);
    });

    return () => unsubscribe(); 
  }, []);

  if (!authLoaded) {
    return <div className='h-screen w-screen bg-gray-200 dark:bg-slate-950'/>
  }

  function ProtectedRoute({
    allow,
    redirectPath = "/login",
    children,
  }) {
    if (!allow) {
      return <Navigate to={redirectPath} />
    }
  
    return children
  }

  return  (
    <Router>
      <Routes>

        <Route path='/' element={ merchant ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

        <Route path='/login' element={
          <ProtectedRoute allow={!merchant} redirectPath={'/dashboard'} >
            <Authentication type={"Login"}/>
         </ProtectedRoute>
        }>
        </Route>

        <Route path='/register' element={
          <ProtectedRoute allow={!merchant} redirectPath={'/dashboard'} >
            <Authentication type={"Register"}/>
          </ProtectedRoute>
        }>
        </Route>

        <Route path='/register/success' element={
          <ProtectedRoute allow={!merchant} redirectPath={'/dashboard'}>
            <Error description="Thank you for registering!" />
          </ProtectedRoute>
        }>
        </Route>

        <Route path='/register/unlisted' element={
          <ProtectedRoute allow={!merchant} redirectPath={'/dashboard'}>
            <Unlisted />
          </ProtectedRoute>
        }>
        </Route>

        <Route path='/admin' element={
          <AdminLayout />
        }>
        </Route>

        <Route path='/admin/addmerchant' element={
          <AdminMerchant page={"Add Merchant"} />
        }>
        </Route>

        <Route path='/admin/verifyhalal' element={
          <AdminMerchant page={"Verify Halal"} />
        }>
        </Route>

        <Route path='/admin/feedback' element={
          <FeedbackLayout />
        }>
        </Route>

        <Route path='/dashboard' element={
          <ProtectedRoute allow={merchant}>
            <NavbarLayout activePage={"Dashboard"}/>
            <div className="xl:px-12 xl:py-8 md:px-8 md:py-6 px-4 py-2 sm:ml-64 bg-gray-100 dark:bg-slate-950 min-h-screen relative">
              <DashboardLayout merchanRef={merchant} />
            </div>
          </ProtectedRoute>
        }>
        </Route>

        <Route path='/products' element={
          <ProtectedRoute allow={merchant}>
            <NavbarLayout activePage={"Products"}/>
            <div className="xl:px-12 xl:py-8 md:px-8 md:py-6 px-4 py-2 sm:ml-64 bg-gray-100 dark:bg-slate-950 min-h-screen relative">
              <ProductsLayout merchanRef={merchant} />
            </div>
          </ProtectedRoute>
        }>
        </Route>

        <Route path='/analytics' element={
          <ProtectedRoute allow={merchant}>
            <NavbarLayout activePage={"Analytics"}/>
            <div className="xl:px-12 xl:py-8 md:px-8 md:py-6 px-4 py-2 sm:ml-64 bg-gray-100 dark:bg-slate-950 min-h-screen relative">
              <AnalyticsLayout merchanRef={merchant} />
            </div>
          </ProtectedRoute>
        }>
        </Route>

        <Route path='/account' element={
          <ProtectedRoute allow={merchant}>
            <NavbarLayout activePage={"Account"}/>
            <div className="xl:px-12 xl:py-8 md:px-8 md:py-6 px-4 py-2 sm:ml-64 bg-gray-100 dark:bg-slate-950 min-h-screen relative">
              <AccountLayout merchanRef={merchant} setMerchantRef={setMerchant} />
            </div>
          </ProtectedRoute>
        }>
        </Route>

        <Route path='*' element={<Error code="404" description="Page Not Found!" />} />

      </Routes>
    </Router>
  );
}