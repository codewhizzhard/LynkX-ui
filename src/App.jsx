import {BrowserRouter, Routes, Route} from "react-router-dom";
import ConnectWallet from "./pages/connectWallet";
import Home from "./pages/home";
import Layout from "./components/Layout";
import Dashboard from "./pages/merchant/dashboard";
import Receive from "./pages/merchant/receive";
import Missing from "./pages/missing";
import DisplayDashboard from "./pages/displays/displayDashboard";


function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ConnectWallet />} />
        <Route path={"/:userType"} element={<Layout />}>
        <Route index element={<DisplayDashboard />}/>
        <Route path="receive" element={<Receive />} />
        </Route>
        <Route path="*" element={<Missing />} />
      </Routes> 
    </BrowserRouter>
    
    </>
    
  )
}

export default App
