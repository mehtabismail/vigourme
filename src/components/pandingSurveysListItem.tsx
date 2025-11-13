import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import Colors from "../common/colors";
import ProfileImg from "./profileImg";
import moment from "moment";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OKAY from "../assets/icons/ok-circle-green.svg";
import DELETE from "../assets/icons/delete-circle-gray.svg";
import Button from "./button";
import Toast from "react-native-simple-toast";
import { apiRequest } from "../api/apiRequest";
import EndPoint from "../common/apiEndpoints";
import DownloadSurveyInPDF from "../utils/downloadSurvey";
import navigationStrings from "../common/navigationStrings";
import useGetReduxState from "../customhooks/useGetReduxState";
import LoadingIndicator from "./loadingIndicator";
// import store from "../redux/store";
import { setIsLoadingIndividual } from "../redux/slices/loadingSlice";
import { useDispatch } from "react-redux";

const PandingSurveysListItem = (props: any) => {
  const dispatch = useDispatch();
  const { navigation, chatItem, navigationPath, descriptionDetail } = props;
  const Loading: any = useGetReduxState();
  const [isLoading, setIsLoading] = useState({ cancle: false, approve: false, download: false });

  const navigate = (path: string, param: string, id: string) => {
    navigation.navigate(path, {
      itemDetail: param,
    });
  };

  const downloadPatientSurvey = async () => {
    setIsLoading({ ...isLoading, download: true });
    Toast.show("Downloading.....");
    try {
      const { data }: any = await apiRequest(
        `${EndPoint.DOWNLOAD_PATIENT_SURVEY}/${chatItem?.patientId}`,
        "get",
        ""
      );
      if (data) {
        DownloadSurveyInPDF(
          chatItem?.recentMessage?.patientSerialNumber,
          data?.file,
          Toast,
          Platform
        );
      }
      setIsLoading({ ...isLoading, download: false });
    } catch (error: any) {
      setIsLoading({ ...isLoading, download: false });
      Toast.show(error);
    }
  };

  const replyToPatient = () => {
    navigation.navigate(navigationStrings.DOCTOR_CHAT, {
      patientSerialNumber: chatItem?.recentMessage?.patientSerialNumber,
      chatId: chatItem?.id,
      patientId: chatItem?.patientId,
      fromPandingSurveys: true,
    });
  };

  const approveSurvey = async () => {
    try {
      dispatch(setIsLoadingIndividual(true));
      setIsLoading({ ...isLoading, approve: true });

      const { data }: any = await apiRequest(
        `${EndPoint.APPROVE_SURVEY}/${chatItem?.patientId}`,
        "get",
        ""
      );
      if (data?.success) {
        Toast.show("Questionnaire has been approved successfully.");
        setIsLoading({ ...isLoading, approve: false });
        navigation.pop();
        navigation.navigate(navigationStrings.DOCTOR_CHAT, {
          patientSerialNumber: chatItem?.recentMessage?.patientSerialNumber,
          chatId: chatItem?.id,
          patientId: chatItem?.patientId,
          fromPandingSurveys: true,
        });
      }
    } catch (error: any) {
      setIsLoading({ ...isLoading, approve: false });
      Toast.show(error);
    }
  };

  const cancelSurvey = async () => {
    try {
      dispatch(setIsLoadingIndividual(true));
      setIsLoading({ ...isLoading, cancle: true });

      const { data }: any = await apiRequest(
        `${EndPoint.CANCEL_SURVEY}/${chatItem?.patientId}`,
        "get",
        ""
      );
      if (data?.success) {
        Toast.show("Questionnaire has been rejected successfully.");
        setIsLoading({ ...isLoading, cancle: false });
        navigation.pop();
        navigation.replace(navigationStrings.DOCTOR_PENDING_SURVEYS);
      }
    } catch (error: any) {
      setIsLoading({ ...isLoading, cancle: false });
      Toast.show(error);
    }
  };

  const CustomListView = (chield: any) => {
    return (
      <>
        <View style={styles.rowContainer}>
          <ProfileImg width={65} height={65} />

          <View style={styles.textContainer}>
            <Text style={styles.textId}>
              {chatItem?.recentMessage?.patientSerialNumber}
            </Text>
            <Text style={styles.textTime}>
              {moment
                .duration(
                  Date.now() - chatItem?.recentMessage?.time?.seconds * 1000
                )
                .humanize({ ss: 1 })}
            </Text>
          </View>
          {chield}
        </View>
      </>
    );
  };

  const ActionButton = () => {
    return (
      <>
        <View style={styles.actionBtns}>
          <TouchableOpacity
            disabled={isLoading.cancle}
            onPress={cancelSurvey}
            style={{ padding: 2 }}
          >
            {isLoading.cancle ? (
              <LoadingIndicator size={34} colors={Colors.GRAY_GARK} />
            ) : (
              <DELETE />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isLoading.approve}
            onPress={approveSurvey}
            style={{ padding: 2 }}
          >
            {isLoading.approve ? (
              <LoadingIndicator size={34} colors={Colors.GRAY_GARK} />
            ) : (
              <OKAY />
            )}
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <>
      {descriptionDetail ? (
        <View style={styles.container}>
          {/* {CustomListView(ActionButton())} */}
          {CustomListView(<></>)}
          <View>
            <Text style={styles.textMessage}>
              Download the questionnaire submitted by patient and prescribe the
              medicine accordingly.
            </Text>
            <Button
              onPress={() => {
                
                downloadPatientSurvey();
              }}
              title={"Download Questionnaire"}
              loading={isLoading?.download}
            />
            <Button
              onPress={replyToPatient}
              title={"Reply"}
              marginTop={5}
              loading={false}
            />
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => navigate(navigationPath, chatItem, chatItem?.id)}
        >
          {CustomListView(<></>)}
          <View style={styles.bottomLine} />
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: Colors.INPUT_BORDER,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  rowContainer: {
    backgroundColor: Colors.WHITE,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  textId: {
    color: Colors.BLACK,
    fontSize: 18,
    fontWeight: "400",
    paddingVertical: 3,
  },
  textTime: {
    fontSize: 15,
    paddingVertical: 3,
    color: Colors.MESSAGE_TIME,
  },
  actionBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textMessage: {
    color: Colors.GREYTEXT,
    marginVertical: 20,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 25,
  },
  bottomLine: {
    height: 1,
    backgroundColor: Colors.BOTTOM_LINE_CHAT_LIST_ITEM,
    width: "100%",
    marginTop: 20,
  },
});

export default PandingSurveysListItem;
