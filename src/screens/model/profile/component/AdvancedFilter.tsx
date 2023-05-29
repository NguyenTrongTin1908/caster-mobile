import React, { useEffect, useState, useContext } from "react";
import { View, TouchableOpacity } from "react-native";
import {
  Modal,
  IconButton,
  Select,
  Text,
  VStack,
  FormControl,
} from "native-base";
import { useNavigation } from "@react-navigation/core";
import BackButton from "components/uis/BackButton";
import { colors } from "utils/theme";
import { IBody, ICountry } from "interfaces/utils";
import AntDesign from "react-native-vector-icons/AntDesign";

interface IProps {
  onSubmit: Function;
  countries: ICountry[];
  bodyInfo: IBody;
}
const AdvancedFilter = ({
  onSubmit,
  countries,
  bodyInfo,
}: IProps): React.ReactElement => {
  const [itemPerPage, setitemPerPage] = useState(12);
  const [feedPage, setfeedPage] = useState(0);
  const [orientation, setOrientation] = useState("");
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState({} as any);
  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState("mostFollowed");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState("");

  const [ethnicity, setEthnicity] = useState("");
  const [age, setAge] = useState("");
  const [verifySelect, setVerifySelect] = useState("");
  const [relationSelect, setRelationSelect] = useState(
    "All Relationship Status"
  );
  const [radioSelect, setRadioSelect] = useState("");
  const navigation = useNavigation() as any;

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
    ages = [],
  } = bodyInfo;
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTitleAlign: "center",
      title: "Top Caster",
      headerLeft: () => <BackButton />,
      headerRight: null,
    });
  }, [useContext]);

  const handleSubmit = async (field, value: string) => {
    await setFilter({ ...filter, [field]: value });
  };

  useEffect(() => {
    onSubmit(filter);
  }, [filter]);

  const onValueChange = async (val) => {};
  return (
    <View>
      <IconButton
        onPress={() => setModalVisible(true)}
        colorScheme="indigo"
        bgColor={"blue.200"}
        width={120}
        height={50}
        marginX={5}
        _icon={{
          as: AntDesign,
          name: "filter",
        }}
      />
      <Modal
        isOpen={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
      >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>
            <Text
              bold
              textAlign={"center"}
              fontSize={18}
              color={colors.primary}
            >
              Model Filter
            </Text>
          </Modal.Header>
          <Modal.Body>
            <TouchableOpacity disabled={true}>
              <VStack flex={1} space={1}>
                <FormControl.Label>
                  <Text bold fontSize={15}>
                    Country
                  </Text>
                </FormControl.Label>
                <Select
                  fontSize={17}
                  selectedValue={country}
                  color={colors.darkText}
                  accessibilityLabel="All Country"
                  placeholder="All Country"
                  onValueChange={(val) => {
                    setCountry(val), handleSubmit("country", val);
                  }}
                >
                  <Select.Item label="All Country" value="" />
                  {countries.map((country) => (
                    <Select.Item
                      key={country.code}
                      label={country.name}
                      value={country.code}
                    />
                  ))}
                </Select>
                <FormControl.Label>
                  <Text bold fontSize={15}>
                    Gender
                  </Text>
                </FormControl.Label>
                <Select
                  fontSize={17}
                  selectedValue={gender}
                  color={colors.darkText}
                  accessibilityLabel="All Gender"
                  placeholder="All Gender"
                  onValueChange={(val) => {
                    setGender(val), handleSubmit("gender", val);
                  }}
                >
                  <Select.Item label="All Gender" value="" />
                  {genders.map((item, index) => (
                    <Select.Item
                      key={item.value}
                      label={item.value}
                      value={item.value}
                    ></Select.Item>
                  ))}
                </Select>
                <FormControl.Label>
                  <Text bold fontSize={15}>
                    Ethnicity
                  </Text>
                </FormControl.Label>
                <Select
                  fontSize={17}
                  selectedValue={ethnicity}
                  color={colors.darkText}
                  accessibilityLabel="All Ethnicity"
                  placeholder="All Ethnicity"
                  onValueChange={(val) => {
                    setEthnicity(val), handleSubmit("ethnicity", val);
                  }}
                >
                  <Select.Item label="All Ethnicity" value="" />
                  {ethnicities.map((item) => (
                    <Select.Item
                      key={item.value}
                      label={item.value}
                      value={item.value}
                    ></Select.Item>
                  ))}
                </Select>
                <FormControl.Label>
                  <Text bold fontSize={15}>
                    Age
                  </Text>
                </FormControl.Label>
                <Select
                  fontSize={17}
                  selectedValue={age}
                  color={colors.darkText}
                  accessibilityLabel="All Age"
                  placeholder="All Age"
                  onValueChange={(val) => handleSubmit("age", val)}
                >
                  <Select.Item label="All Age" value="" />
                  {ages.map((item) => (
                    <Select.Item
                      key={item.value}
                      label={item.value}
                      value={item.value}
                    ></Select.Item>
                  ))}
                </Select>

                <FormControl.Label>
                  <Text bold fontSize={15}>
                    All Seeking Relationship
                  </Text>
                </FormControl.Label>
                <Select
                  fontSize={17}
                  selectedValue={relationSelect}
                  color={colors.darkText}
                  accessibilityLabel="All Seeking Relationship"
                  placeholder="All Seeking Relationship"
                  onValueChange={(val) => {
                    setRelationSelect(val), handleSubmit("relationship", val);
                  }}
                >
                  <Select.Item label="All Seeking Relationship" value="" />
                  <Select.Item
                    key="active"
                    value="active"
                    label={"Yes"}
                  ></Select.Item>
                  <Select.Item
                    key="inactive"
                    value="inactive"
                    label={"No"}
                  ></Select.Item>
                </Select>
                <FormControl.Label>
                  <Text bold fontSize={15}>
                    All users
                  </Text>
                </FormControl.Label>
                <Select
                  fontSize={17}
                  selectedValue={verifySelect}
                  color={colors.darkText}
                  accessibilityLabel="All users"
                  placeholder="All users"
                  onValueChange={(val) => {
                    setVerifySelect(val), handleSubmit("verifiedAccount", val);
                  }}
                >
                  <Select.Item label="All users" value="" />
                  <Select.Item
                    key="verified"
                    value="verified"
                    label={"Verified only"}
                  ></Select.Item>
                </Select>
              </VStack>
            </TouchableOpacity>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </View>
  );
};
export default AdvancedFilter;
