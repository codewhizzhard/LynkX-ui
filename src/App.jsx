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
import Role from "./pages/landingPage/role";
import ProtectedRoutes from "./components/protected";
import History from "./pages/merchant/history";
import Settings from "./pages/merchant/settings";
import SendPayment from "./ReceivePayment/sendPayment";
import ProxyAwareContract from "./pages/home";


function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/pay/:id" element={<SendPayment />} />
      {/*   <Route path="/" element={<ConnectWallet />} />
        <Route path={"/:userType"} element={<Layout />}>
        <Route index element={<DisplayDashboard />}/>
        <Route path="receive" element={<Receive />} />
        <Route path="withdraw" element={<Withdraw />} />
        </Route> */}
        <Route path="/" element={<MainRoute />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/roles" element={<Role />} />
          <Route path="*" element={<Missing />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
        <Route path="/:userType" element={<Layout />}>
        <Route index element={<DisplayDashboard />} />
        <Route path="gg" element={<ProxyAwareContract />} />
        <Route path="receive" element={<Receive />} />
        <Route path="withdraw" element={<Withdraw />} />
        <Route path="history" element={<History />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Missing />} />
        </Route>
        </Route>
      </Routes> 
    </BrowserRouter>
    
    </>
    
  )
}

export default App
