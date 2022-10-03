import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Text,
  Input,
  Divider,
  View,
  HStack,
  Stack,
  Center,
  ScrollView,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import { colors } from "utils/theme";
import Button from "components/uis/Button";
import ErrorMessage from "components/uis/ErrorMessage";
import styles from "./style";
import { Alert, ImageBackground, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { IPerformer } from "src/interfaces";
import { performerService } from "services/perfomer.service";
import { connect } from "react-redux";
import {
  updatePerformer,
  updateCurrentUserAvatar,
  updateCurrentUserCover,
} from "services/redux/user/actions";
import ImagePicker from "react-native-image-crop-picker";
import { mediaService } from "services/media.service";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useNavigation } from "@react-navigation/core";
interface IProps {
  // control: any;
  formErrors: any;
  submitting: boolean;
  current: IPerformer;
  updatePerformer: Function;
  updateCurrentUserAvatar: Function;
  updateCurrentUserCover: Function;
}
const VerificationForm = ({
  // control,
  formErrors,
  submitting,
  current,
  updatePerformer: handleUpdatePerformer,
  updateCurrentUserAvatar: handleUpdateAvt,
  updateCurrentUserCover: handleUpdateCover,
}: IProps): React.ReactElement => {
  const defaultValues = {};
  const [typeFile, setTypeFile] = useState("");
  const [idImage, setIdImage] = useState("");
  const [documentImage, setDocumentImage] = useState("");
  const [idVerificationFileId, setIdVerificationFileId] = useState("");
  const [documentVerificationFileId, setDocumentVerificationFileId] =
    useState("");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });
  const navigation = useNavigation() as any;

  const onSubmit = async (data: any): Promise<void> => {
    submit(data);
  };
  const submit = async (data) => {
    data.idVerificationId = idVerificationFileId;
    data.documentVerificationId = documentVerificationFileId;
    // if (typeof data.dateOfBirth === "string") {
    //   const [day, month, year] = data.dateOfBirth.split("-");
    //   const datePick = new Date(+year, month - 1, +day);
    //   data.dateOfBirth = datePick.toISOString();
    // }
    console.log("Data : ", data);
    try {
      handleUpdatePerformer({
        ...current,
        ...data,
      });
      Alert.alert("Posted successfully!");
      navigation.navigate("Profile");
    } catch {
      Alert.alert("Something went wrong, please try again later");
    }
  };
  useEffect(() => {
    if (current.documentVerification) {
      setDocumentVerificationFileId(current?.documentVerification?._id);
      setDocumentImage(current?.documentVerification?.url);
    }
    if (current.idVerification) {
      setIdVerificationFileId(current?.idVerification?._id);
      setIdImage(current?.idVerification?.url);
    }
  }, []);
  useEffect(() => {
    typeFile !== "" && openGallery();
  }, [typeFile]);
  const documentUploadUrl = performerService.getDocumentUploadUrl();
  // const onFileUploaded = (type, file) => {
  //   if (file && type === "idFile") {
  //     idVerificationFileId = file?.response?.data?._id;
  //     setIdImage(file?.response?.data.url);
  //   }
  //   if (file && type === "documentFile") {
  //     documentVerificationFileId = file?.response?.data?._id;
  //     setDocumentImage(file?.response?.data.url);
  //   }
  // };
  const openGallery = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then(async (image) => {
      if (typeFile === "ID card") {
        const url = `https://api.caster.com${documentUploadUrl}`;
        handleUpdate(url, image.path, "file");

        setIdImage(image.path);
      } else {
        const url = `https://api.caster.com${documentUploadUrl}`;
        handleUpdate(url, image.path, "file");
        setDocumentImage(image.path);
      }
    });
  };
  const handleUpdate = async (
    uploadUrl: string,
    path: string,
    type: string
  ) => {
    try {
      const resp = (await mediaService.upload(uploadUrl, [
        {
          fieldname: type,
          file: {
            uri: `file://${path}`,
            fieldname: "file",
          },
        },
      ])) as any;
      // resp.data.type === "avatar"
      //   ? handleUpdateAvt(resp.data.url)
      //   : handleUpdateCover(resp.data.url);
      typeFile == "ID card"
        ? setIdVerificationFileId(resp.data._id)
        : setDocumentVerificationFileId(resp.data._id);
    } catch (error) {}
  };
  return (
    <View>
      <ScrollView w={"100%"}>
        <View width="100%" flex={1} marginTop={"30px"}>
          <HStack space={2}>
            <View w="30%" flex={1}>
              <View style={styles.imageVerification}>
                <ImageBackground
                  source={
                    idImage
                      ? { uri: idImage }
                      : require("../../../assets/avatar-default.png")
                  }
                  style={styles.userProfilePhotoStyle}
                  borderRadius={50.0}
                >
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      setTypeFile("ID card");
                    }}
                    style={styles.userProfilePhotoBlurContentStyle}
                  >
                    <MaterialCommunityIcons
                      name="camera-plus"
                      size={27}
                      color={colors.lightText}
                    />
                  </TouchableOpacity>
                </ImageBackground>
              </View>
            </View>
            <View w="70%" flex={1}>
              <Text style={styles.textName}>1.Government-issued ID card</Text>
              <Text style={styles.textName}>2.National Id card</Text>
              <Text style={styles.textName}>3.Passport</Text>
              <Text style={styles.textName}>4.Driving license</Text>
            </View>
          </HStack>
        </View>
        <View width="100%" flex={1} marginTop={"30px"}>
          <HStack space={2}>
            <View w="30%" flex={1}>
              <View style={styles.imageVerification}>
                <ImageBackground
                  source={
                    documentImage
                      ? { uri: documentImage }
                      : require("../../../assets/avatar-default.png")
                  }
                  style={styles.userProfilePhotoStyle}
                  borderRadius={50.0}
                >
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      setTypeFile("Selfie");
                    }}
                    style={styles.userProfilePhotoBlurContentStyle}
                  >
                    <MaterialCommunityIcons
                      name="camera-plus"
                      size={27}
                      color={colors.lightText}
                    />
                  </TouchableOpacity>
                </ImageBackground>
              </View>
            </View>
            <View w="70%" flex={1}>
              <Text style={styles.textName}>
                1.On a blank piece of white paper write your name
              </Text>
              <Text style={styles.textName}>
                2.Hold your paper and your ID so we can clearly see hoth
              </Text>
              <Text style={styles.textName}>
                3.Take a selfie of you, your ID and your handwritten note
              </Text>
            </View>
          </HStack>
        </View>
      </ScrollView>
      <Box alignSelf="center" my={5}>
        <Button
          colorScheme="primary"
          onPress={handleSubmit(onSubmit)}
          disabled={submitting}
          label="Save Changes"
        />
      </Box>
    </View>
  );
};
const mapStates = (state: any) => ({
  ...state.user,
  isLoggedIn: state.auth.loggedIn,
});
const mapDispatch = {
  updatePerformer,
  updateCurrentUserAvatar,
  updateCurrentUserCover,
};
export default connect(mapStates, mapDispatch)(VerificationForm);
