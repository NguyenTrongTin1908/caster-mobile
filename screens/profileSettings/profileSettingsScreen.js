import React, { Component } from "react";
import { BackHandler, SafeAreaView, View, StatusBar, Text, StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { TransitionPresets } from "react-navigation-stack";
import { Switch } from 'react-native-switch';

class ProfileSettingsScreen extends Component {

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
        privateAccount: false,
        everyoneCanMessageUser: true,
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.blackColor }}>
                <StatusBar translucent={false} backgroundColor={Colors.blackColor} />
                <View style={{ flex: 1 }}>
                    {this.header()}
                    {this.privacySettingInfo()}
                    {this.divider()}
                    {this.messageSettingInfo()}
                    {this.divider()}
                </View>
            </SafeAreaView>
        )
    }

    messageSettingInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding, }}>
                <Text style={{ ...Fonts.whiteColor19SemiBold }}>
                    Message Setting
                </Text>
                <View style={{ marginVertical: Sizes.fixPadding - 5.0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.grayColor16Bold }}>
                        Everyone can message me
                    </Text>
                    <Switch
                        value={this.state.everyoneCanMessageUser}
                        onValueChange={(val) => { this.setState({ everyoneCanMessageUser: val }) }}
                        disabled={false}
                        activeText={'On'}
                        activeTextStyle={{ ...Fonts.whiteColor16Bold }}
                        inactiveTextStyle={{ ...Fonts.whiteColor16Bold }}
                        inActiveText={'Off'}
                        circleSize={27}
                        barHeight={37}
                        circleBorderWidth={0}
                        backgroundActive={Colors.primaryColor}
                        backgroundInactive={'#9E9E9E'}
                        circleActiveColor={Colors.whiteColor}
                        circleInActiveColor={Colors.whiteColor}
                        switchLeftPx={5}
                        switchRightPx={5}
                        switchWidthMultiplier={2.8}
                    />
                </View>
                <Text style={{ ...Fonts.grayColor15Regular }}>
                    If you on this setting then everyone can message you & If you off this setting then only your followers can message you.
                </Text>
            </View>
        )
    }

    divider() {
        return (
            <View
                style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    height: 1.0,
                    marginHorizontal: Sizes.fixPadding,
                    marginVertical: Sizes.fixPadding + 5.0
                }}
            />
        )
    }

    privacySettingInfo() {
        return (
            <View style={{ marginTop: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding, }}>
                <Text style={{ ...Fonts.whiteColor19SemiBold }}>
                    Privacy Setting
                </Text>
                <View style={{ marginVertical: Sizes.fixPadding - 5.0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.grayColor16Bold }}>
                        Private Account
                    </Text>
                    <Switch
                        value={this.state.privateAccount}
                        onValueChange={(val) => { this.setState({ privateAccount: val }) }}
                        disabled={false}
                        activeText={'On'}
                        activeTextStyle={{ ...Fonts.whiteColor16Bold }}
                        inactiveTextStyle={{ ...Fonts.whiteColor16Bold }}
                        inActiveText={'Off'}
                        circleSize={27}
                        barHeight={37}
                        circleBorderWidth={0}
                        backgroundActive={Colors.primaryColor}
                        backgroundInactive={'#9E9E9E'}
                        circleActiveColor={Colors.whiteColor}
                        circleInActiveColor={Colors.whiteColor}
                        switchLeftPx={5}
                        switchRightPx={5}
                        switchWidthMultiplier={2.8}
                    />
                </View>
                <Text style={{ ...Fonts.grayColor14Regular }}>
                    In private account only your followers can show your posts.
                </Text>
            </View>
        )
    }

    header() {
        return (
            <View style={styles.headerWrapStyle}>
                <Text style={{ ...Fonts.whiteColor20Bold }}>
                    Profile Settings
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

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding + 5.0,
    },
})

ProfileSettingsScreen.navigationOptions = () => {
    return {
        header: () => null,
        ...TransitionPresets.SlideFromRightIOS,
    }
}

export default withNavigation(ProfileSettingsScreen);