import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Colors from "../../common/colors";
import Button from "../../components/button";
import Header from "../../components/header";
import HeadingWithTitle from "../../components/headingWithTitle";
import Input from "../../components/Inputs";
import Add from "../../assets/icons/add.svg";
import GenderDropdown from "../../components/genderDropdown";
import navigationStrings from "../../common/navigationStrings";
import DownArrow from "../../assets/icons/down_arrow.svg";
import { apiRequest } from "../../api/apiRequest";
import EndPoint from "../../common/apiEndpoints";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";
import { getReceiverFcmToken, sendNotification } from "../../utils/fcmApi";
import { debounce } from "lodash";
import Cross from "../../assets/icons/cross.svg";
import { useDispatch, useSelector } from "react-redux";
import { selectedMedicinesList } from "../../redux/slices/medicineSlice";
import { SafeAreaView } from 'react-native-safe-area-context';

const Prescription = (props: any) => {
  const { navigation, route } = props;
  const { patientId, chatId, approveSurvey, fromPandingSurveys } =
    route?.params;
  const [genderDropdownVisibility, setGenderDropdownVisibility] =
    useState(false);
  const [gender, setGender] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [search, setSearch] = useState(null);
  const [focusDescription, setFocusDescription] = useState(false);
  const inputArray = {
    1: {
      number: 1,
      medicineName: "",
    },
  };

  const dispatch = useDispatch();
  const { selected_medicines } = useSelector((state) => state?.medicines);

  const [medicineList, setMedicineList] = useState<any>(inputArray);
  const [medicineListData, setMedicineListData] = useState([]);
  const [prescriptionData, setPrescriptionData] = useState({
    gender: "",
    patientName: "",
    medicineList: selected_medicines,
    description: "",
  });

  const goBack = () => {
    dispatch(selectedMedicinesList([]));
    navigation.goBack();
  };

  const navigate = (path: string) => {
    navigation.navigate(path);
  };

  const addField = () => {
    setMedicineList({
      ...medicineList,
      [Object.keys(medicineList).length + 1]: {
        medicineName: "",
        number: Object.keys(medicineList).length + 1,
      },
    });
  };

  const handleAttributeChange = (value: string, index: number) => {
    setMedicineList({
      ...medicineList,
      [index]: { ...medicineList[index], medicineName: value },
    });
  };

  const handleChangeInput = (value: String, name: String) => {
    setPrescriptionData((prev) => ({
      ...prev,
      [`${name}`]: value,
    }));
  };

  const UnderHeadingText = (props: any) => {
    return (
      <Text style={styles.headingText}>
        Prescribe the medicine to patient according to his condition.
      </Text>
    );
  };

  const sendMessage = async (prescription: any) => {
    let currentDateTime = new Date();
    const userId = await AsyncStorage.getItem("userId");
    const doctorId = await AsyncStorage.getItem("doctorId");

    if (chatId) {
      const chatRef = firestore().collection("chats").doc(chatId);
      const messageRef = firestore().collection("messages").doc();
      const batch = firestore().batch();
      batch.set(
        chatRef,
        {
          patientId: patientId,
          // createdAt: currentDateTime,
          updatedAt: currentDateTime,
          recentMessage: {
            // text: prescription?.prescriptionFormat+".pdf",
            text: "Prescription.pdf",
            patientId: patientId,
            doctorId: doctorId,
            time: currentDateTime,
            sentBy: userId,
            isAttachment: true,
            prescription: prescription,
          },
          seen: false,
        },
        { merge: true }
      );
      batch.set(messageRef, {
        chatId: chatRef.id,
        // text: prescription?.prescriptionFormat+".pdf",
        text: "Prescription.pdf",
        patientId: patientId,
        doctorId: doctorId,
        time: currentDateTime,
        sentBy: userId,
        isAttachment: true,
        prescription: prescription,
        seen: false,
      });
      batch.commit().then(() => {
        const _sendNotification = (_fcmToken: any) => {
          console.log("\n\n\n_fcmToken: ", _fcmToken);
          _fcmToken &&
            sendNotification(
              {
                fcmToken: _fcmToken,
                notification: {
                  body: "Your doctor sent you a new prescription",
                  title: "New Prescription",
                },
              },
              () => {}
            );
        };
        // get receiver fcmToken for notification and send notification
        getReceiverFcmToken(patientId, _sendNotification);

        // approve survey
        fromPandingSurveys && approveSurvey && approveSurvey();
      });
    }
  };

  const submitPrescription = async () => {
    if (!prescriptionData?.description) {
      return Toast.show("Please enter description.");
    } else {
      let formData = {
        ...prescriptionData,
        medicineList: selected_medicines,
        gender: "male",
      };

      try {
        const response: any = await apiRequest(
          `${EndPoint.SUBMIT_PRESCRIPTION}/${patientId}`,
          "post",
          formData
        );
        console.log(response, "checking response");
        const { data } = response;
        sendMessage(data.prescription);
        Toast.show(data.message);
        goBack();
      } catch (error: any) {
        Toast.show(error);
      }
    }
  };

  useEffect(() => {
    if (route?.params?.patientId) {
      try {
        firestore()
          .collection("users")
          .doc(route?.params?.patientId)
          .get()
          .then((row) => {
            setGender(row.data()?.gender);
            setSerialNumber(row.data()?.serialNumber);
            setPrescriptionData({
              ...prescriptionData,
              patientName: row.data()?.name,
              gender: row.data()?.gender,
            });
          });
      } catch (error: any) {
        Toast.show(error);
      }
    }
  }, []);

  // useEffect(() => {
  //   if (selectedMedicines?.length > 0) {
  //     console.log(selectedMedicines);
  //   }
  //   return () => {};
  // }, [selectedMedicines]);

  const dropDownList = () => {
    const renderItem = ({ item, index }) => {
      return (
        <TouchableOpacity
          onPress={() => {
            let found = false;
            if (selected_medicines?.length <= 0) {
              let data = {
                medicineId: item?.id,
                number: selected_medicines.length + 1,
                name: item?.name,
              };
              dispatch(
                selectedMedicinesList([
                  {
                    medicineId: item?.id,
                    number: selected_medicines.length + 1,
                    name: item?.name,
                  },
                ])
              );
            } else {
              selected_medicines?.map((med) => {
                if (med?.id == item?.id) {
                  found = true;
                }
              });
              if (found == false) {
                dispatch(
                  selectedMedicinesList([
                    ...selected_medicines,
                    {
                      medicineId: item?.id,
                      number: selected_medicines?.length + 1,
                      name: item?.name,
                    },
                  ])
                );
              }
            }
            setSearch(null);
          }}
          style={{
            width: "100%",
            alignSelf: "center",
            borderTopLeftRadius: index == 0 ? 5 : 0,
            borderTopRightRadius: index == 0 ? 5 : 0,
            // borderBottomLeftRadius: index == 1 ? 5 : 0,
            // borderBottomRightRadius: index == 1 ? 5 : 0,
            borderBottomLeftRadius:
              index == medicineListData?.length - 1 ? 5 : 0,
            borderBottomRightRadius:
              index == medicineListData?.length - 1 ? 5 : 0,
            borderColor: "grey",
            borderWidth: 1,
          }}
        >
          <Text style={styles.medicineText}>{item?.name}</Text>
        </TouchableOpacity>
      );
    };
    return (
      <View>
        <FlatList
          data={medicineListData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  };

  const handlerSearching = (arg) => {
    // return console.log(arg);
    // return console.log(medicineListData);
    var meds: any = [];
    try {
      medicineListData?.map((item) => {
        if (item?.name?.toLowerCase()?.includes(arg)) {
          meds = [...meds, item];
          console.log(meds, "running...");
        }
      });

      console.log(meds, "found thiss");
      // const response: any = await apiRequest(arg, "get", "");
      setMedicineListData(meds);
    } catch (e) {
      console.log("\n\n\nuserSearch Error:", e);
    }
  };

  const handlerSearchingMedicine = useCallback(
    debounce(async (arg) => {
      try {
        const response: any = await apiRequest(arg, "get", "");
        setMedicineListData(response?.data?.medicines);
      } catch (e) {
        console.log("\n\n\nuserSearch Error:", e);
      }
    }, 1000),
    []
  );

  useEffect(() => {
    setPrescriptionData((prev) => ({
      ...prev,
      medicineList: Object.values(medicineList),
    }));
  }, [focusDescription]);

  useEffect(() => {
    console.log(!!search, search);
    if (!!search) {
      handlerSearching(search.toLowerCase());
      // handlerSearchingMedicine(
      //   `/api/medicine/doctor?skip=0&limit=10&key=${search.toLowerCase()}`
      // );
    } else {
      // setMedicineListData([]);
      handlerSearchingMedicine(`/api/medicine/doctor?skip=0&limit=10`);
    }
    return () => {};
  }, [search, setSearch]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        backPress={goBack}
        title={"Create prescription"}
        shadow
        filledLogo
      />
      <View style={{ flex: 1, marginHorizontal: 5 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollviewContainer}
        >
          <HeadingWithTitle
            marginBottom={15}
            marginTop={30}
            title={"Create"}
            UnderHeadingText={<UnderHeadingText />}
            appScreen
          />
          <Text style={{ color: Colors.DARK_TEXT_COLOR, fontWeight: "600" }}>
            Patient Id
          </Text>
          <TextInput
            placeholderTextColor={Colors.MESSAGE_TIME}
            placeholder={serialNumber}
            editable={false}
            onChangeText={(text: string) =>
              handleChangeInput(text, "patientName")
            }
            style={{
              borderWidth: 1,
              borderColor: Colors.INPUT_BORDER,
              borderRadius: 6,
              padding: 10,
              color: Colors.BLACK,
              marginVertical: 10,
              backgroundColor: Colors.INCOMING_MESSAGE_BG,
            }}
          />
          {/* <Input
            dropdownVisibilityHandler={(val: boolean) => {
              setGenderDropdownVisibility(val);
            }}
            value={gender}
            title={'Gender'}
            placeholder={'e.g male'}
          /> */}
          {/* <Text
            style={{
              color: Colors.DARK,
              fontWeight: "600",
              marginVertical: 10,
            }}
          >
            Gender
          </Text> */}

          {/* <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderWidth: 1,
              borderColor: Colors.INPUT_BORDER,
              borderRadius: 6,
              paddingEnd: 10,
              marginBottom: 5,
            }}
            onPress={() =>
              setGenderDropdownVisibility(!genderDropdownVisibility)
            }
          >
            <TextInput
              placeholderTextColor={Colors.MESSAGE_TIME}
              placeholder="eg. Dani Roy"
              editable={false}
              style={{
                padding: 10,
                width: "90%",
                color: Colors.BLACK,
              }}
              value={gender}
            />
            <DownArrow />
          </TouchableOpacity> */}

          {/* <TextInput
            placeholderTextColor={Colors.MESSAGE_TIME}
            placeholder={gender}
            editable={false}
            style={{
              borderWidth: 1,
              borderColor: Colors.INPUT_BORDER,
              borderRadius: 6,
              padding: 10,
              color: Colors.BLACK,
              marginVertical: 10,
              backgroundColor: Colors.INCOMING_MESSAGE_BG,
            }}
          />
          {genderDropdownVisibility && (
            <GenderDropdown
              selectedGenderValue={(val: string) => {
                setGender(val);
                setPrescriptionData((prev) => ({
                  ...prev,
                  gender: val,
                }));
              }}
              gender={gender}
              prescription={true}
              visibility={(val: boolean) => setGenderDropdownVisibility(val)}
            />
          )} */}
          {selected_medicines?.length > 0 && (
            <View
              style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}
            >
              {selected_medicines?.map((item, index) => {
                return (
                  <View
                    style={{
                      paddingHorizontal: 15,
                      paddingVertical: 5,
                      borderRadius: 5,
                      borderWidth: 0.5,
                      borderColor: "grey",
                      backgroundColor: "lightgrey",
                      marginLeft: index > 0 ? 10 : 0,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        let arr = [...selected_medicines];
                        arr?.map((med, index) => {
                          if (med?.id == item?.id) {
                            let arr2 = [...selected_medicines];
                            arr2.splice(index, 1);
                            // setSelectedMedicines(arr);
                            dispatch(selectedMedicinesList(arr2));
                          }
                        });
                      }}
                      style={{
                        position: "absolute",
                        zIndex: 1,
                        top: -7,
                        right: -7,
                        backgroundColor: "red",
                        padding: 5,
                        borderRadius: 20,
                      }}
                    >
                      <Cross width={10} height={10} />
                    </TouchableOpacity>
                    <Text>{item?.name}</Text>
                  </View>
                );
              })}
            </View>
          )}
          <View style={styles.containerAddMed}>
            <View style={styles.addTitleContainer}>
              <Text style={styles.text}>Medicine Name</Text>
              {/* <TouchableOpacity onPress={addField}>
                <Add />
              </TouchableOpacity> */}
            </View>
            {/* {Object.values(medicineList)?.map((attr, index) => {
              return (
                <TextInput
                  placeholderTextColor={Colors.MESSAGE_TIME}
                  style={[styles.input]}
                  placeholder={"e.g med 20mg"}
                  onChangeText={(e) => handleAttributeChange(e, index + 1)}
                />
              );
            })} */}
            <View>
              <TextInput
                placeholderTextColor={Colors.MESSAGE_TIME}
                style={[styles.input]}
                placeholder={"e.g med 20mg"}
                onChangeText={(e) => setSearch(e)}
              />
              <View style={{ marginBottom: 10 }}>{dropDownList()}</View>
            </View>

            <Text
              style={{
                color: Colors.DARK,
                marginVertical: 2,
                fontWeight: "600",
              }}
            >
              Description
            </Text>
            <TextInput
              onChangeText={(text: string) =>
                handleChangeInput(text, "description")
              }
              multiline={true}
              onFocus={() => setFocusDescription(true)}
              onBlur={() => setFocusDescription(false)}
              style={{
                borderWidth: 1,
                borderRadius: 6,
                marginVertical: 10,
                borderColor: Colors.INPUT_BORDER,
                color: Colors.BLACK,
                paddingHorizontal: 10,
                height: 150,
                textAlignVertical: "top",
              }}
            />
          </View>
          <Button
            title={"Submit"}
            onPress={() => {
              // !!medicineList["1"].medicineName
              selected_medicines?.length > 0
                ? submitPrescription()
                : Toast.show("Please enter medicine name.");
            }}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  scrollviewContainer: {
    paddingHorizontal: 20,
  },
  text: {
    marginTop: 8,
    color: Colors.DARK_TEXT_COLOR,
    fontWeight: "600",
    fontSize: 14,
  },
  containerAddMed: {
    width: "100%",
    alignSelf: "center",
    marginHorizontal: 7,
    marginTop: 3,
  },
  input: {
    paddingVertical: Platform.OS === "ios" ? 15 : 8,
    width: "100%",
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
  },
  addTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headingText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.GREYTEXT,
    textAlign: "left",
    marginVertical: 10,
  },
  medicineText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.GREYTEXT,
    textAlign: "left",
    marginVertical: 10,
    marginLeft: 10,
  },
});

export default Prescription;
