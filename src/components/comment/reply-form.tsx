import React, { useEffect, useRef, useState } from "react";
import { IPerformer } from "src/interfaces";
import { Controller, useForm } from "react-hook-form";
import { FormControl, HStack, View } from "native-base";
import KeyboardDismiss from "components/uis/KeyboardDismiss";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView, TextInput, TouchableOpacity } from "react-native";
import styles from "./style";
import { colors } from "utils/theme";
import { ICreateComment } from "interfaces/comment";
import { Keyboard, KeyboardEvent } from "react-native";

interface IProps {
  creator: IPerformer;
  objectType?: string;
  requesting?: boolean;
  isReply?: boolean;
  showKeyboard?: boolean;
  handleOnSubmit: Function;
  itemReply: any;
}
const ReplyForm = React.memo(
  ({
    objectType,
    isReply,
    handleOnSubmit,
    showKeyboard,
    itemReply,
  }: IProps): React.ReactElement => {
    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm();
    const inputRef = useRef() as any;

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    function onKeyboardDidShow(e: KeyboardEvent) {
      setKeyboardHeight(e.endCoordinates.height + 35);
    }

    function onKeyboardDidHide() {
      setKeyboardHeight(0);
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

    const onSubmit = async ({ content }: any): Promise<void> => {
      submit(content);
      reset();
    };

    const submit = async (content) => {
      try {
        const data = {} as ICreateComment;
        data.content = content;
        data.objectId = itemReply?._id;
        data.objectType = objectType || "video";
        handleOnSubmit(data);
      } catch {}
    };

    useEffect(() => {
      if (showKeyboard) {
        inputRef.current.focus();
      }
    }, [showKeyboard]);

    return (
      <View
        style={{
          position: "absolute",
          bottom: keyboardHeight,
          backgroundColor: colors.lightText,
        }}
      >
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
                        placeholder={"Replying to " + itemReply?.creator?.name}
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
                <TouchableOpacity onPress={handleSubmit(onSubmit)}>
                  {isReply ? (
                    <Ionicons
                      name="arrow-up-circle"
                      size={22}
                      color={"crimson"}
                      style={styles.sendComment}
                    />
                  ) : (
                    <Ionicons
                      name="send-sharp"
                      size={22}
                      color={"crimson"}
                      style={styles.sendComment}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </HStack>
          </SafeAreaView>
        </KeyboardDismiss>
      </View>
    );
  }
);

export default ReplyForm;
