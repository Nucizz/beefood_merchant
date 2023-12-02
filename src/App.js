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
import AddMerchant from './Layout/AddMerchant.jsx';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { app, getFCMToken } from './firebase-config.js';
import { getMerchantData } from './Javascript/MerchantHandler.js';
import FeedbackLayout from './Layout/Feedback.jsx';

export default function App() {

  const [merchant, setMerchant] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [isTokenFound, setTokenFound] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), async (merchant) => {
      if(merchant){
        await getFCMToken(setTokenFound)
        const merchantData = await getMerchantData(merchant.email)
        setMerchant(merchantData)
      } else {
        setMerchant(null)
      }
      setAuthLoaded(true);
    });

    return () => unsubscribe(); 
  }, []);

  if (!authLoaded) {
    return <></>;
  }

  function ProtectedRoute({
    allow,
    redirectPath = "/login",
    children,
  }) {
    if (!allow) {
      return <Navigate to={redirectPath} />;
    }
  
    return children;
  };

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

        <Route path='/admin/addmerchant' element={
          <AddMerchant />
        }>
        </Route>

        <Route path='/event/feedback' element={
          <FeedbackLayout />
        }>
        </Route>

        <Route path='/dashboard' element={
          <ProtectedRoute allow={merchant}>
            <NavbarLayout/>
            <div className="xl:px-12 xl:py-8 md:px-8 md:py-6 px-4 py-2 sm:ml-64">
              <DashboardLayout merchant={merchant} />
            </div>
          </ProtectedRoute>
        }>
        </Route>

        <Route path='/products' element={
          <ProtectedRoute allow={merchant}>
            <NavbarLayout/>
            <div className="xl:px-12 xl:py-8 md:px-8 md:py-6 px-4 py-2 sm:ml-64">
              <ProductsLayout />
            </div>
          </ProtectedRoute>
        }>
        </Route>

        <Route path='/analytics' element={
          <ProtectedRoute allow={merchant}>
            <NavbarLayout/>
            <div className="xl:px-12 xl:py-8 md:px-8 md:py-6 px-4 py-2 sm:ml-64">
              <AnalyticsLayout />
            </div>
          </ProtectedRoute>
        }>
        </Route>

        <Route path='/account' element={
          <ProtectedRoute allow={merchant}>
            <NavbarLayout/>
            <div className="xl:px-12 xl:py-8 md:px-8 md:py-6 px-4 py-2 sm:ml-64">
              <AccountLayout merchant={merchant} setMerchantRef={setMerchant} />
            </div>
          </ProtectedRoute>
        }>
        </Route>

        <Route path='*' element={<Error code="404" description="Page Not Found!" />} />

      </Routes>
    </Router>
  );
}