import axios from "axios";
import { baseURL } from "../config/url";
import { versionApp as Version } from "../config/version";

const SECOND = 1000;
const MINUTES = 60 * SECOND;

const http = axios.create({
  timeout: MINUTES * 1,
});

http.defaults.baseURL = baseURL;

http.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  config.headers = {
    Authorization: `${token}`,
    "Content-Type": "application/json",
    Version,
  };
  return config;
});

export { http };