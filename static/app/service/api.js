import { store } from "./store.js";
const endpoint = "/api/modbus";

export function read(registers) {
  if (!store.address || !store.port || !registers || !registers.length) {
    return Promise.reject(new Error("Please configure modbus connection."));
  }

  return fetch(endpoint, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify({
      "address": store.address,
      "port": store.port,
      registers,
    })
  })
}

