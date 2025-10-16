import HTTP_CLIENT from "./axiosConfig";

export const apiRequest = (url: string, method: string, body: Object) => {
  try {
    switch (method) {
      case "get":
        return HTTP_CLIENT.get(url);
      case "delete":
        return HTTP_CLIENT.delete(url);
      case "post":
        return HTTP_CLIENT.post(url, body);
      case "patch":
        return HTTP_CLIENT.patch(url, body);
      case "put":
        return HTTP_CLIENT.put(url, body);
      default:
        return HTTP_CLIENT.get(url);
    }
  } catch (error) {
    return new Promise((_, reject) => {
      reject({ error });
    });
  }
};
