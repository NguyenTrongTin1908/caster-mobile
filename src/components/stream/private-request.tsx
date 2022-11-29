import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { cancelPrivateRequest } from "services/redux/streaming/actions";
import { TouchableOpacity } from "react-native";
import { Image, Text, Checkbox } from "native-base";
import styles from "./style";
import { streamService } from "services/stream.service";

interface IProps {
  privateRequest: any;
  onSelect: Function;
  selected: boolean;
  istimeDeline: boolean;
  isChecked: boolean;
}

export const PrivateRequest = ({
  privateRequest,
  onSelect,
  istimeDeline,
  isChecked,
}: IProps) => {
  const [time, setTime] = useState(120);
  const [loop, setLoop] = useState(istimeDeline);

  const dispatch = useDispatch();
  let Timer = null as any;

  const countDown = () => {
    Timer = setTimeout(() => {
      setTime(time - 1);
    }, 1000);

    return () => {
      clearTimeout(Timer);
    };
  };

  const handleCancelRequest = async (
    conversationId: string,
    performerId: string
  ) => {
    // socket.emit('privateChat/requestTimeout', { conversationId, performerId });

    try {
      dispatch(cancelPrivateRequest(conversationId));
      clearTimeout(Timer);
      const resp = await streamService.cancelPrivateChat(conversationId);
    } catch (e: any) {
      const err = e;
    }
  };

  useEffect(() => {
    if (!time) {
      handleCancelRequest(
        privateRequest.conversationId,
        privateRequest.user._id
      );
    }
    if (loop) {
      setTime(120);
      clearTimeout(Timer);
      setLoop(false);
    } else {
      countDown();
    }
  }, [time]);

  useEffect(() => {
    if (!time) {
      handleCancelRequest(
        privateRequest.conversationId,
        privateRequest.user._id
      );
    }
    countDown();
  }, []);

  useEffect(() => {
    setLoop(istimeDeline);
  }, [istimeDeline]);

  const handleSelect = () => {
    onSelect();
  };

  return (
    <TouchableOpacity
      onPress={() => handleSelect()}
      style={styles.privateRequestItem}
    >
      <Checkbox
        style={styles.checkboxPrivateChat}
        value={privateRequest}
        aria-label="privateRequest"
        isChecked={isChecked}
        onChange={() => handleSelect()}
      ></Checkbox>
      <Text>{time}</Text>
      <Image
        source={
          privateRequest.user?.avatar
            ? { uri: privateRequest.user?.avatar }
            : require("../../assets/avatar-default.png")
        }
        alt="user-avatar"
        width={30}
        height={30}
        borderRadius={20}
      />
      <Text>{privateRequest.user?.username}</Text>
    </TouchableOpacity>
  );
};
