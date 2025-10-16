import HTTP_CLIENT_FOR_SUBMIT from "./axiosConfigForSubmit";

export const apiRequestSubmit = (url: string, method: string, body: Object) => {
  try {
    switch (method) {
      case "get":
        return HTTP_CLIENT_FOR_SUBMIT.get(url);
      case "delete":
        return HTTP_CLIENT_FOR_SUBMIT.delete(url);
      case "post":
        return HTTP_CLIENT_FOR_SUBMIT.post(url, body);
      case "patch":
        return HTTP_CLIENT_FOR_SUBMIT.patch(url, body);
      case "put":
        return HTTP_CLIENT_FOR_SUBMIT.put(url, body);
      default:
        return HTTP_CLIENT_FOR_SUBMIT.get(url);
    }
  } catch (error) {
    return new Promise((_, reject) => {
      reject({ error });
    });
  }
};
