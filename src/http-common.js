// http-common.js
//  목적 : springboot 와 axios 통신을 위한 기본 설정
import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8000/api",
  // baseURL: "http://150.230.248.90:8000/api",
  // baseURL: "http://192.168.50.69:8000/api",
  headers: {
    "Content-Type": "application/json"
  }
});