import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/products";

class UserService {
  getPublicContent() {
    return axios.get(API_URL);
  }
  getGreetings() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getProducts() {
    return axios.get(API_URL, { headers: authHeader() });
  }
  getProductName(name) {
    return axios.get(API_URL.concat("/detail-name/").concat(name), {
      headers: authHeader(),
    });
  }
  addProduct(nombre, precio) {
    return axios.post(API_URL, { nombre, precio }, { headers: authHeader() });
  }

  deleteProduct(id) {
    return axios.delete(API_URL.concat("/").concat(id), {
      headers: authHeader(),
    });
  }
  getProduct(id) {
    return axios.get(API_URL.concat("/").concat(id), { headers: authHeader() });
  }

  putProduct(id, nombre, precio) {
    return axios.put(
      API_URL.concat("/").concat(id),
      { nombre, precio },
      { headers: authHeader() }
    );
  }
}
export default new UserService();
