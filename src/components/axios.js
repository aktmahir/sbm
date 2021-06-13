import axios from "axios";

const instance = axios.create({
  baseURL: "...", //the api (cloud fuction) url
});

export default instance;
