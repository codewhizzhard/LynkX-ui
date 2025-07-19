import {BrowserRouter, Routes, Route} from "react-router-dom";
import ConnectWallet from "./pages/landingPage/mainRoute";
import Home from "./pages/landingPage/home";
import Layout from "./components/Layout";
import Dashboard from "./pages/merchant/dashboard";
import Receive from "./pages/merchant/receive";
import Missing from "./pages/missing";
import DisplayDashboard from "./pages/displays/displayDashboard";
import Withdraw from "./pages/merchant/withdraw";
import MainRoute from "./pages/landingPage/mainRoute";
import About from "./pages/landingPage/about";


function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
      {/*   <Route path="/" element={<ConnectWallet />} />
        <Route path={"/:userType"} element={<Layout />}>
        <Route index element={<DisplayDashboard />}/>
        <Route path="receive" element={<Receive />} />
        <Route path="withdraw" element={<Withdraw />} />
        </Route> */}
        <Route path="/" element={<MainRoute />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
        
        <Route path="*" element={<Missing />} />
        </Route>
      </Routes> 
    </BrowserRouter>
    
    </>
    
  )
}

export default App
