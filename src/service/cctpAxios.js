import axios from "axios";

const cctpData = axios.create({
    baseURL: "https://lynkx-data.onrender.com/api/users/",
    headers: {
        "content-type": "application/json",
    }
})



export default cctpData;