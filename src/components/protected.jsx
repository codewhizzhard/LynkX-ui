import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
    const token = localStorage.getItem("token");

    return token ?  <Outlet /> : <Navigate to={"/"} replace />
}

export default ProtectedRoutes