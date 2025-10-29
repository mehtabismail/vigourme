import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Platform,
  TouchableOpacity,
  Text,
  BackHandler,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
} from "react-native";
import Colors from "../../common/colors";
import Header from "../../components/header";
import Message from "../../components/message";
import SendMessage from "../../assets/icons/send_message.svg";
import GeneratePrescription from "../../assets/icons/generate_prescription.svg";
import navigationStrings from "../../common/navigationStrings";
import SendMessageWhite from "../../assets/icons/send_message_white.svg";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useGetReduxState from "../../customhooks/useGetReduxState";
import RNFetchBlob from "rn-fetch-blob";
import EndPoint from "../../common/apiEndpoints";
import Toast from "react-native-simple-toast";
import { apiRequest } from "../../api/apiRequest";
import useDetectKeyBoard from "../../hooks/useDetectKeyboard";
import FullScreenLoadingIndicator from "../../components/fullScreenLoadingIndicator";
import { getReceiverFcmToken, sendNotification } from "../../utils/fcmApi";
import downloadLatestPrescriptionPDF from "../../utils/downloadPrescription";
import { Button } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Cross from "../../assets/icons/cross.svg";
import BackArrow from "../../assets/icons/backArrowDark.svg";
import { useDispatch, useSelector } from "react-redux";
import { latestPrescription } from "../../redux/slices/medicineSlice";
import InfoIcon from "../../assets/icons/info_ride_details.svg";
import { SafeAreaView } from 'react-native-safe-area-context';

