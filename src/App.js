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
import { app } from './firebase-config.js';
import { getUserData } from './Javascript/AuthenticationScript.js';
import FeedbackLayout from './Layout/Feedback.jsx';

export default function App() {

  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), async (user) => {
      if(user){
        const userData = await getUserData(user.email)
        setUser(userData)
      } else {
        setUser(null)
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

        <Route path='/' element={ user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

        <Route path='/login' element={
          <ProtectedRoute allow={!user} redirectPath={'/dashboard'} >
            <Authentication type={"Login"}/>
         </ProtectedRoute>
        }>
        </Route>

        <Route path='/register' element={
          <ProtectedRoute allow={!user} redirectPath={'/dashboard'} >
            <Authentication type={"Register"}/>
          </ProtectedRoute>
        }>
        </Route>

        <Route path='/register/success' element={
          <ProtectedRoute allow={!user} redirectPath={'/dashboard'}>
            <Error description="Thank you for registering!" />
          </ProtectedRoute>
        }>
        </Route>

        <Route path='/register/unlisted' element={
          <ProtectedRoute allow={!user} redirectPath={'/dashboard'}>
            <Unlisted />
          </ProtectedRoute>
        }>
        </Route>

        <Route path='/adminaddmerchant' element={
          <AddMerchant />
        }>
        </Route>

        <Route path='/feedback' element={
          <FeedbackLayout />
        }>
        </Route>

        <Route path='/dashboard' element={
          <ProtectedRoute allow={user}>
            <NavbarLayout/>
            <div className="px-12 py-8 sm:ml-64">
              <DashboardLayout />
            </div>
          </ProtectedRoute>
        }>
        </Route>

        <Route path='/products' element={
          <ProtectedRoute allow={user}>
            <NavbarLayout/>
            <div className="px-12 py-8 sm:ml-64">
              <ProductsLayout />
            </div>
          </ProtectedRoute>
        }>
        </Route>

        <Route path='/analytics' element={
          <ProtectedRoute allow={user}>
            <NavbarLayout/>
            <div className="px-12 py-8 sm:ml-64">
              <AnalyticsLayout />
            </div>
          </ProtectedRoute>
        }>
        </Route>

        <Route path='/account' element={
          <ProtectedRoute allow={user}>
            <NavbarLayout/>
            <div className="px-12 py-8 sm:ml-64">
              <AccountLayout user={user} />
            </div>
          </ProtectedRoute>
        }>
        </Route>

        <Route path='*' element={<Error code="404" description="Page Not Found!" />} />

      </Routes>
    </Router>
  );
}