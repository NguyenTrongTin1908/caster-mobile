import React, { useRef, useState } from "react";
import { StyleSheet ,Text , View , TouchableOpacity, Dimensions, TextInput, } from "react-native";
import { IFeed } from "src/interfaces";
import { colors } from "utils/theme";
const WIDTH = Dimensions.get('window').width;

interface IProps {
  feed : IFeed
  changeModalVisible : Function;
  setDataConfirm  : Function;
}

export const ReportModal = ({feed,changeModalVisible,setDataConfirm} : IProps) => {
  const [content,setContent] = useState('')
  const closeModal = (bool, data) => {
    changeModalVisible(bool)
    setDataConfirm(data,content)
  }
  return (
    <TouchableOpacity
      disabled={true}
      style={styles.container}
    >
      <View style={styles.modal}>
        <View style={styles.textView}>
          <Text style={[styles.text,{color:'red'}]}> Report </Text>
          <Text style={styles.text}> Please add report content</Text>
        </View>
        <View style={styles.textInput}>
          <TextInput onChangeText={(val) => setContent(val)}
          >
          </TextInput>
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity
          onPress={()=> closeModal(false, 'Cancel')}
          style={styles.touchable}>
            <Text style={[styles.text , {color : 'blue'}]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={()=> closeModal(false, 'Send')}
          style={styles.touchable}>
            <Text style={[styles.text , {color : 'blue'}]}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>

  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    height:180,
    width : WIDTH - 80,
    paddingTop:10,
    backgroundColor: 'white',
    borderRadius: 10
  },
  textInput : {
    alignItems: 'center',
    alignSelf: 'center',
    height: 45,
    width:  '80%',
    borderWidth: 1.5,
    borderColor: colors.gray
  },
  textView:{
    flex :1,
    alignItems: 'center',
  },
  text: {
    margin :5,
    fontSize :16,
    fontWeight : 'bold',
  },
  touchable: {
    flex :1 ,
    paddingVertical : 10,
    alignItems : 'center'
  },
  buttonView: {
    width : '100%',
    flexDirection: 'row',
  }
})

export default ReportModal;