const Chat = (props: any) => {
  const { isKeyboardVisible, keyboardHeight } = useDetectKeyBoard();
  const states: any = useGetReduxState();
  const { navigation, route } = props;
  const [messagesList, setMessagesList] = useState<any>([]);
  const [chatId, setChatId] = useState();
  const [empityConversationText, setEmpityConversationText] = useState("");
  const [singleMessage, setSingleMessage] = useState<any>();
  const [fcmToken, setFcmToken] = useState<String>();
  const [modalVisible, setModalVisible] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [showDelivery, setShowDeliveryDetails] = useState(false);
  const [notificationVisibility, setNotificationVisibility] =
    useState<boolean>(false);
  const [orderPrescription, setOrderPrescription] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const [showDescription, setShowDescription] = useState(null);

  const dispatch = useDispatch();
  const { latest_prescription } = useSelector((state: any) => state?.medicines);

  const handleDeliveryDetails = (text, field) => {
    if (field == "contact_no") {
      setDeliveryDetails({
        ...deliveryDetails,
        [field]: deliveryDetails?.contact_no ? text : text,
      });
    } else {
      setDeliveryDetails({ ...deliveryDetails, [field]: text });
    }
  };

  const handleQuantity = (quantity, medicineId, price) => {
    const order = {
      medicine_id: medicineId,
      quantity: !!quantity ? parseInt(quantity) : 0,
      price: price * quantity,
    };

    if (orderPrescription == null) {
      setOrderPrescription([order]);
    } else {
      let found = false;
      let found_index = null;
      let arr = [...orderPrescription];
      orderPrescription?.map((item, index) => {
        if (item?.medicine_id == medicineId) {
          found = true;
          found_index = index;
        }
      });

      if (found == true) {
        arr.splice(found_index, 1);
        // if (!!quantity) {
        arr.push(order);
        setOrderPrescription(arr);
        // }
      } else {
        arr.push(order);
        setOrderPrescription(arr);
      }
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const getUserMessages = (id: any) => {
    const unSub = firestore()
      .collection("messages")
      .where("patientId", "==", id)
      .orderBy("time", "desc")
      .onSnapshot((documentSnapshot) => {
        const documents: any = documentSnapshot?.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        if (documents?.length > 0) {
          setMessagesList(documents);
          setChatId(documents?.[0]?.chatId);
          !!empityConversationText && setEmpityConversationText("");
        } else {
          setEmpityConversationText(
            "Kindly wait for the Doctor to start the conversation within 24 hours."
          );
        }
      });
    // Stop listening for updates when no longer required
    return unSub;
  };

  const getPrescriptionsNotification = (id: any) => {
    const unSub = firestore()
      .collection("prescription")
      .where("patientId", "==", id)
      .onSnapshot((documentSnapshot) => {
        const documents: any = documentSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        if (documents.length) {
          setNotificationVisibility(true);
        } else {
          setNotificationVisibility(false);
        }
      });
    return unSub;
  };

  const updateUnseenMessages = (id: any) => {
    return firestore()
      .collection("messages")
      .where("patientId", "==", id)
      .where("seen", "==", false)
      .onSnapshot((documentSnapshot) => {
        const documents: any = documentSnapshot?.docs?.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        // setUnseenMessages(documents);
        if (documents.length) {
          for (let i = 0; i < documents.length; i++) {
            if (documents[i].sentBy !== id) {
              const docRef = firestore()
                .collection("messages")
                .doc(documents[i].id);

              docRef.set({ seen: true }, { merge: true });
            }
          }
        }
      });
  };

  useEffect(() => {
    const backAction: any = () => {
      goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    let unSubPrescriptionsNotification: Function,
      unSubUserMessages: Function,
      unSubUpdateUnseenMessages: Function;
    AsyncStorage.getItem("userId").then((userId) => {
      unSubPrescriptionsNotification = getPrescriptionsNotification(userId);
      unSubUserMessages = getUserMessages(userId);
      unSubUpdateUnseenMessages = updateUnseenMessages(userId);
    });

    return () => {
      backHandler.remove();
      unSubUserMessages();
      unSubPrescriptionsNotification();
      unSubUpdateUnseenMessages();
    };
  }, []);

  useEffect(() => {
    // if (!!orderPrescription)
    let price = 0;
    orderPrescription?.map((item) => {
      price += item?.price;
      setTotalPrice(price);
    });
    return () => {};
  }, [orderPrescription, setOrderPrescription]);

  const sendMessage = async () => {
    let currentDateTime = firestore.FieldValue.serverTimestamp();
    const userId = await AsyncStorage.getItem("userId");
    const doctorId = await AsyncStorage.getItem("doctorId");
    const serialNumber = await AsyncStorage.getItem("serialNumber");

    if (chatId && singleMessage != "") {
      const chatRef = firestore().collection("chats").doc(chatId);
      const messageRef = firestore().collection("messages").doc();
      const batch = firestore().batch();
      batch.set(
        chatRef,
        {
          patientId: userId,
          // createdAt: currentDateTime,
          updatedAt: currentDateTime,
          recentMessage: {
            text: singleMessage,
            patientId: userId,
            doctorId: doctorId,
            time: currentDateTime,
            sentBy: userId,
            isAttachment: false,
          },
          seen: false,
        },
        { merge: true }
      );
      batch.set(messageRef, {
        chatId: chatRef.id,
        text: singleMessage,
        patientId: userId,
        doctorId: doctorId,
        time: currentDateTime,
        sentBy: userId,
        isAttachment: false,
        seen: false,
      });

      const tempMessage = singleMessage;
      try {
        setSingleMessage("");
        batch.commit().then(() => {
          const _sendNotification = (_fcmToken: any) => {
            !fcmToken && _fcmToken && setFcmToken(_fcmToken);
            _fcmToken &&
              sendNotification(
                {
                  fcmToken: _fcmToken,
                  notification: {
                    body: singleMessage,
                    title: serialNumber ? serialNumber : "New Message",
                  },
                },
                setFcmToken
              );
          };
          // get receiver fcmToken for notification and send notification
          fcmToken
            ? _sendNotification(fcmToken)
            : getReceiverFcmToken(doctorId, _sendNotification);
        });
      } catch (e: any) {
        setSingleMessage(tempMessage);
        Toast.show("Error: " + e.message);
      }
    }
  };

  const downloadLatestPrescription = async () => {
    const userId = await AsyncStorage.getItem("userId");
    Toast.show("Downloading.....");
    try {
      const { data }: any = await apiRequest(
        `${EndPoint.DOWNLOAD_PRESCRIPTION}/${userId}`,
        "get",
        ""
      );
      if (data) {
        console.log(data);
        const fileNameIndex = messagesList.findIndex(
          (msg: any) => msg?.isAttachment
        );
        const pdfFileName = messagesList[fileNameIndex]?.text;
        console.log("\n\npdfFileName", pdfFileName);
        await downloadLatestPrescriptionPDF(
          data.file,
          pdfFileName,
          Platform,
          RNFetchBlob,
          Toast
        );
      }
    } catch (error: any) {
      Toast.show(error);
    }
  };

  const orderMedicineHandler = async () => {
    let found = false;
    orderPrescription?.map((item) => {
      if (!item?.quantity) {
        found = true;
      }
    });
    if (!found) {
      if (
        deliveryDetails?.name &&
        deliveryDetails?.province &&
        deliveryDetails?.address &&
        deliveryDetails?.contact_no &&
        deliveryDetails?.city &&
        totalPrice
      ) {
        const formData = {
          ...deliveryDetails,
          prescription: orderPrescription,
          contact_no:
            "+92" +
            deliveryDetails?.contact_no.slice(
              1,
              deliveryDetails?.contact_no.length
            ),
          total_price: totalPrice,
        };
        if (formData?.contact_no.length == 13) {
          try {
            const response: any = await apiRequest(
              EndPoint.ORDER_MEDICINE,
              "post",
              formData
            );
            if (response?.status == 201) {
              setModalVisible(false);
              setTotalPrice(null);
              setDeliveryDetails(null);
              setTimeout(() => {
                Toast.show(response?.data?.message);
              }, 500);
            } else {
              Toast.show("Something went wrong in order now.");
              setModalVisible(false);
              setTotalPrice(null);
              setDeliveryDetails(null);
            }
          } catch (error) {
            console.log("error in catch block", error);
          }
        } else {
          Toast.show("Invalid Contact Number");
        }
      } else {
        Toast.show("Please fill all the delivery details");
      }
    } else {
      Toast.show("Please fill correct medicine quantity");
    }
  };

  const orderMedicinesModal = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        {
          <View
            style={{ backgroundColor: "white", width: "90%", borderRadius: 5 }}
          >
            <View>
              <View
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 20,
                  borderBottomColor: "grey",
                  borderBottomWidth: 1,
                  flexDirection: "row",
                  paddingHorizontal: 10,
                }}
              >
                {showDelivery && (
                  <TouchableOpacity
                    onPress={() => {
                      setTotalPrice(null);
                      setShowDeliveryDetails(false);
                    }}
                    style={{ marginRight: 5, padding: 5 }}
                  >
                    <BackArrow />
                  </TouchableOpacity>
                )}
                {showDescription && (
                  <TouchableOpacity
                    onPress={() => {
                      setTotalPrice(null);
                      setShowDescription(null);
                    }}
                    style={{ marginRight: 5, padding: 5 }}
                  >
                    <BackArrow />
                  </TouchableOpacity>
                )}
                <Text
                  style={{
                    fontSize: RFValue(16),
                    fontWeight: "600",
                    color: "black",
                  }}
                >
                  Medicine cart
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    setTotalPrice(null);
                    setShowDescription(null);
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Cross />
                </TouchableOpacity>
              </View>
              {!!showDescription ? (
                <View
                  style={{
                    width: "90%",
                    alignSelf: "center",
                    marginBottom: 25,
                  }}
                >
                  <Text style={{ marginVertical: 10, ...styles.mediumHeading }}>
                    {showDescription?.name.charAt(0).toUpperCase() +
                      showDescription?.name.slice(1) +
                      " Description"}
                  </Text>
                  <Text
                    style={{
                      fontSize: RFValue(12),
                      fontWeight: "300",
                      color: "black",
                    }}
                  >
                    {showDescription?.description}
                  </Text>
                </View>
              ) : !showDelivery ? (
                <View style={{ width: "100%", marginVertical: 15 }}>
                  <View style={{ flexDirection: "row", width: "100%" }}>
                    <View
                      style={{
                        width: "25%",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.mediumHeading}>No.</Text>
                    </View>
                    <View style={{ width: "25%" }}>
                      <Text style={styles.mediumHeading}>Medicine</Text>
                    </View>
                    <View style={{ width: "25%" }}>
                      <Text style={styles.mediumHeading}>Quantity</Text>
                    </View>
                    <View
                      style={{
                        width: "25%",

                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.mediumHeading}>Price</Text>
                    </View>
                  </View>
                  {latest_prescription?.map((item, index) => {
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          width: "100%",
                          marginTop: 10,
                          alignItems: "center",
                        }}
                      >
                        <View style={{ width: "25%", alignItems: "center" }}>
                          <Text>{index + 1}</Text>
                        </View>
                        <View
                          style={{
                            width: "25%",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text>{item?.name}</Text>
                          <TouchableOpacity
                            onPress={() => setShowDescription(item)}
                            style={{ marginLeft: 5 }}
                          >
                            <InfoIcon width={22} height={22} />
                          </TouchableOpacity>
                        </View>
                        <View style={{ width: "25%" }}>
                          <TextInput
                            placeholderTextColor={Colors.MESSAGE_TIME}
                            style={[styles.input]}
                            placeholder={"Quantity..."}
                            onChangeText={(e) =>
                              handleQuantity(e, item?.medicineId, item?.price)
                            }
                          />
                        </View>
                        <View style={{ width: "25%", alignItems: "center" }}>
                          <Text>{"Rs" + item?.price}</Text>
                        </View>
                      </View>
                    );
                  })}

                  <View
                    style={{
                      marginTop: 5,
                      alignItems: "flex-end",
                      width: "90%",
                      alignSelf: "center",
                    }}
                  >
                    <Text>
                      {`Total Price Rs${totalPrice > 0 ? totalPrice : 0}`}
                    </Text>
                  </View>
                </View>
              ) : (
                <ScrollView>
                  <View>
                    <View style={styles.addTitleContainer}>
                      <Text style={styles.text}>Name</Text>
                    </View>
                    <TextInput
                      placeholderTextColor={Colors.MESSAGE_TIME}
                      style={[styles.input]}
                      placeholder={"Enter Name..."}
                      onChangeText={(e) => handleDeliveryDetails(e, "name")}
                    />
                    <View style={styles.addTitleContainer}>
                      <Text style={styles.text}>Address</Text>
                    </View>
                    <TextInput
                      placeholderTextColor={Colors.MESSAGE_TIME}
                      style={[styles.input]}
                      placeholder={"Enter Address..."}
                      onChangeText={(e) => handleDeliveryDetails(e, "address")}
                    />
                    <View style={styles.addTitleContainer}>
                      <Text style={styles.text}>City</Text>
                    </View>
                    <TextInput
                      placeholderTextColor={Colors.MESSAGE_TIME}
                      style={[styles.input]}
                      placeholder={"Enter City..."}
                      onChangeText={(e) => handleDeliveryDetails(e, "city")}
                    />
                    <View style={styles.addTitleContainer}>
                      <Text style={styles.text}>Province</Text>
                    </View>
                    <TextInput
                      placeholderTextColor={Colors.MESSAGE_TIME}
                      style={[styles.input]}
                      placeholder={"Enter Province..."}
                      onChangeText={(e) => handleDeliveryDetails(e, "province")}
                    />
                    <View style={styles.addTitleContainer}>
                      <Text style={styles.text}>Contact number</Text>
                    </View>
                    <TextInput
                      placeholderTextColor={Colors.MESSAGE_TIME}
                      maxLength={13}
                      style={[styles.input]}
                      keyboardType='number-pad'
                      placeholder={"Enter Contact Number..."}
                      onChangeText={(e) =>
                        handleDeliveryDetails(e, "contact_no")
                      }
                      value={
                        deliveryDetails?.contact_no &&
                        deliveryDetails?.contact_no
                      }
                    />
                    <View
                      style={[
                        { width: "90%", alignSelf: "center", marginTop: -5 },
                      ]}
                    >
                      <Text style={{ fontSize: 12, color: "grey" }}>
                        Formate 03xxxxxxxxx
                      </Text>
                    </View>
                  </View>
                </ScrollView>
              )}
            </View>
            {!showDescription && (
              <>
                {!showDelivery ? (
                  <View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.BUTTON_BG2,
                        borderRadius: 5,
                        width: "70%",
                        alignSelf: "center",
                        height: 40,
                        marginVertical: 15,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => {
                        !!orderPrescription && totalPrice > 0
                          ? setShowDeliveryDetails(true)
                          : Toast.show("Please enter medicine quantity");
                      }}
                    >
                      <Text style={styles.buttonTitle}>
                        Add Delivery Address
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.BUTTON_BG2,
                        borderRadius: 5,
                        width: "70%",
                        alignSelf: "center",
                        height: 40,
                        marginVertical: 15,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => orderMedicineHandler()}
                    >
                      <Text style={styles.buttonTitle}>Order Now</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>
        }
      </View>
    );
  };

  const navigate = (path: String) => {
    navigation.navigate(path);
  };

  const MessageComponent = () => {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ marginHorizontal: 20, flex: 1 }}>
          {!(messagesList.length > 0 || !!empityConversationText) && (
            <FullScreenLoadingIndicator />
          )}
          {empityConversationText ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: Colors.GRAY_GARK,
                  padding: 30,
                  fontSize: 16,
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                {empityConversationText}
              </Text>
            </View>
          ) : (
            <FlatList
              style={[styles.flatList, { zIndex: 2 }]}
              showsVerticalScrollIndicator={false}
              data={messagesList}
              // key={"_"}
              inverted={true}
              renderItem={({ item }: any) => {
                return (
                  <Message
                    isAttachment={item.isAttachment}
                    time={item.time}
                    sentBy={item.sentBy}
                    messageValue={item.text}
                    messageId={item.id}
                    seen={item.seen}
                  />
                );
              }}
            />
          )}
        </View>

        <View
          style={[
            styles.typeSendMessageContainer,
            {
              paddingVertical: Platform.OS == "ios" ? 18 : 3,
            },
          ]}
        >
          <TextInput
            editable={!!!empityConversationText}
            placeholder='Type a Message'
            multiline={true}
            placeholderTextColor={Colors.MESSAGE_TIME}
            style={styles.inputStyle}
            value={singleMessage}
            onChangeText={(text: any) => setSingleMessage(text)}
          />
          <TouchableOpacity
            disabled={!!!singleMessage}
            onPress={sendMessage}
            style={[
              styles.sendMessageButton,
              !!!singleMessage
                ? { backgroundColor: Colors.GRAYTEXTDARK }
                : null,
            ]}
          >
            <SendMessageWhite />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const getLatestMedicines = async () => {
    const userId = await AsyncStorage.getItem("userId");
    console.log("passed");
    try {
      const { data }: any = await apiRequest(
        `${EndPoint.LATEST_PRESCRIPTION}/${userId}`,
        "get",
        ""
      );
      if (data?.prescription?.medicineList?.length > 0) {
        setShowDeliveryDetails(false);
        setTotalPrice(null);
        setModalVisible(true);
        dispatch(latestPrescription(data?.prescription?.medicineList));
      } else {
        Toast.show("No medicine prescribed...");
      }
    } catch (error: any) {
      Toast.show(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header filledLogo backPress={goBack} title={`Chat`} shadow />
      {notificationVisibility ? (
        <>
          <View style={[styles.downloadSurveyReport]}>
            <Text style={styles.downloadTextDesc}>
              Click on view button to see the prescribed medicine by doctor.
            </Text>
            <TouchableOpacity onPress={downloadLatestPrescription}>
              <Text style={styles.downloadText}>View</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.downloadSurveyReport]}>
            <Text style={styles.downloadTextDesc}>
              Order prescribed medicines
            </Text>
            <TouchableOpacity onPress={() => getLatestMedicines()}>
              <Text style={styles.downloadText}>Order</Text>
            </TouchableOpacity>
            <Modal
              animationType='slide'
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              {orderMedicinesModal()}
            </Modal>
          </View>
        </>
      ) : null}

      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {MessageComponent()}
        </KeyboardAvoidingView>
      ) : (
        MessageComponent()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  flatList: { flex: 1 },
  typeSendMessageContainer: {
    backgroundColor: Colors.INCOMING_MESSAGE_BG,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    borderRadius: 8,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  inputStyle: {
    width: "80%",
    color: Colors.BLACK,
  },
  input: {
    paddingVertical: Platform.OS === "ios" ? 15 : 8,
    width: "90%",
    borderRadius: 6,
    borderWidth: 1,
    marginVertical: 12,
    borderColor: Colors.INPUT_BORDER,
    backgroundColor: Colors.WHITE,
    color: Colors.BLACK,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignSelf: "center",
  },
  sendMessageButton: {
    position: "absolute",
    padding: 10,
    borderRadius: 50,
    backgroundColor: Colors.BUTTON_BG,
    // borderRadius: 50,
    right: 20,

    // paddingRight: 4,
    // paddingBottom: 2,
    bottom: 10,
  },
  downloadSurveyReport: {
    width: "100%",
    backgroundColor: Colors.DOWNLOAD_SURVEY_CONTAINER,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 40,
    alignItems: "center",
  },
  downloadTextDesc: {
    color: Colors.DARK_TEXT_COLOR,
    fontSize: 10,
    fontWeight: "500",
  },
  downloadText: {
    color: Colors.WHITE,
    fontSize: 14,
    fontWeight: "800",
    backgroundColor: Colors.BUTTON_BG2,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  mediumHeading: {
    fontSize: RFValue(14),
    fontWeight: "500",
    color: "black",
  },
  buttonTitle: {
    fontSize: RFValue(12),
    fontWeight: "500",
    color: "white",
  },
  addTitleContainer: {
    justifyContent: "center",
    width: "90%",
    alignSelf: "center",
    marginTop: 10,
  },
});

export default Chat;
