import axios from "axios";

export const url = "http://127.0.0.1:5000/api/";

export default function useHit() {
  return async function (endpoint, data) {
    return await new Promise((r, e) => {
      axios
        .post(url + endpoint, data)
        .then((res) => {
          r(res?.data);
        })
        .catch((err) => {
          e(err?.response?.data);
        });
    });
  };
}
