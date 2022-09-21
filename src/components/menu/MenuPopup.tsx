import React, { useState } from "react";
import { StyleSheet ,Text , View , TouchableOpacity, Dimensions, TextInput, Alert, Modal, } from "react-native";
import { colors } from "utils/theme";
const WIDTH = Dimensions.get('window').width;
import Ionicons from 'react-native-vector-icons/Ionicons'
import { reportService } from "services/report.service";
import { IFeed } from "src/interfaces";
import ReportModal from "../modal/report";


interface IProps {
  feed: IFeed;

}
export const MenuPopup = ({ feed}: IProps) => {

  const [modalVisible, setModalVisible] = useState(false);

  const changeModalVisible = (bool) => {
    setModalVisible(bool)
  }
  const setDataConfirm = (data,content) => {
    if(data === 'Cancel')
    return;
    handleReport(content)
  }
  const handleReport= async(reason: string) => {
    if (!reason || reason.length < 20) {
      Alert.alert("You report must be at least 20 characters");
      return;
    }
    try {
      await reportService.create({
        target: 'feed', targetId: feed._id, performerId: feed.fromSourceId, description: reason
      });
      Alert.alert("Report successfully");
    } catch {
      Alert.alert("Something went wrong, please try again later");
    }
  }

  return (
    <View
      style={styles.container}
    >
      <TouchableOpacity style={styles.action} onPress={()=>changeModalVisible(true)}>
        <Ionicons name="flag-outline"  size={25} color={colors.darkText}/>
        <Text style={styles.text}>Report</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          changeModalVisible(false);
        }}
        >
        <ReportModal feed={feed} changeModalVisible={changeModalVisible} setDataConfirm={setDataConfirm} ></ReportModal>
      </Modal>
    </View>

  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },

  action: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5
  },

  text : {
    marginHorizontal: 10,
    fontSize: 15,
    fontWeight: 'bold',
  }


})

export default MenuPopup;
