import React, { Component, useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, SafeAreaView, StatusBar, BackHandler } from "react-native";
import { withNavigation } from "react-navigation";
import { Fonts, Colors, Sizes, } from "../../constants/styles";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { TransitionPresets } from "react-navigation-stack";

const userMessages = [
    {
        id: '1',
        message: 'Hello',
        time: '9:35 AM',
        isSender: false,
    },
    {
        id: '2',
        message: 'Hi',
        time: '9:36 AM',
        isSender: true,
        isSeen: true,
    },
    {
        id: '3',
        message: 'How are you?',
        time: '9:38 AM',
        isSender: false,
    },
    {
        id: '4',
        message: 'I\'m fine.How are you?',
        time: '9:38 AM',
        isSender: true,
        isSeen: false,
    },
];

class MessagesScreen extends Component {

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    handleBackButton = () => {
        this.props.navigation.pop();
        return true;
    };

    state = {
        showOptions: false,
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.blackColor }}>
                <StatusBar translucent={false} backgroundColor={Colors.blackColor} />
                <View style={{ flex: 1 }}>
                    {this.header()}
                    <Message />
                </View>
            </SafeAreaView>
        )
    }

    header() {
        return (
            <View style={styles.headerWrapStyle}>
                <Text style={{ ...Fonts.whiteColor20Bold }}>
                    Ellison Perry
                </Text>
                <MaterialIcons
                    name="arrow-back"
                    color={Colors.whiteColor}
                    size={24}
                    style={{
                        position: 'absolute',
                        left: 10.0,
                    }}
                    onPress={() => this.props.navigation.pop()}
                />
            </View>
        )
    }
}

const Message = () => {

    const [messagesList, setMessagesList] = useState(userMessages);

    function messages() {

        const renderItem = ({ item }) => {
            return (
                <View style={{
                    alignItems: item.isSender == true ? 'flex-end' : 'flex-start',
                    marginHorizontal: Sizes.fixPadding,
                    marginVertical: Sizes.fixPadding - 5.0,
                }}>
                    {
                        < View style={{
                            ...styles.messageWrapStyle,
                            borderTopLeftRadius: Sizes.fixPadding + 5.0,
                            borderBottomRightRadius: Sizes.fixPadding + 5.0,
                            backgroundColor: item.isSender == true ? Colors.primaryColor : Colors.whiteColor,
                        }}>
                            <Text style={item.isSender ? { ...Fonts.whiteColor16Regular } : { ...Fonts.primaryColor16Regular }}>
                                {item.message}
                            </Text>
                        </View>
                    }
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: Sizes.fixPadding - 5.0,
                    }}>
                        {item.isSender == true ?
                            item.isSeen == true ?
                                <Ionicons name="checkmark-done-sharp" size={18} color='#448AFF' />
                                :
                                <Ionicons name="checkmark-sharp" size={18} color='#448AFF' />
                            : null
                        }
                        <Text style={{
                            marginTop: Sizes.fixPadding - 5.0,
                            marginLeft: Sizes.fixPadding - 5.0,
                            ...Fonts.lightGrayColor13Regular,
                        }}>
                            {item.time}
                        </Text>
                    </View>
                </View >
            )
        }

        return (
            <FlatList
                inverted
                data={messagesList}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingVertical: Sizes.fixPadding * 2.0,
                    flexDirection: 'column-reverse',
                }}
            />
        )
    }

    function addMessage({ message }) {

        const oldMessages = messagesList;
        let date = Date();
        let hour = (new Date(date)).getHours();
        let minute = (new Date(date)).getMinutes();
        let AmPm = hour >= 12 ? 'PM' : 'AM';
        let finalhour = hour > 12 ? (hour - 12) : hour;

        const newMessage = {
            id: messagesList.length + 1,
            message: message,
            time: `${finalhour}:${minute} ${AmPm}`,
            isSender: true,
            isSeen: false,
        }

        oldMessages.push(newMessage);
        setMessagesList(oldMessages);
    }

    function typeMessage() {
        const [message, setMessage] = useState('');
        return (
            <View style={styles.bottomWrapStyle}>
                <View style={styles.textFieldWrapStyle}>
                    <TextInput
                        selectionColor={Colors.whiteColor}
                        value={message}
                        onChangeText={setMessage}
                        placeholder='Type a Message'
                        style={{ ...Fonts.whiteColor14Regular }}
                        placeholderTextColor={Colors.whiteColor}
                        placeholderTextColor={Colors.grayColor}
                    />
                </View>
                <View style={styles.sendButtonStyle}>
                    <MaterialCommunityIcons name="send" size={24}
                        color={Colors.yellowColor}
                        onPress={() => {
                            if (message != '') {
                                addMessage({ message: message })
                                setMessage('');
                            }
                        }}
                    />
                </View>
            </View>
        )
    }

    return <View style={{ flex: 1, }}>
        {messages()}
        {typeMessage()}
    </View>
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding + 5.0,
    },
    messageWrapStyle: {
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding,
    },
    bottomWrapStyle: {
        flexDirection: 'row',
        marginBottom: Sizes.fixPadding + 3.0,
        alignItems: 'center',
        marginHorizontal: Sizes.fixPadding,
    },
    textFieldWrapStyle: {
        backgroundColor: '#333333',
        borderRadius: Sizes.fixPadding,
        height: 50.0,
        justifyContent: 'center',
        flex: 1,
        paddingLeft: Sizes.fixPadding,
    },
    sendButtonStyle: {
        height: 44.0,
        width: 44.0,
        borderRadius: 22.0,
        backgroundColor: '#333333',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: Sizes.fixPadding,
    },
    bottomSheetWrapStyle: {
        backgroundColor: Colors.whiteColor,
        margin: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding,
        padding: Sizes.fixPadding * 3.0,
    },
    attachmentOptionsWrapStyle: {
        borderRadius: 30.0,
        height: 60.0,
        width: 60.0,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

MessagesScreen.navigationOptions = () => {
    return {
        header: () => null,
        ...TransitionPresets.SlideFromRightIOS,
    }
}

export default withNavigation(MessagesScreen);