import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Text,
  Input,
  Divider,
  View,
  Heading,
  TextArea,
  useToast,
  Select,
  HStack,
  ScrollView,
  Image,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import { colors, Fonts, Sizes } from "utils/theme";
import Button from "components/uis/Button";
import ImagePicker from "react-native-image-crop-picker";
import { useNavigation } from "@react-navigation/core";
import BackButton from "components/uis/BackButton";
import {
  Alert,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { IBody, IPerformer, ICountry } from "src/interfaces";
import { utilsService } from "services/utils.service";
import { performerService } from "services/perfomer.service";

import {
  updatePerformer,
  updateCurrentUserAvatar,
  updateCurrentUserCover,
} from "services/redux/user/actions";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "react-native/Libraries/NewAppScreen";
import styles from "./style";
import moment from "moment";
import ErrorMessage from "components/uis/ErrorMessage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DatePicker from "react-native-datepicker";
import { BottomSheet } from "react-native-elements";
import { mediaService } from "services/media.service";
import HeaderMenu from "components/tab/HeaderMenu";
import { values } from "lodash";

interface IProps {
  current: IPerformer;
  updatePerformer: Function;
  updateCurrentUserAvatar: Function;
  updateCurrentUserCover: Function;
}

const EditProfile = ({
  current,
  updatePerformer: handleUpdatePerformer,
  updateCurrentUserAvatar: handleUpdateAvt,
  updateCurrentUserCover: handleUpdateCover,
}: IProps): React.ReactElement => {
  const [countries, setCountries] = useState([] as Array<ICountry>);
  const [bodyInfo, setBodyInfo] = useState([] as any);
  const [showBottomSheet, setShowButtonSheet] = useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const {
    heights = [],
    weights = [],
    bodyTypes = [],
    genders = [],
    sexualOrientations = [],
    ethnicities = [],
    hairs = [],
    eyes = [],
    butts = [],
  } = bodyInfo;
  const defaultValues = {
    ...current,
    dateOfBirth: (current.dateOfBirth && moment(current.dateOfBirth)) || "",
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const navigation = useNavigation() as any;
  const onSubmit = async (data: any): Promise<void> => {
    submit(data);
  };
  const submit = async (data) => {
    const [day, month, year] = data.dateOfBirth.split("-");
    const datePick = new Date(+year, month - 1, +day);
    data.dateOfBirth = datePick.toISOString();
    try {
      handleUpdatePerformer({
        ...current,
        ...data,
      });

      Alert.alert("Posted successfully!");
      navigation.navigate("MainTab/Profile");
    } catch {
      Alert.alert("Something went wrong, please try again later");
    }
  };
  const openGallery = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then(async (image) => {
      if (type === "avatar") {
        const data = await performerService.getAvatarUploadUrl();
        const url = `https://api.caster.com${data}`;
        handleUpdate(url, image.path, "avatar");
      } else {
        const data = await performerService.getCoverUploadUrl();
        const url = `https://api.caster.com${data}`;
        handleUpdate(url, image.path, "cover");
      }
    });
  };

  const openCamera = async () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
    }).then(async (image) => {
      if (type === "avatar") {
        const data = await performerService.getAvatarUploadUrl();
        const url = `https://api.caster.com${data}`;
        handleUpdate(url, image.path, "avatar");
      } else {
        const data = await performerService.getCoverUploadUrl();
        const url = `https://api.caster.com${data}`;
        handleUpdate(url, image.path, "cover");
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
      resp.data.type === "avatar"
        ? handleUpdateAvt(resp.data.url)
        : handleUpdateCover(resp.data.url);
    } catch (error) {}
  };

  useEffect(async () => {
    const [countries, bodyInfo] = await Promise.all([
      utilsService.countriesList(),
      utilsService.bodyInfo(),
    ]);
    setCountries(countries?.data);
    setBodyInfo(bodyInfo?.data);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderMenu />
      <Heading
        mb={4}
        fontSize={34}
        textAlign="center"
        color={colors.lightText}
        bold
      >
        Edit Profile
      </Heading>
      <View>
        <Image
          source={
            current?.cover
              ? { uri: current?.cover }
              : require("../../../assets/bg.jpg")
          }
          style={styles.converPhoto}
          alt="cover"
        />
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setShowButtonSheet(true), setType("cover");
          }}
          style={styles.userCoverStyle}
        >
          <MaterialCommunityIcons
            name="camera-plus"
            size={27}
            color={colors.lightText}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.avEdit}>
        <View style={styles.avBlueRound}>
          <ImageBackground
            source={
              current?.avatar
                ? {
                    uri: current?.avatar,
                  }
                : require("../../../assets/avatar-default.png")
            }
            style={styles.userProfilePhotoStyle}
            borderRadius={50.0}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setShowButtonSheet(true), setType("avatar");
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

        <Text color={colors.inpLabelColor} fontSize={17} fontWeight="bold">
          {current?.name}
        </Text>
      </View>
      <ScrollView style={styles.profileScrollView}>
        <FormControl>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                InputLeftElement={
                  <Text color={colors.inpLabelColor} fontSize={17}>
                    Name
                  </Text>
                }
                mx={4}
                mt={1}
                p={4}
                variant="unstyled"
                borderColor={colors.lightText}
                onChangeText={(val) => onChange(val)}
                value={value}
                autoCapitalize="none"
                color={colors.lightText}
                fontSize={20}
                letterSpacing={0.2}
                textAlign="left"
              />
            )}
            name="username"
            rules={{
              required: "Please input your username!",
              minLength: {
                value: 3,
                message: "Username must containt at least 3 characters",
              },
            }}
          />
          {errors.username && (
            <ErrorMessage
              message={errors.username?.message || "Username is required."}
            />
          )}
        </FormControl>
        <Divider borderColor={colors.divider} />
        <FormControl>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                InputLeftElement={
                  <Text color={colors.inpLabelColor} fontSize={17}>
                    Email
                  </Text>
                }
                mx={4}
                p={4}
                variant="unstyled"
                borderColor={colors.inpBorderColor}
                onChangeText={(val) => onChange(val)}
                value={value}
                autoCapitalize="none"
                color={colors.lightText}
                fontSize={20}
                letterSpacing={0.2}
                textAlign="left"
              />
            )}
            name="email"
            rules={{
              required: "Please input your email!",

              minLength: {
                value: 3,
                message: "Email must containt at least 3 characters",
              },
            }}
          />
          {errors.email && (
            <ErrorMessage
              message={errors.email?.message || "Email is required."}
            />
          )}
        </FormControl>
        <Divider borderColor={colors.divider} />
        <HStack>
          <View width={"50%"}>
            <FormControl>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    fontSize={17}
                    selectedValue={value}
                    color={colors.lightText}
                    accessibilityLabel="Choose Gender"
                    placeholder="Choose Gender"
                    onValueChange={(val) => onChange(val)}
                  >
                    {genders.map((item, index) => (
                      <Select.Item
                        label={item.value}
                        value={item.value}
                      ></Select.Item>
                    ))}
                  </Select>
                )}
                name="gender"
              />
              {errors.gender && (
                <ErrorMessage
                  message={errors.gender?.message || "Gender is required."}
                />
              )}
            </FormControl>
          </View>

          <View width={"50%"}>
            <FormControl>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    modal
                    style={styles.editDatePicker}
                    placeholder="Select date"
                    format="DD-MM-YYYY"
                    date={value}
                    onCancel={() => {
                      setOpen(false);
                    }}
                    customStyles={{
                      dateIcon: {
                        position: "absolute",
                        left: 0,
                        top: 4,
                        marginLeft: 0,
                      },
                      dateInput: {
                        marginLeft: 36,
                      },
                      dateText: { fontSize: 17, color: colors.lightText },
                    }}
                    onDateChange={(val) => onChange(val)}
                  />
                )}
                name="dateOfBirth"
              />
            </FormControl>
            {/* <Button label="Open" onPress={() => setOpen(true)} /> */}
          </View>
        </HStack>

        <Divider borderColor={colors.divider} />
        <FormControl>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                fontSize={17}
                selectedValue={value}
                color={colors.lightText}
                accessibilityLabel="Choose Country"
                placeholder="Choose Country"
                onValueChange={(val) => onChange(val)}
              >
                {countries.map((country) => (
                  <Select.Item label={country.name} value={country.code} />
                ))}
              </Select>
            )}
            name="country"
            rules={{ required: "Country is required." }}
          />
          {errors.country && (
            <ErrorMessage
              message={errors.country?.message || "Country is required."}
            />
          )}
        </FormControl>
        <Divider borderColor={colors.divider} />
        <FormControl>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                InputLeftElement={
                  <Text color={colors.inpLabelColor} fontSize={17}>
                    State
                  </Text>
                }
                mx={4}
                p={4}
                variant="unstyled"
                borderColor={colors.inpBorderColor}
                onChangeText={(val) => onChange(val)}
                value={value}
                autoCapitalize="none"
                color={colors.lightText}
                fontSize={20}
                letterSpacing={0.2}
                textAlign="left"
              />
            )}
            name="state"
          />
        </FormControl>

        {/* <FormControl>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                fontSize={17}
                accessibilityLabel="Relationship Status"
                placeholder="Relationship Status"
              ></Select>
            )}
            name="relationshipStatus"
          />
        </FormControl> */}
        <HStack>
          <View width={"50%"}>
            <FormControl>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    fontSize={17}
                    selectedValue={value}
                    color={colors.lightText}
                    accessibilityLabel="Choose Ethnicity"
                    placeholder="Choose Ethnicity"
                    onValueChange={(val) => onChange(val)}
                  >
                    {ethnicities.map((item) => (
                      <Select.Item
                        label={item.value}
                        value={item.value}
                      ></Select.Item>
                    ))}
                  </Select>
                )}
                name="ethnicity"
              />
            </FormControl>
          </View>

          <View width={"50%"}>
            <FormControl>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    fontSize={17}
                    selectedValue={value}
                    color={colors.lightText}
                    accessibilityLabel="Height"
                    onValueChange={(val) => onChange(val)}
                    placeholder="Height"
                  >
                    {heights.map((item) => (
                      <Select.Item
                        label={item.value}
                        value={item.value}
                      ></Select.Item>
                    ))}
                  </Select>
                )}
                name="height"
              />
            </FormControl>
          </View>
        </HStack>

        <Divider borderColor={colors.divider} />
        <FormControl>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextArea
                InputLeftElement={
                  <Text color={colors.inpLabelColor} fontSize={17}>
                    Bio
                  </Text>
                }
                mx={4}
                p={4}
                variant="unstyled"
                borderColor={colors.inpBorderColor}
                onChangeText={(val) => onChange(val)}
                value={value}
                autoCapitalize="none"
                color={colors.lightText}
                fontSize={16}
                letterSpacing={0.2}
                textAlign="left"
              />
            )}
            name="bio"
          />
        </FormControl>

        <Divider borderColor={colors.divider} />

        {/* <FormControl>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                InputLeftElement={
                  <Text color={colors.inpLabelColor} fontSize={17}>
                    Current Password
                  </Text>
                }
                mx={4}
                p={4}
                variant="unstyled"
                borderColor={colors.inpBorderColor}
                onChangeText={(val) => onChange(val)}
                value={value}
                autoCapitalize="none"
                color={colors.lightText}
                fontSize={20}
                letterSpacing={0.2}
                textAlign="left"
                type="password"
              />
            )}
            name="password"
            rules={{
              required: "Password is required.",
              minLength: {
                value: 6,
                message: "Password is minimum 6 characters.",
              },
            }}
          />
        </FormControl> */}
        <Divider borderColor={colors.divider} />
        <FormControl>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                InputLeftElement={
                  <Text color={colors.inpLabelColor} fontSize={17}>
                    New Password
                  </Text>
                }
                mx={4}
                p={4}
                variant="unstyled"
                borderColor={colors.inpBorderColor}
                onChangeText={(val) => onChange(val)}
                value={value}
                autoCapitalize="none"
                color={colors.lightText}
                fontSize={20}
                letterSpacing={0.2}
                textAlign="left"
                type="password"
              />
            )}
            name="password"
          />
        </FormControl>
        <Divider borderColor={colors.divider} />
        <FormControl>
          <Controller
            dependencies={["password"]}
            hasFeedback
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                InputLeftElement={
                  <Text color={colors.inpLabelColor} fontSize={17}>
                    Confirm Password
                  </Text>
                }
                mx={4}
                p={4}
                variant="unstyled"
                borderColor={colors.inpBorderColor}
                onChangeText={(val) => onChange(val)}
                value={value}
                autoCapitalize="none"
                color={colors.lightText}
                fontSize={20}
                letterSpacing={0.2}
                textAlign="left"
                type="password"
              />
            )}
            name="confirm"
          />
        </FormControl>
        <Divider borderColor={colors.divider} />
      </ScrollView>

      <Box alignSelf="center" my={5}>
        <Button
          colorScheme="primary"
          onPress={handleSubmit(onSubmit)}
          disabled={submitting}
          label="Submit"
        />
      </Box>
      <BottomSheet
        isVisible={showBottomSheet}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.50, 0, 0.50)" }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setShowButtonSheet(false)}
          style={styles.bottomSheetContentStyle}
        >
          <Text>Choose Option</Text>
          <View
            style={{
              backgroundColor: "#CFC6C6",
              height: 1.0,
              marginBottom: Sizes.fixPadding + 2.0,
              marginTop: Sizes.fixPadding - 5.0,
            }}
          ></View>
          <TouchableOpacity onPress={() => openCamera()}>
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: Sizes.fixPadding * 2.0,
              }}
            >
              <MaterialIcons
                name="photo-camera"
                size={24}
                color={Colors.blackColor}
              />
              <Text
                style={{
                  marginLeft: Sizes.fixPadding,
                }}
              >
                Camera
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openGallery()}>
            <View
              style={{
                flexDirection: "row",
                marginTop: Sizes.fixPadding,
                marginHorizontal: Sizes.fixPadding * 2.0,
              }}
            >
              <MaterialIcons
                name="photo-album"
                size={22}
                color={Colors.blackColor}
              />
              <Text
                style={{
                  marginLeft: Sizes.fixPadding,
                }}
              >
                Choose from gallery
              </Text>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </BottomSheet>
    </SafeAreaView>
  );
};

// EditProfile.getInitialProps = async ({ ctx }) => {
//   const [countries, bodyInfo] = await Promise.all([
//     utilsService.countriesList(),
//     utilsService.bodyInfo(),
//   ]);
//   return {
//     countries: countries?.data || [],
//     bodyInfo: bodyInfo?.data || [],
//   };
// };

const mapStates = (state: any) => ({
  ...state.user,
  isLoggedIn: state.auth.loggedIn,
});
const mapDispatch = {
  updatePerformer,
  updateCurrentUserAvatar,
  updateCurrentUserCover,
};
export default connect(mapStates, mapDispatch)(EditProfile);
