import React from 'react'
import Dashboard from '../merchant/dashboard';
import ProviderDashboard from '../liquidityProvider/dashboard';
import { useParams } from 'react-router-dom';

const DisplayDashboard = () => {
    const {userType} = useParams();
    
    if (userType === "merchant") return (<Dashboard />)
    if (userType === "liquidityProvider") return (<ProviderDashboard />)
  
}

export default DisplayDashboard