import React, { useEffect, useRef, useState } from "react";
import { IPerformer } from "src/interfaces";
import { Controller, useForm } from "react-hook-form";
import { FormControl, HStack, Image, View } from "native-base";
import KeyboardDismiss from "components/uis/KeyboardDismiss";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  Animated,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import styles from "./style";
import { colors } from "utils/theme";
import { ICreateComment } from "interfaces/comment";
import { Keyboard, KeyboardEvent } from "react-native";

interface IProps {
  objectId: string;
  creator: IPerformer;
  objectType?: string;
  requesting?: boolean;
  isReply: boolean;
  handleOnSubmit: Function;
  handleReply: Function;
  itemReply: any;
}
const CommentForm = React.memo(
  ({
    objectId,
    objectType,
    isReply,
    handleOnSubmit,
    creator,
    itemReply,
    handleReply,
  }: IProps): React.ReactElement => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const inputRef = useRef() as any;

    function onKeyboardDidShow(e: KeyboardEvent) {
      setKeyboardHeight(e.endCoordinates.height + 35);
    }

    function onKeyboardDidHide() {
      setKeyboardHeight(0);
      handleReply({});
    }

    useEffect(() => {
      const showSubscription = Keyboard.addListener(
        "keyboardDidShow",
        onKeyboardDidShow
      );
      const hideSubscription = Keyboard.addListener(
        "keyboardDidHide",
        onKeyboardDidHide
      );
      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []);

    useEffect(() => {
      if (isReply) {
        inputRef.current.focus();
      }
    }, [isReply]);

    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm();
    const contentInput = useRef();

    const onSubmit = async ({ content }: any): Promise<void> => {
      submit(content);
      reset();
    };

    const submit = async (content) => {
      try {
        const data = {} as ICreateComment;
        data.content = content;
        data.objectId = objectId;
        data.objectType = objectType || "video";
        handleOnSubmit(data);
      } catch {}
    };

    return (
      <View
        style={{
          position: "absolute",
          bottom: keyboardHeight,
          backgroundColor: colors.lightText,
        }}
      >
        <HStack space={2} w="100%">
          <View w="15%">
            <Image
              source={
                creator?.avatar
                  ? { uri: creator?.avatar }
                  : require("../../assets/avatar-default.png")
              }
              style={{
                width: 40,
                height: 40,
                marginLeft: 5,
                borderRadius: 35.0,
                borderColor: "blue",
                borderWidth: 1.0,
                alignItems: "center",
              }}
              alt="avatar"
            />
          </View>
          <View width={"85%"}>
            <KeyboardDismiss>
              <SafeAreaView>
                <HStack width="100%">
                  <View width="88%">
                    <FormControl>
                      <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            ref={inputRef}
                            selectionColor={colors.gray}
                            value={value}
                            placeholder={
                              isReply
                                ? "Replying to " + itemReply?.creator?.name
                                : "Add a comment here"
                            }
                            placeholderTextColor={colors.gray}
                            secureTextEntry={true}
                            multiline
                            numberOfLines={6}
                            onChangeText={(val) => onChange(val)}
                            style={{
                              backgroundColor: colors.lightGray,
                              borderRadius: 50,
                              width: "100%",
                              height: !isReply ? 45 : 40,
                              alignItems: "center",
                            }}
                          />
                        )}
                        name="content"
                        rules={{ required: "Comment is required" }}
                        defaultValue=""
                      />
                    </FormControl>
                  </View>
                  <View width="10%" style={styles.sendComment}>
                    <TouchableOpacity activeOpacity={0.5}>
                      <Animated.View onTouchStart={handleSubmit(onSubmit)}>
                        {isReply ? (
                          <Ionicons
                            name="arrow-up-circle"
                            size={23}
                            color={"crimson"}
                            style={styles.sendComment}
                          />
                        ) : (
                          <Ionicons
                            name="send-sharp"
                            size={23}
                            color={"crimson"}
                            style={styles.sendComment}
                          />
                        )}
                      </Animated.View>
                    </TouchableOpacity>
                  </View>
                </HStack>
              </SafeAreaView>
            </KeyboardDismiss>
          </View>
        </HStack>
      </View>
    );
  }
);

export default CommentForm;
