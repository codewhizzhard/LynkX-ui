import axios from "axios";

const lynkXData = axios.create({
    baseURL: "https://lynkx-data.onrender.com/api/user/",
    headers: {
        "content-type": "application/json",
    }
})


lynkXData.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    //console.log("Token:", token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})


export default lynkXData;