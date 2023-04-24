import React from "react";
import moment from "moment";
import { FormControl, HStack, Image, Text, View } from "native-base";
import styles from "./style";
import { TextInput, TouchableOpacity } from "react-native";
import { colors } from "utils/theme";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Controller, useForm } from "react-hook-form";
import { IPerformer } from "src/interfaces";

// import { CrownTwoTone, InfoCircleOutlined } from '@ant-design/icons';
// import { Menu, Dropdown } from 'antd';
// import classnames from 'classnames';
// import { chatBoxMessageClassName } from '@lib/utils';
// import './Message.less';

interface IProps {
  data: any;
  isMine: boolean;
  startsSequence: boolean;
  endsSequence: boolean;
  showTimestamp: boolean;
  isOwner: boolean;
  canDelete?: boolean;
  onDelete?: Function;
  recipient?: IPerformer;
}

export default function Message(props: IProps) {
  const {
    data,
    isMine,
    startsSequence,
    endsSequence,
    showTimestamp,
    isOwner,
    canDelete,
    onDelete,
    recipient,
  } = props;
  const friendlyTimestamp = moment(data.timestamp).format("LLLL");
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);

  return (
    <View>
      {data.text && !data.isSystem && (
        <View style={styles.chatLine}>
          <Image
            alt="avatar"
            source={
              data?.senderInfo?.avatar
                ? { uri: data.senderInfo.avatar }
                : require("../../assets/avatar-default.png")
            }
            width={10}
            height={10}
            borderRadius={50}
          ></Image>

          <Text style={styles.chatText}>{data.text}</Text>
        </View>
      )}
      {data.text && data.isSystem && (
        <Text style={styles.chatSystem}>{data.text}</Text>
      )}
      {showTimestamp && !data.isSystem && (
        <Text style={styles.chatTimeStamp}>{friendlyTimestamp}</Text>
      )}
    </View>
  );
}
