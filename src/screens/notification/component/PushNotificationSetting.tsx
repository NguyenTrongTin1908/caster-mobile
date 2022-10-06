import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  View,
  Heading,
  ScrollView,
  Switch,
  Checkbox,
} from "native-base";
import { colors } from "utils/theme";
import Button from "components/uis/Button";
import { useNavigation } from "@react-navigation/core";
import { Alert, SafeAreaView } from "react-native";
import { connect } from "react-redux";
import { IPerformer, ICountry } from "src/interfaces";
import { Table, Row, Cell, TableWrapper } from "react-native-table-component";
import { performerService } from "services/perfomer.service";
import styles from "../style";
import HeaderMenu from "components/tab/HeaderMenu";
interface IProps {
  current: IPerformer;
}
const PushNotificationSetting = ({ current }: IProps): React.ReactElement => {
  const [list, setList] = useState(current.notificationSetting);
  const tableHeadGeneral = ["General", "Active"];
  const tableHeadTime = ["Time Sensative", "Active"];
  const tableHeadHost = ["Host", "Active"];
  const tableHeadSystem = ["System", "Active"];
  const [submitting, setSubmitting] = useState(false);
  const [render, setRender] = useState(false);
  const [active, setActive] = useState(false);
  const navigation = useNavigation() as any;
  const handleSubmit = async () => {
    try {
      await performerService.updateNotificationSetting(current._id, list);
      Alert.alert("Updated successfully");
    } catch (error) {
      Alert.alert("Error occured, please try again later");
    }
  };
  // useEffect(() => {
  //   setList(current.notificationSetting);
  // }, []);
  // useEffect(async () => {
  //   await handleSubmit();
  // }, [list]);
  const generalData = [
    [
      {
        name: "Direct Mail Messenger",
      },
      {
        key: "mail",
        status: list?.mail,
      },
    ],
    [
      {
        name: "Comments",
      },
      {
        key: "comment",
        status: list?.comment,
      },
    ],
    [
      {
        name: "New Followers",
      },
      {
        key: "follower",
        status: list?.follower,
      },
    ],
    [
      {
        name: "New Content",
      },
      {
        key: "newContent",
        status: list?.newContent,
      },
    ],
  ];
  const timeData = [
    [
      {
        name: "Following Goes Live",
      },
      {
        key: "followingGoLive",
        status: list?.followingGoLive,
      },
    ],
    [
      {
        name: "Private Chat",
      },
      {
        key: "followingPrivateChat",
        status: list?.followingPrivateChat,
      },
    ],
    [
      {
        name: "Moderator",
      },
      {
        key: "moderator",
        status: list?.moderator,
      },
    ],
  ];
  const hostData = [
    [
      {
        name: "Sposorship",
      },
      {
        key: "sposorship",
        status: list?.sposorship,
      },
    ],
    [
      {
        name: "Private Chat Request",
      },
      {
        key: "privateChatRequest",
        status: list?.privateChatRequest,
      },
    ],
  ];
  const systemData = [
    [
      {
        name: "Caster Admin",
      },
      {
        key: "casterAdminMessage",
        status: list?.casterAdminMessage,
      },
    ],
    [
      {
        name: "Upgraded Compelete",
      },
      {
        key: "upgradedComplete",
        status: list?.upgradedComplete,
      },
    ],
  ];
  const handleCheckBox = async (key: any, value) => {
    let data = list;
    data[key] = value;
    setList({ ...data });
    // await setList({ ...list, [record.key]: !record.status });
  };
  const handleActive = async () => {
    // setList({ ...list, active: !list?.active });
    let data = list;
    data["active"] = !active;
    setList({ ...data });
    setActive(!active);
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
          <Text>{render}</Text>
          <View height={150}>
            <View style={styles.notificationRow}>
              <Text color={colors.lightText} fontSize={22}>
                Push Notifications
              </Text>
              <Switch
                size="lg"
                alignSelf={"center"}
                isChecked={active}
                onChange={handleActive}
                aria-label="active"
              />
            </View>
            <View style={styles.notificationRow}>
              <Checkbox
                isInvalid
                value="invalid"
                isChecked={list.receiveOnDesktop}
                onChange={(val) => handleCheckBox("receiveOnDesktop", val)}
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
                      data={
                        cellIndex === 1 ? (
                          <View>
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
                          cellData.name
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
              <Row data={tableHeadTime} style={styles.head} />
              {timeData.map((rowData, index) => (
                <TableWrapper key={index} style={styles.row}>
                  {rowData.map((cellData, cellIndex) => (
                    <Cell
                      key={cellIndex}
                      data={
                        cellIndex === 1 ? (
                          <View>
                            <Checkbox
                              isInvalid
                              value="invalid"
                              isChecked={cellData.status}
                              onChange={(val) =>
                                handleCheckBox(cellData.key, val)
                              }
                              aria-label={cellData.key}
                            ></Checkbox>
                          </View>
                        ) : (
                          cellData.name
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
              <Row data={tableHeadHost} style={styles.head} />
              {hostData.map((rowData, index) => (
                <TableWrapper key={index} style={styles.row}>
                  {rowData.map((cellData, cellIndex) => (
                    <Cell
                      key={cellIndex}
                      data={
                        cellIndex === 1 ? (
                          <View>
                            <Checkbox
                              isInvalid
                              value="invalid"
                              isChecked={cellData.status}
                              onChange={(val) =>
                                handleCheckBox(cellData.key, val)
                              }
                              aria-label={cellData.key}
                            ></Checkbox>
                          </View>
                        ) : (
                          cellData.name
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
              <Row data={tableHeadSystem} style={styles.head} />
              {systemData.map((rowData, index) => (
                <TableWrapper key={index} style={styles.row}>
                  {rowData.map((cellData, cellIndex) => (
                    <Cell
                      key={cellIndex}
                      data={
                        cellIndex === 1 ? (
                          <View>
                            <Checkbox
                              isInvalid
                              value="invalid"
                              isChecked={cellData.status}
                              onChange={(val) =>
                                handleCheckBox(cellData.key, val)
                              }
                              aria-label={cellData.key}
                            ></Checkbox>
                          </View>
                        ) : (
                          cellData.name
                        )
                      }
                    />
                  ))}
                </TableWrapper>
              ))}
            </Table>
          </ScrollView>
        </View>
        <Box alignSelf="center" my={5}>
          <Button
            colorScheme="primary"
            onPress={handleSubmit}
            disabled={submitting}
            label="Save Changes"
          />
        </Box>
      </View>
      <View></View>
    </SafeAreaView>
  );
};
const mapStates = (state: any) => ({
  ...state.user,
  isLoggedIn: state.auth.loggedIn,
});
export default connect(mapStates)(PushNotificationSetting);
