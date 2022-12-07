import React, { useEffect, useRef, useState } from "react";
import { IPerformer } from "src/interfaces";
import { Controller, useForm } from "react-hook-form";
import { FormControl, HStack, View } from "native-base";
import KeyboardDismiss from "components/uis/KeyboardDismiss";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import styles from "./style";
import { colors } from "utils/theme";
import { ICreateComment } from "interfaces/comment";
import EmojiSelector from "react-native-emoji-selector";

interface IProps {
  objectId: string;
  creator: IPerformer;
  objectType?: string;
  requesting?: boolean;
  isReply?: boolean;
  handleOnSubmit: Function;
}
const ReplyForm = React.memo(
  ({
    objectId,
    objectType,
    isReply,
    handleOnSubmit,
  }: IProps): React.ReactElement => {
    const [text, setText] = useState("");
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
      <KeyboardDismiss>
        <SafeAreaView>
          <HStack width="100%">
            <View width="88%">
              <FormControl>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      selectionColor={colors.gray}
                      value={value}
                      placeholder={
                        !isReply ? "Add a comment here" : "Add a reply here"
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
    );
  }
);

export default ReplyForm;
