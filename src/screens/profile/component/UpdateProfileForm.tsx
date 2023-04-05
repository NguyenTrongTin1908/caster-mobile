import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Box,
  FormControl,
  Text,
  Input,
  Divider,
  View,
  TextArea,
  Select,
  HStack,
  ScrollView,
  Checkbox,
  useToast,
  Popover,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import { Sizes, colors } from "utils/theme";
import Button from "components/uis/Button";
import { useNavigation } from "@react-navigation/core";
import { Alert, ImageBackground, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { IPerformer, ICountry } from "../../../interfaces";
import { utilsService } from "services/utils.service";
import ImagePicker from "react-native-image-crop-picker";
import {
  updatePerformer,
  updateCurrentUserAvatar,
  updateCurrentUserCover,
} from "services/redux/user/actions";
import styles from "./style";
import moment from "moment";
import ErrorMessage from "components/uis/ErrorMessage";
import DatePicker from "react-native-datepicker";
import { mediaService } from "services/media.service";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { BottomSheet, Colors } from "react-native-elements";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { performerService, authService } from "../../../services";

interface IProps {
  current: IPerformer;
  updatePerformer: Function;
  updateCurrentUserAvatar: Function;
  updateCurrentUserCover: Function;
  updating: boolean;
}

const UpdateProfileForm = ({
  current,
  updatePerformer: handleUpdatePerformer,
  updateCurrentUserAvatar: handleUpdateAvt,
  updateCurrentUserCover: handleUpdateCover,
  updating,
}: IProps): React.ReactElement => {
  const [countries, setCountries] = useState([] as Array<ICountry>);
  const [cities, setCities] = useState([] as Array<any>);
  const [states, setStates] = useState([] as Array<any>);
  const [countryCode, setCountryCode] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [showBottomSheet, setShowButtonSheet] = useState(false);
  const [type, setType] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [countTime, setCountTime] = useState(60);
  const toast = useToast();
  let Timer = null as any;

  const [bodyInfo, setBodyInfo] = useState([] as any);
  const { heights = [], genders = [], ethnicities = [] } = bodyInfo;
  const defaultValues = {
    ...current,
    dateOfBirth: (current.dateOfBirth && moment(current.dateOfBirth)) || "",
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ defaultValues });
  const stateRef = useRef({}) as any;
  const countryRef = useRef({}) as any;
  const password = useRef({});

  const validateMessages = {
    required: "This field is required!",
    types: {
      email: "Not a validate email!",
      number: "Not a validate number!",
    },
    number: {
      range: "Must be between ${min} and ${max}",
    },
  };
  password.current = watch("password", "");

  const [submitting, setSubmitting] = useState(false);
  const navigation = useNavigation() as any;
  const onSubmit = async (data: any): Promise<void> => {
    submit(data);
  };

  const handleGetStates = async (countryCode: string) => {
    const resp = await utilsService.statesList(countryCode);
    setStates(resp.data);
    setCountryCode(countryCode);
  };

  const handleGetCities = async (countryCode: any, state: string) => {
    const resp = await utilsService.citiesList(countryCode, state);
    setCities(resp.data);
  };
  const submit = async (data) => {
    if (typeof data.dateOfBirth === "string") {
      const [day, month, year] = data.dateOfBirth.split("-");
      const datePick = new Date(+year, month - 1, +day);
      data.dateOfBirth = datePick.toISOString();
    }
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

  const handleCountdown = () => {
    console.log("AAA");
    Timer = setTimeout(() => {
      setCountTime(countTime - 1);
    }, 1000);

    return () => {
      clearTimeout(Timer);
    };
  };

  useEffect(() => {
    if (!countTime) {
      setCountTime(60);
      clearTimeout(Timer);
    } else {
      handleCountdown();
    }
  }, [countTime]);

  const verifyEmail = async () => {
    try {
      await setEmailSending(true);
      const resp = await authService.verifyEmail({
        sourceType: "performer",
        source: current,
      });
      handleCountdown();
      resp.data && resp.data.message && Alert.alert(resp.data.message);
    } catch (e) {
      const error = await e;
      Alert.alert("An error occured, please try again");
    } finally {
      await setEmailSending(false);
    }
  };

  const openGallery = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then(async (image) => {
      if (type === "avatar") {
        const dataUrl = await performerService.getAvatarUploadUrl();
        const url = `https://api.caster.com${dataUrl}`;
        handleUpdate(url, image.path, "avatar");
      } else {
        const dataUrl = await performerService.getCoverUploadUrl();
        const url = `https://api.caster.com${dataUrl}`;
        handleUpdate(url, image.path, "cover");
      }
    });
  };

  const openCamera = async () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then(async (image) => {
        if (type === "avatar") {
          const dataUrl = await performerService.getAvatarUploadUrl();
          const url = `https://api.caster.com${dataUrl}`;
          handleUpdate(url, image.path, "avatar");
        } else {
          const dataUrl = await performerService.getCoverUploadUrl();
          const url = `https://api.caster.com${dataUrl}`;
          handleUpdate(url, image.path, "cover");
        }
      })
      .catch((err) => {
        toast.show({ description: err.message });
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
    } catch (e: any) {
      const error = e;
      toast.show({ description: e.message });
    }
  };

  useEffect(() => {
    async function loadData() {
      const [countries, bodyInfo] = await Promise.all([
        utilsService.countriesList(),
        utilsService.bodyInfo(),
      ]);
      if (current?.country) {
        handleGetStates(current?.country);
        if (current?.state) {
          handleGetCities(current?.country, current?.state);
        }
      }
      setCountries(countries?.data);
      setBodyInfo(bodyInfo?.data);
    }

    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.profileScrollView}>
        <View style={styles.converPhoto}>
          <Image
            source={
              current?.cover
                ? { uri: current?.cover }
                : require("../../../assets/banner-image.jpg")
            }
            height={"100%"}
            alt="cover"
          />
          <TouchableOpacity
            activeOpacity={0.4}
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
        </View>
        <View style={styles.profileForm}>
          <FormControl>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  InputLeftElement={
                    <Text color={colors.inpLabelColor} fontSize={17}>
                      User Name
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
                      Display Name
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
              name="name"
              rules={{
                required: "Please input your displayname!",
                minLength: {
                  value: 3,
                  message: "Displayname must containt at least 3 characters",
                },
              }}
            />
            {errors.username && (
              <ErrorMessage
                message={errors.name?.message || "Displayname is required."}
              />
            )}
          </FormControl>
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
                  placeholder="Tell people something about you..."
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
          <HStack>
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
            </View>
            <View width={"50%"}>
              <FormControl>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      aria-label="Hide Year"
                      isChecked={value}
                      value="invalid"
                      onChange={(val) => {
                        onChange(val);
                      }}
                    >
                      <Text color={colors.lightText} fontSize={"sm"}>
                        Hide year on profile
                      </Text>
                    </Checkbox>
                  )}
                  name="showYearProfile"
                />
                {errors.country && (
                  <ErrorMessage
                    message={errors.country?.message || "Country is required."}
                  />
                )}
              </FormControl>
            </View>
          </HStack>
          <Divider borderColor={colors.divider} />
          <FormControl>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  ref={countryRef}
                  fontSize={17}
                  selectedValue={value}
                  color={colors.lightText}
                  accessibilityLabel="Country"
                  placeholder="Country"
                  onValueChange={(val) => {
                    onChange(val);
                    handleGetStates(val);
                  }}
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
          <HStack>
            <View width={"50%"}>
              <FormControl>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      ref={stateRef}
                      fontSize={17}
                      selectedValue={value}
                      color={colors.lightText}
                      accessibilityLabel="States"
                      placeholder="States"
                      onValueChange={(val: string) => {
                        onChange(val);
                        handleGetCities(countryCode, val);
                      }}
                    >
                      {states.map((state) => (
                        <Select.Item label={state} value={state} />
                      ))}
                    </Select>
                  )}
                  name="state"
                  rules={{ required: "State is required." }}
                />
                {errors.state && (
                  <ErrorMessage
                    message={errors.state?.message || "State is required."}
                  />
                )}
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
                      accessibilityLabel="Cities"
                      placeholder="Cities"
                      onValueChange={(val) => onChange(val)}
                    >
                      {cities &&
                        cities.map((city) => (
                          <Select.Item label={city} value={city} />
                        ))}
                    </Select>
                  )}
                  name="city"
                  rules={{ required: "City is required." }}
                />
                {errors.state && <ErrorMessage message={"City is required."} />}
              </FormControl>
            </View>
          </HStack>
          <Divider borderColor={colors.divider} />

          <FormControl>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  ref={stateRef}
                  fontSize={17}
                  selectedValue={value}
                  color={colors.lightText}
                  accessibilityLabel="States"
                  placeholder="States"
                  onValueChange={(val: string) => {
                    onChange(val);
                    handleGetCities(countryCode, val);
                  }}
                >
                  <Select.Item label={"Active"} value={"active"} />
                  <Select.Item label={"InActive"} value={"inactive"} />
                </Select>
              )}
              name="state"
              rules={{ required: "State is required." }}
            />
            {errors.state && (
              <ErrorMessage
                message={errors.state?.message || "State is required."}
              />
            )}
          </FormControl>
          <Divider borderColor={colors.divider} />

          <FormControl>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  fontSize={17}
                  selectedValue={value}
                  color={colors.lightText}
                  accessibilityLabel="Gender"
                  placeholder="Gender"
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
                      accessibilityLabel="Ethnicity"
                      placeholder="Ethnicity"
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
                <Input
                  InputLeftElement={
                    <View>
                      <Text color={colors.lightText}>Email</Text>
                      {current.verifiedEmail ? (
                        <Popover
                          trigger={(triggerProps) => {
                            return (
                              <Text {...triggerProps} color={colors.warning}>
                                Verified!
                              </Text>
                            );
                          }}
                        >
                          <Popover.Content
                            accessibilityLabel="Verify Email"
                            w="56"
                          >
                            <View
                              backgroundColor={colors.lightText}
                              textAlign={"center"}
                            >
                              <Text color={colors.secondary}>
                                Your email address is verified!
                              </Text>
                            </View>
                          </Popover.Content>
                        </Popover>
                      ) : (
                        <Popover
                          trigger={(triggerProps) => {
                            return (
                              <Text {...triggerProps} color={colors.secondary}>
                                Not verified!
                              </Text>
                            );
                          }}
                        >
                          <Popover.Content
                            accessibilityLabel="Verify Email"
                            w="56"
                          >
                            <Popover.CloseButton />
                            <Popover.Header>Verify Email</Popover.Header>
                            <Popover.Body>
                              <Button
                                onPress={() => verifyEmail()}
                                disabled={updating || countTime < 60}
                              >
                                <Text>
                                  {countTime < 60 ? "Resend " : "Send "}
                                  verification link{" "}
                                  {countTime < 60 && `${countTime}s`}
                                </Text>
                              </Button>
                            </Popover.Body>
                          </Popover.Content>
                        </Popover>
                      )}
                    </View>
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
              rules={{
                pattern: new RegExp(
                  /^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g
                ),
              }}
            />
            {errors.password && (
              <ErrorMessage
                message={
                  errors.password?.message ||
                  "Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character"
                }
              />
            )}
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
              rules={{
                validate: (value) =>
                  value === password.current || "The passwords do not match",
              }}
            />
            {errors && <ErrorMessage message={"Comfirm is required."} />}
          </FormControl>
          <Divider borderColor={colors.divider} />
          <Box alignSelf="center" my={5}>
            <Button
              colorScheme="primary"
              onPress={handleSubmit(onSubmit)}
              disabled={submitting}
              label="Save Changes"
            />
          </Box>
        </View>
      </ScrollView>
      <BottomSheet
        isVisible={showBottomSheet}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.50, 0, 0.50)" }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setShowButtonSheet(false)}
          style={styles.bottomSheetContain}
        >
          <View style={styles.bottomSheetContentStyle}>
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
                  color={colors.darkText}
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
                  color={colors.darkText}
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
          </View>
        </TouchableOpacity>
      </BottomSheet>
    </View>
  );
};
const mapStates = (state: any) => ({
  ...state.user,
  isLoggedIn: state.auth.loggedIn,
  updating: state.user.updating,
});
const mapDispatch = {
  updatePerformer,
  updateCurrentUserAvatar,
  updateCurrentUserCover,
};
export default connect(mapStates, mapDispatch)(UpdateProfileForm);
