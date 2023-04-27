import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Text,
  Divider,
  View,
  HStack,
  ScrollView,
} from "native-base";
import {
  Table,
  Row,
  Cell,
  TableWrapper,
} from "react-native-table-component";
import { Controller, useForm } from "react-hook-form";
import { colors } from "utils/theme";
import Button from "components/uis/Button";
import styles from "./style";
import { Alert, TextInput, TouchableOpacity } from "react-native";
import { IPerformer } from "interfaces/performer";
import { connect } from "react-redux";
import { updatePerformer } from "services/redux/user/actions";
import { useNavigation } from "@react-navigation/core";
import Ionicons from "react-native-vector-icons/Ionicons";
import { messageService } from "services/message.service";
import { formatDate } from "lib/date";
interface IProps {
  formErrors: any;
  submitting: boolean;
  current: IPerformer;
  updatePerformer: Function;
  updateCurrentUserAvatar: Function;
  updateCurrentUserCover: Function;
}
const SettingFeeForm = ({
  formErrors,
  submitting,
  current,
  updatePerformer: handleUpdatePerformer,
}: IProps): React.ReactElement => {
  const [dataSource, setDataSource] = useState([]) as any;
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({} as any);
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState({} as any);
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sort, setSort] = useState("desc");
  const [data, setData] = useState([]) as any;
  const navigation = useNavigation() as any;
  const tableHead = ["User", "Username", "Date Added", "Delete"];
  const dataTable = ["userInfo", "userInfo", "createdAt", "_id"];
  const dataSetting = ["user", "username", "createdAt", "_id"];


  const defaultValues = {
    ...current,
    mailPrice: 0,
  };
  useState("");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const onSubmit = async (data: any): Promise<void> => {
    submit(data);
  };

  const getMutes = async (page = 1) => {
    try {
      const resp = await messageService.loadMuteUsers({
        ...filter,
        limit,
        offset: (page - 1) * limit,
        sort,
        sortBy,
      });
      setLoading(false);
      setDataSource(resp.data.data);
      setPagination({
        ...pagination,
        total: resp.data.total,
        pageSize: limit,
      });
    } catch (e) {}
  };
  const submit = async (data) => {
    data.privateChatPrice = Number(data.privateChatPrice);
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

  const onDelete = async (id) => {
    try {
      await messageService.unMuteUser(id);
      getMutes();
      Alert.alert("Unmute user successfully");
    } catch (e) {
      Alert.alert("An error occurred, please try again!");
    }
  };

  const rederId = (data, index) => {

    const nameIndex = dataSetting.findIndex(
      (item) => item === "user"
    );
    if (nameIndex === index) {
      return (
          <View>
            <Text style={styles.textRow}>{data.name || "N/A"}</Text>
          </View>
      );
    }

    const userNameIndex = dataSetting.findIndex(
      (item) => item === "username"
    );
    if (userNameIndex === index) {
      return (
          <View>
            <Text style={styles.textRow}>{data.username || "N/A"}</Text>
          </View>
      );
    }
    const dateIndex = dataTable.findIndex((item) => item === "createdAt");
    if (dateIndex === index) {
      return (
        <View>
          <Text style={styles.textRow} fontSize={13}>{formatDate(data)}</Text>
        </View>
      );
    }
    const IdIndex = dataTable.findIndex((item) => item === "_id");
    if (IdIndex === index) {
      return (
        <View>
          <TouchableOpacity
            onPress={() => onDelete(data)}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };


  useEffect(() => {
    const array = [] as any;
    if (dataSource && dataSource.length > 0) {
      for (const item of dataSource) {
        const arrayData = dataTable.map((key: any) => {
          return item[key];
        });
        array.push(arrayData);
      }
    }
    setData(array);
  }, [dataSource]);

  useEffect(() => {
    getMutes();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView w={"100%"}>
        <HStack space={5} style={styles.settingFeeStack}>
          <View flex={2}>
            <Divider borderColor={colors.divider} />
            <FormControl>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value.toString()}
                    placeholder=""
                    keyboardType="numeric"
                    variant="unstyled"
                    onChangeText={(val) => onChange(val)}
                    borderColor={colors.lightText}
                    borderWidth={1}
                    autoCapitalize="none"
                    color={colors.lightText}
                    fontSize={15}
                    // letterSpacing={0.2}
                    textAlign="center"
                  />
                )}
                name="privateChatPrice"
                rules={{
                  required: "Please input private chat price",
                }}
              />
            </FormControl>
            <Divider borderColor={colors.divider} />
          </View>
          <View flex={2}>
            <Ionicons name="heart" color={colors.ruby} size={20}></Ionicons>
            <Text color={colors.lightText} fontSize={10}>
              {" "}
              / per minute
            </Text>
          </View>
          <View flex={3}>
            <Text color={colors.lightText} fontSize={18}>
              Private Chat fee
            </Text>
          </View>
        </HStack>
        <HStack space={5} style={styles.settingFeeStack}>
          <View flex={2}>
            <Divider borderColor={colors.divider} />
            <FormControl>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    placeholder=""
                    keyboardType="numeric"
                    variant="unstyled"
                    onChangeText={(val) => onChange(val)}
                    borderColor={colors.lightText}
                    borderWidth={1}
                    autoCapitalize="none"
                    color={colors.lightText}
                    fontSize={15}
                    flex={1}
                    textAlign="center"
                  />
                )}
                name="mailPrice"
              />
            </FormControl>
            <Divider borderColor={colors.divider} />
          </View>
          <View flex={2}>
            <Ionicons name="heart" color={colors.ruby} size={20}></Ionicons>
            <Text color={colors.lightText} fontSize={10}>
              {" "}
              / per 50 characters
            </Text>
          </View>
          <View flex={3}>
            <Text color={colors.lightText} fontSize={18}>
              Mail Me Fee
            </Text>
          </View>
        </HStack>
        <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
          <Row
            data={tableHead}
            style={styles.head}
            textStyle={styles.textNoti}
          />
          {data.map((rowData, index) => (
            <TableWrapper key={index} style={styles.row}>
               {rowData.map((cellData, cellIndex) => (
                <Cell
                  key={cellIndex}
                  data={rederId(cellData, cellIndex)}
                  textStyle={{ color: "#000" }}
                />
              ))}
            </TableWrapper>
          ))}
        </Table>
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
};
export default connect(mapStates, mapDispatch)(SettingFeeForm);
