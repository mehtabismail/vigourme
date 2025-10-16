import { View, Text, Modal, Alert, Pressable, StyleSheet, Image } from "react-native";
import React, { useState } from "react";
import DeleteCircle from '../assets/icons/delete-circle-dark-gray.svg'
import Colors from "../common/colors";

const SuccessDialogue = (args: any) => {
  const { modalVisible, setModalVisible, text, close} = args;
    const textMessage = "Your questionnaire has been submitted successfully. The doctor would get back to you within 24 hours.";

    const onRequestClose = ()=>{
        setModalVisible(!modalVisible)
        close();
    }


  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
      >
        <View style={[styles.centeredView, styles.modelBack]}>
          <View style={styles.modalView}>
            <View style={styles.modelHeader}>
                <Pressable onPress={() => onRequestClose()}>
                    <DeleteCircle/>
                </Pressable>
            </View>
            <View style={styles.modalBody}>
                <Image source={require('../assets/icons/checked.png')} ></Image>
                <Text style={styles.modalText}>{text}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modelBack: {
    marginTop:-50,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width:"85%",
    padding:15,
  },
  modelHeader:{
    width: "100%",
    alignItems:"flex-end",
  },
  modalBody: {
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
  },
  modalText: {
    marginTop: 15,
    padding:10,
    textAlign: "center",
    lineHeight: 28,
    fontSize: 18,
    fontWeight: "500",
    color: Colors.GRAYTEXTDARK,
  },
});

export default SuccessDialogue;
