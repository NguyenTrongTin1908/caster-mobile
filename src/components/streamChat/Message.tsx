import React from "react";
import moment from "moment";
import { FormControl, HStack, Image, Text, View } from "native-base";
import styles from "./style";
import { TextInput, TouchableOpacity } from "react-native";
import { colors } from "utils/theme";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Controller, useForm } from "react-hook-form";

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
  canDelete: boolean;
  onDelete: Function;
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
    </View>
    // <div className={classNames}>
    //   {data.text && !data.isSystem && (
    //     <div className="bubble-container">
    //       <div className="bubble" title={friendlyTimestamp}>
    //         {canDelete && (
    //           <Dropdown overlay={menu} placement="topRight">
    //             <span>
    //               <InfoCircleOutlined />{' '}
    //             </span>
    //           </Dropdown>
    //         )}
    //         {data.senderInfo && (
    //           <span className="u-name">
    //             {isOwner && <CrownTwoTone twoToneColor="#eb2f96" />}
    //             {data.senderInfo.username}
    //             {data.type !== 'tip' ? ': ' : ' '}
    //           </span>
    //         )}
    //         {!data.imageUrl && data.text}{' '}
    //         {data.imageUrl && (
    //           <a
    //             title="Click to view full content"
    //             href={data.imageUrl.indexOf('http') === -1 ? '#' : data.imageUrl}
    //             target="_blank"
    //             rel="noreferrer">
    //             <img src={data.imageUrl} width="180px" alt="" />
    //           </a>
    //         )}
    //       </div>
    //     </div>
    //   )}
    //   {data.text && data.isSystem && <p style={{ textAlign: 'center', fontSize: '10px' }}>{data.text}</p>}
    //   {showTimestamp && !data.isSystem && <div className="timestamp">{friendlyTimestamp}</div>}
    // </div>
  );
}
