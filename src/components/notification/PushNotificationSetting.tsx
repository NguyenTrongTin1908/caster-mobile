import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  View,
  Heading,
  ScrollView,
  Switch,
  Checkbox,
  FormControl,
} from "native-base";
import { colors } from "utils/theme";
import Button from "components/uis/Button";
import { useNavigation } from "@react-navigation/core";
import { Alert, SafeAreaView } from "react-native";
import { connect } from "react-redux";
import { IPerformer } from "src/interfaces";
import { Table, Row, Cell, TableWrapper } from "react-native-table-component";
import { performerService } from "services/perfomer.service";
import { setCurrentUser } from "services/redux/user/actions";

import styles from "./style";
import HeaderMenu from "components/tab/HeaderMenu";
import { Controller, useForm } from "react-hook-form";
interface IProps {
  current: IPerformer;
  setCurrentUser: Function;
}
const PushNotificationSetting = ({
  current,
  setCurrentUser,
}: IProps): React.ReactElement => {
  const { control, handleSubmit } = useForm();
  const [list, setList] = useState(current.notificationSetting);
  const tableHeadGeneral = ["General", "Active"];
  const tableHeadTime = ["Time Sensative", "Active"];
  const tableHeadHost = ["Host", "Active"];
  const tableHeadSystem = ["System", "Active"];
  const dataTable = ["name", "key"];
  const [submitting, setSubmitting] = useState(false);
  const [receive, setReceive] = useState(
    current.notificationSetting.receiveOnDesktop
  );
  const [active, setActive] = useState(current.notificationSetting.active);
  const navigation = useNavigation() as any;
  const [generalData, setGeneralData] = useState([]) as any;
  const [timeData, setTimeData] = useState([]) as any;
  const [systemData, setSystemData] = useState([]) as any;
  const [hostData, setHostData] = useState([]) as any;

  const submit = async ({
    mail,
    comment,
    newContent,
    follower,
    followingGoLive,
    followingPrivateChat,
    moderator,
    // sposorship,

    privateChatRequest,
    casterAdminMessage,
    upgradedComplete,
  }: any): Promise<void> => {
    const data = {
      mail,
      comment,
      newContent,
      follower,
      followingGoLive,
      followingPrivateChat,
      moderator,

      // sposorship,
      privateChatRequest,
      casterAdminMessage,
      upgradedComplete,
    };
    try {
      await performerService.updateNotificationSetting(current._id, {
        ...list,
        ...data,
      });
      setCurrentUser({ ...current, notificationSetting: { ...list, ...data } });

      Alert.alert("Updated successfully");
      navigation.navigate("NotificationPage");
    } catch (error) {
      Alert.alert("Error occured, please try again later");
    }
  };

  const [generalSource] = useState([
    {
      name: "Direct Mail Messenger",
      key: "mail",
    },
    {
      name: "Comments",
      key: "comment",
    },
    {
      key: "follower",
      name: "New Followers",
    },
    { name: "New Content", key: "newContent" },
  ]);
  const [timeSource] = useState([
    {
      name: "Following Goes Live",
      key: "followingGoLive",
    },

    {
      name: "Private Chat",
      key: "followingPrivateChat",
    },

    {
      name: "Moderator",
      key: "moderator",
    },
  ]);
  const [hostSource] = useState([
    // {
    //   name: "Sposorship",
    //   key: "sposorship",
    // },

    {
      name: "Private Chat Request",
      key: "privateChatRequest",
    },
  ]);
  const [systemSource] = useState([
    {
      name: "Caster Admin",
      key: "casterAdminMessage",
    },

    {
      name: "Upgraded Compelete",
      key: "upgradedComplete",
    },
  ]);

  const handleCheckBox = async () => {
    let data = list;
    data["receiveOnDesktop"] = !receive;
    setList({ ...data });
    setReceive(!receive);
  };
  const handleActive = () => {
    let data = list;
    data["active"] = !active;
    setList({ ...data });
    setActive(!active);
  };
  useEffect(() => {
    const array = [] as any;
    if (generalSource && generalSource.length > 0) {
      for (const item of generalSource) {
        const arrayData = dataTable.map((key: any) => {
          return item[key];
        });
        array.push(arrayData);
      }
    }
    setGeneralData(array);
  }, [generalSource]);
  useEffect(() => {
    const array = [] as any;
    if (timeSource && timeSource.length > 0) {
      for (const item of timeSource) {
        const arrayData = dataTable.map((key: any) => {
          return item[key];
        });
        array.push(arrayData);
      }
    }
    setTimeData(array);
  }, [timeSource]);
  useEffect(() => {
    const array = [] as any;
    if (hostSource && hostSource.length > 0) {
      for (const item of hostSource) {
        const arrayData = dataTable.map((key: any) => {
          return item[key];
        });
        array.push(arrayData);
      }
    }
    setHostData(array);
  }, [hostSource]);
  useEffect(() => {
    const array = [] as any;
    if (systemSource && systemSource.length > 0) {
      for (const item of systemSource) {
        const arrayData = dataTable.map((key: any) => {
          return item[key];
        });
        array.push(arrayData);
      }
    }
    setSystemData(array);
  }, [systemSource]);

  const renderTableData = (data, index) => {
    if (index > 0) {
      return (
        <FormControl>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <View alignSelf={"center"}>
                  <Checkbox
                    value={value}
                    onChange={(val) => onChange(val)}
                    id={data}
                    isChecked={value}
                    aria-label={data}
                  />
                </View>
              );
            }}
            name={data}
            defaultValue={list[data]}
          />
        </FormControl>
      );
    }
    return data;
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <HeaderMenu />
        <Heading
          mb={4}
          fontSize={28}
          textAlign="center"
          color={colors.lightText}
          bold
        >
          Notification Setting
        </Heading>
        <View style={styles.container}>
          <View height={150}>
            <View style={styles.notificationRow}>
              <Text color={colors.lightText} fontSize={22}>
                Push Notifications
              </Text>
              <Switch
                size="lg"
                alignSelf={"center"}
                isChecked={active}
                onValueChange={handleActive}
                aria-label="active"
              />
            </View>
            <View style={styles.notificationRow}>
              <Checkbox
                value="receiveOnDesktop"
                isChecked={receive}
                onChange={handleCheckBox}
                aria-label="receiveOnDesktop"
              ></Checkbox>
              <Text color={colors.lightText} fontSize={15}>
                Receive desktop notifications when you online
              </Text>
            </View>
          </View>
          <ScrollView>
            <Table
              borderStyle={{ borderColor: colors.darkText, borderWidth: 1 }}
            >
              <Row
                data={tableHeadGeneral}
                style={styles.head}
                textStyle={styles.textNoti}
              />
              {generalData.map((rowData, index) => (
                <TableWrapper key={index} style={styles.row}>
                  {rowData.map((cellData: any, cellIndex) => (
                    <Cell
                      key={cellIndex}
                      textStyle={{ color: "#000" }}
                      data={renderTableData(cellData, cellIndex)}
                    />
                  ))}
                </TableWrapper>
              ))}
            </Table>
            <Table
              borderStyle={{ borderColor: colors.darkText, borderWidth: 1 }}
            >
              <Row
                data={tableHeadTime}
                style={styles.head}
                textStyle={styles.textNoti}
              />
              {timeData.map((rowData, index) => (
                <TableWrapper key={index} style={styles.row}>
                  {rowData.map((cellData: any, cellIndex) => (
                    <Cell
                      key={cellIndex}
                      textStyle={{ color: "#000" }}
                      data={renderTableData(cellData, cellIndex)}
                    />
                  ))}
                </TableWrapper>
              ))}
            </Table>
            <Table
              borderStyle={{ borderColor: colors.darkText, borderWidth: 1 }}
            >
              <Row
                data={tableHeadHost}
                style={styles.head}
                textStyle={styles.textNoti}
              />
              {hostData.map((rowData, index) => (
                <TableWrapper key={index} style={styles.row}>
                  {rowData.map((cellData: any, cellIndex) => (
                    <Cell
                      key={cellIndex}
                      textStyle={{ color: "#000" }}
                      data={renderTableData(cellData, cellIndex)}
                    />
                  ))}
                </TableWrapper>
              ))}
            </Table>
            <Table
              borderStyle={{ borderColor: colors.darkText, borderWidth: 1 }}
            >
              <Row
                data={tableHeadSystem}
                style={styles.head}
                textStyle={styles.textNoti}
              />
              {systemData.map((rowData, index) => (
                <TableWrapper key={index} style={styles.row}>
                  {rowData.map((cellData: any, cellIndex) => (
                    <Cell
                      key={cellIndex}
                      textStyle={{ color: "#000" }}
                      data={renderTableData(cellData, cellIndex)}
                    />
                  ))}
                </TableWrapper>
              ))}
            </Table>
            {/* <Table
              borderStyle={{ borderColor: colors.darkText, borderWidth: 1 }}
            >
              <Row
                data={tableHeadTime}
                style={styles.head}
                textStyle={styles.textNoti}
              />
              {timeData.map((rowData, index) => (
                <TableWrapper key={index} style={styles.row}>
                  {rowData.map((cellData: any, cellIndex) => (
                    <Cell
                      key={cellIndex}
                      textStyle={{ color: "#000" }}
                      data={cellData}
                    />
                  ))}
                </TableWrapper>
              ))}
            </Table>
            <Table
              borderStyle={{ borderColor: colors.darkText, borderWidth: 1 }}
            >
              <Row
                data={tableHeadHost}
                style={styles.head}
                textStyle={styles.textNoti}
              />
              {hostData.map((rowData, index) => (
                <TableWrapper key={index} style={styles.row}>
                  {rowData.map((cellData: any, cellIndex) => (
                    <Cell
                      key={cellIndex}
                      textStyle={{ color: "#000" }}
                      data={
                        cellIndex === 1 ? (
                          <View alignSelf={"center"}>
                            <Checkbox
                              key={cellIndex}
                              value={cellData.key}
                              isChecked={cellData.status}
                              onChange={(val) =>
                                handleCheckBox(cellData.key, val)
                              }
                              aria-label={cellData.key}
                            ></Checkbox>
                          </View>
                        ) : (
                          <View alignSelf={"center"}>
                            <Text>{cellData.name}</Text>
                          </View>
                        )
                      }
                    />
                  ))}
                </TableWrapper>
              ))}
            </Table>
            <Table
              borderStyle={{ borderColor: colors.darkText, borderWidth: 1 }}
            >
              <Row
                data={tableHeadSystem}
                style={styles.head}
                textStyle={styles.textNoti}
              />
              {systemData.map((rowData, index) => (
                <TableWrapper key={index} style={styles.row}>
                  {rowData.map((cellData: any, cellIndex) => (
                    <Cell
                      key={cellIndex}
                      textStyle={{ color: "#000" }}
                      data={
                        cellIndex === 1 ? (
                          <View alignSelf={"center"}>
                            <Checkbox
                              key={cellIndex}
                              value={cellData.key}
                              isChecked={cellData.status}
                              onChange={(val) =>
                                handleCheckBox(cellData.key, val)
                              }
                              aria-label={cellData.key}
                            ></Checkbox>
                          </View>
                        ) : (
                          <View alignSelf={"center"}>
                            <Text>{cellData.name}</Text>
                          </View>
                        )
                      }
                    />
                  ))}
                </TableWrapper>
              ))}
            </Table> */}
          </ScrollView>
        </View>
        <Box alignSelf="center" my={5}>
          <Button
            colorScheme="primary"
            onPress={handleSubmit(submit)}
            disabled={submitting}
            label="Save Changes"
          />
        </Box>
      </View>
      <View></View>
    </SafeAreaView>
  );
};

const mapDispatch = {
  setCurrentUser,
};
const mapStates = (state: any) => ({
  ...state.user,
  isLoggedIn: state.auth.loggedIn,
});
export default connect(mapStates, mapDispatch)(PushNotificationSetting);
