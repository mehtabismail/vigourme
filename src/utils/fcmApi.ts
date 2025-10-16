import firestore from "@react-native-firebase/firestore";
import EndPoint from "../common/apiEndpoints";
import { apiRequest } from "../api/apiRequest";
import Toast from "react-native-simple-toast";

// send notification via firebase POST fcm API
export const sendNotification = async (data: any, setId: any) => {
  const url =
    "https://fcm.googleapis.com/v1/projects/consultancy-cf28b/messages:send";
  const webKey =
    "key=AAAARWwnvN0:APA91bFqGsCKeq9OeAPbuvizKPfRVPWVqRmecsZxbvUWhpgS97XZXcZjT4YeZQ8oG6C1sbAZxFx5EZo3TGr58mmWNaCe-_6i3KSINxNJqGyA8EX1pdkLGfBFbPxUlaDOXwrJf31ll318";

  const response: any = await apiRequest(
    EndPoint.FIREBASE_PRIVATE_TOKEN,
    "get",
    ""
  );

  if (!!response?.data?.accessToken) {
    fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + response?.data?.accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          token: data?.fcmToken,
          notification: {
            ...data?.notification,
          },
        },
        // data: {
        //   body: "The message from the React Native and Firebase (data)",
        //   title: "React Native Firebase",
        //   content_available: true,
        //   priority: "high",
        // },
      }),
    })
      .then((response: any) => response.text())
      .then((res: any) => {
        console.log("fcm sending responce :=> ", res);
        res?.results && res?.results[0]?.error === "NotRegistered" && setId("");
      })
      .catch((error) => console.error(error));
  } else {
    Toast.show("Private Access Token Doesn't exist.");
  }
};

// get token from firestore
export const getReceiverFcmToken = (id: any, setId: any) => {
  console.log("getting fcm token from firestore");
  try {
    firestore()
      .collection("users")
      .doc(id)
      .get()
      .then((res: any) => {
        console.log(res.data());
        setId(res.data()?.fcmToken);
      });
  } catch {
    setId("");
  }
};

// add token on firestore
export const sendFcmToFirestore = (fcmToken: any, id: any) => {
  firestore()
    .collection("users")
    .doc(id)
    .update({
      fcmToken: fcmToken,
    })
    .then(() => {
      console.log("FCM Token add");
    });
};
