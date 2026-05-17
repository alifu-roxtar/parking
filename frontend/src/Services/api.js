import axios from "axios";

const API = axios.create({
    baseURL: "https://parking-arbw.onrender.com/api"
});

export default API;