const DEV_URL = "http://192.168.100.17:3100/api";

const PROD_URL = "https://api.sencillo.ar/api";

// eslint-disable-next-line
const baseURL = process.env.NODE_ENV === "development" ? DEV_URL : PROD_URL;

export { baseURL };
