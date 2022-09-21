import React, { useRef, useState } from "react";
import { StyleSheet ,Text , View , TouchableOpacity, Dimensions, } from "react-native";
import KeyboardDismiss from "components/uis/KeyboardDismiss";

import { IFeed } from "src/interfaces";
import { reportService } from "services/report.service";

const WIDTH = Dimensions.get('window').width;


interface IProps {
  feed : any
  changeModalVisible : Function;
  setDataConfirm  : Function;

}


export const ConfirmModal = ({feed,changeModalVisible,setDataConfirm} : IProps) => {
  const viewRef = useRef(null) as any;
  const [requesting, setRequesting] = useState(false);

  const handleReport= async(reason: string) => {
    if (!reason || reason.length < 20) {
      // message.error('You report must be at least 20 characters');
      return;
    }
    try {
      await setRequesting(true)
      await reportService.create({
        target: 'feed', targetId: feed._id, performerId: feed.fromSourceId, description: reason
      });
      // message.success('Your report has been sent');
    } catch (e) {
      const err = await e;
      // message.error(err.message || 'error occured, please try again later');
    } finally {
      // this.setState({ requesting: false, openReportModal: false });
      setRequesting(false);
    }
  }

  const closeModal = (bool, data) => {

    changeModalVisible(bool)
    setDataConfirm(data)




  }
  return (

  <KeyboardDismiss>
    <TouchableOpacity
      disabled={true}
      style={styles.container}
    >
      <View style={styles.modal}>
        <View style={styles.textView}>
          <Text style={[styles.text,{color:'red'}]}> Delete </Text>
          <Text style={styles.text}> Are you sure you want to delete this item?</Text>
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity
          onPress={()=> closeModal(false, 'Cancel')}
          style={styles.touchable}>
            <Text style={[styles.text , {color : 'blue'}]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={()=> closeModal(false, 'Ok')}
          style={styles.touchable}>
            <Text style={[styles.text , {color : 'blue'}]}>Ok</Text>
          </TouchableOpacity>
        </View>
      </View>

    </TouchableOpacity>
  </KeyboardDismiss>


  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modal: {
    height:150,
    width : WIDTH - 80,
    paddingTop:10,
    backgroundColor: 'white',
    borderRadius: 10
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


export default ConfirmModal;
